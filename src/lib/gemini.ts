import { GoogleGenAI } from "@google/genai";

/**
 * Returns the Gemini API key from environment variables.
 * Prioritizes GEMINI_API_KEY, then GOOGLE_API_KEY, then GOOGLE_GENAI_API_KEY.
 */
export function getGeminiApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    undefined
  );
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }

  return geminiClient;
}

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
export const DEFAULT_EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface GenerateGeminiOptions {
  model?: string;
  contents: string | Array<unknown>;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

/**
 * Active Gemini models supported by the API.
 * Uses gemini-3.8-flash as primary, followed by gemini-flash-latest, gemini-3.7-flash, etc.
 */
const ACTIVE_GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-flash-lite-latest",
];

/**
 * Generic content generation with Google Gemini with automatic model fallback & retry
 */
export async function generateGeminiContent(options: GenerateGeminiOptions): Promise<string> {
  const ai = getGeminiClient();
  const rawModel = options.model || DEFAULT_GEMINI_MODEL;
  const primaryModel = rawModel.startsWith("gemini") ? rawModel : DEFAULT_GEMINI_MODEL;

  const candidateModels = [
    primaryModel,
    ...ACTIVE_GEMINI_MODELS,
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  const config: Record<string, unknown> = {};
  if (options.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }
  if (options.temperature !== undefined) {
    config.temperature = options.temperature;
  }
  if (options.maxOutputTokens !== undefined) {
    config.maxOutputTokens = options.maxOutputTokens;
  }
  if (options.responseMimeType) {
    config.responseMimeType = options.responseMimeType;
  }

  let lastError: unknown = null;
  for (const model of candidateModels) {
    let attempts = 0;
    const maxAttempts = 2;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents as any,
          config: Object.keys(config).length > 0 ? (config as any) : undefined,
        });

        const text = response.text || "";
        return text.trim();
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);

        // If 503 high demand or 429 rate limit, retry before falling back
        if (
          (msg.includes("503") ||
            msg.includes("high demand") ||
            msg.includes("overloaded") ||
            msg.includes("429") ||
            msg.includes("RESOURCE_EXHAUSTED")) &&
          attempts < maxAttempts
        ) {
          console.warn(`[gemini] Transient high demand on ${model} (attempt ${attempts}), retrying in 1s...`);
          await sleep(1000);
          continue;
        }

        // If model not found or deprecated, immediately try next candidate model
        if (
          msg.includes("404") ||
          msg.includes("not found") ||
          msg.includes("no longer available") ||
          msg.includes("NOT_FOUND") ||
          msg.includes("is not supported")
        ) {
          console.warn(`[gemini] Model ${model} unavailable, trying next fallback model...`);
          break;
        }

        if (attempts >= maxAttempts) {
          console.warn(`[gemini] Error with model ${model}: ${msg}, falling back to next model...`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with Gemini models");
}

/**
 * Structured JSON generation with Google Gemini
 */
export async function generateGeminiJson<T = Record<string, unknown>>(
  prompt: string,
  systemInstruction?: string,
  model = DEFAULT_GEMINI_MODEL
): Promise<T> {
  const text = await generateGeminiContent({
    model,
    contents: prompt,
    systemInstruction,
    temperature: 0.1,
    responseMimeType: "application/json",
  });

  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  // Parse JSON with fallback regex in case of markdown fences
  try {
    return JSON.parse(text) as T;
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from Gemini response: " + text.slice(0, 200));
    }
    return JSON.parse(jsonMatch[0]) as T;
  }
}

/**
 * Multimodal generation with Google Gemini for base64 images / scanned resumes with fallback & retry
 */
