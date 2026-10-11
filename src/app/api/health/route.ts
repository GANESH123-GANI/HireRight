import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number }> = {};
  let healthy = true;

  // Database check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch {
    checks.database = { status: "error", latencyMs: Date.now() - dbStart };
    healthy = false;
  }

  // AI API key check (Gemini / OpenAI)
  checks.gemini = {
    status: (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) ? "configured" : "missing",
  };
  checks.openai = {
    status: process.env.OPENAI_API_KEY ? "configured" : "missing",
  };

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