export async function generateGeminiVisionJson<T = Record<string, unknown>>(
  base64Images: string[],
  prompt: string,
  systemInstruction?: string,
  model = DEFAULT_GEMINI_MODEL
): Promise<T> {
  const ai = getGeminiClient();

  const parts: Array<unknown> = [{ text: prompt }];

  for (const b64 of base64Images) {
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: b64,
      },
    });
  }

  const config: Record<string, unknown> = {
    temperature: 0.1,
    responseMimeType: "application/json",
  };
  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  const rawModel = model || DEFAULT_GEMINI_MODEL;
  const primaryModel = rawModel.startsWith("gemini") ? rawModel : DEFAULT_GEMINI_MODEL;

  const candidateModels = [
    primaryModel,
    ...ACTIVE_GEMINI_MODELS,
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  let lastError: unknown = null;
  for (const candidateModel of candidateModels) {
    let attempts = 0;
    const maxAttempts = 2;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents: [
            {
              role: "user",
              parts,
            },
          ] as any,
          config: config as any,
        });

        const text = response.text || "";
        if (!text) {
          throw new Error("Gemini Vision returned empty response");
        }

        try {
          return JSON.parse(text) as T;
        } catch {
          const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (!jsonMatch) {
            throw new Error("Failed to extract valid JSON from Gemini Vision response");
          }
          return JSON.parse(jsonMatch[0]) as T;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);

        if (
          (msg.includes("503") ||
            msg.includes("high demand") ||
            msg.includes("overloaded") ||
            msg.includes("429") ||
            msg.includes("RESOURCE_EXHAUSTED")) &&
          attempts < maxAttempts
        ) {
          console.warn(`[gemini] Transient high demand on vision model ${candidateModel}, retrying in 1s...`);
          await sleep(1000);
          continue;
        }

        if (
          msg.includes("404") ||
          msg.includes("not found") ||
          msg.includes("no longer available") ||
          msg.includes("NOT_FOUND") ||
          msg.includes("is not supported")
        ) {
          console.warn(`[gemini] Vision model ${candidateModel} unavailable, trying next fallback model...`);
          break;
        }

        if (attempts >= maxAttempts) {
          console.warn(`[gemini] Vision error with model ${candidateModel}: ${msg}, falling back...`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate vision content with Gemini models");
}

/**
 * Generates embeddings using Gemini's embedding models
 */
export async function generateGeminiEmbedding(text: string): Promise<number[]> {
  const ai = getGeminiClient();
  const cleaned = text.replace(/\n/g, " ").trim();
  if (!cleaned) {
    return new Array(768).fill(0);
  }

  const candidateModels = [
    DEFAULT_EMBEDDING_MODEL,
    "gemini-embedding-001",
    "gemini-embedding-2",
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  let lastError: unknown = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: cleaned,
      });

      const values =
        (response.embeddings && response.embeddings[0]?.values) ||
        response.embedding?.values;

      if (values && values.length > 0) {
        return values;
      }
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      if (
        msg.includes("404") ||
        msg.includes("not found") ||
        msg.includes("NOT_FOUND") ||
        msg.includes("is not supported")
      ) {
        continue;
      }
      throw err;
    }
  }

  console.warn("[gemini] Failed to get embedding from Gemini models, falling back to zeroes:", lastError);
  return new Array(768).fill(0);
}

export interface GeminiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GeminiChatOptions {
  model?: string;
  messages: GeminiChatMessage[];
  temperature?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
  response_format?: { type: string };
  reasoning_effort?: string;
}

/**
 * Chat completion adapter compatible with OpenAI response interface.
 */
export async function geminiChatCompletion(options: GeminiChatOptions) {
  const systemMessage = options.messages.find((m) => m.role === "system")?.content;
  const conversation = options.messages.filter((m) => m.role !== "system");

  const contents = conversation.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const maxTokens = options.max_tokens ?? options.max_completion_tokens;
  const rawModel = options.model || DEFAULT_GEMINI_MODEL;
  const resolvedModel = rawModel.startsWith("gemini") ? rawModel : DEFAULT_GEMINI_MODEL;

  const text = await generateGeminiContent({
    model: resolvedModel,
    contents:
      contents.length > 0 ? (contents as any) : [{ role: "user", parts: [{ text: "Hello" }] }],
    systemInstruction: systemMessage,
    temperature: options.temperature,
    maxOutputTokens: maxTokens,
    responseMimeType:
      options.response_format?.type === "json_object"
        ? "application/json"
        : undefined,
  });

  return {
    choices: [
      {
        message: {
          content: text,
        },
      },
    ],
    usage: {
      prompt_tokens: Math.max(1, Math.round((systemMessage?.length || 0) / 4)),
      completion_tokens: Math.max(1, Math.round(text.length / 4)),
      total_tokens: Math.max(2, Math.round(((systemMessage?.length || 0) + text.length) / 4)),
    },
  };
}
