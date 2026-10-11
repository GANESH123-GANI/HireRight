import { NextResponse } from "next/server";
import { getActiveUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { generateGeminiContent } from "@/lib/gemini";
import { rateLimit, rateLimitByIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const user = await getActiveUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [ipLimit, userLimit] = await Promise.all([
      rateLimitByIp(request, "ai-summary", { limit: 10, windowMs: 60_000 }),
      rateLimit(`ai-summary:${user.id}`, { limit: 10, windowMs: 60_000 }),
    ]);
    if (!ipLimit.allowed || !userLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const { currentRole, totalExperience, currentLocation, skills, workExperience, projects, education, currentCompany, aboutYou } = body;

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        currentRole: true,
        totalExperience: true,
        currentLocation: true,
        skills: true,
        workExperience: true,
        projects: true,
        education: true,
        currentCompany: true,
        aboutYou: true,
      },
    });

    const role = currentRole || profile?.currentRole || "";
    const experience = totalExperience || profile?.totalExperience || "";
    const location = currentLocation || profile?.currentLocation || "";
    const skillsList = skills || profile?.skills || "";
    const work = workExperience || profile?.workExperience || "";
    const projectData = projects || profile?.projects || "";
    const edu = education || profile?.education || "";
    const company = currentCompany || profile?.currentCompany || "";
    const existingSummary = aboutYou || profile?.aboutYou || "";

    const contextParts = [
      role && `Current/Target Role: ${role}`,
      experience && `Total Experience: ${experience}`,
      location && `Location: ${location}`,
      company && `Current Company: ${company}`,
      skillsList && `Technical Skills: ${skillsList}`,
      work && `Work Experience: ${work}`,
      projectData && `Projects: ${projectData}`,
      edu && `Education: ${edu}`,
      existingSummary && `Existing Summary: ${existingSummary}`,
    ].filter(Boolean);

    if (contextParts.length === 0) {
      return NextResponse.json(
        { error: "Please fill in at least your role or skills before generating a summary." },
        { status: 400 }
      );
    }

    const prompt = `You are a professional resume writer. Generate a concise, compelling professional summary (3-5 sentences) for a job seeker based on the following profile details. The summary should be written in first person, highlight key strengths, and be tailored for tech job applications.

Profile details:
${contextParts.join("\n")}

Rules:
- Write in first person ("I am..." or "Results-driven...")
- Be specific, not generic — reference actual skills and experience from the profile
- Keep it under 150 words
- Use strong action words and quantifiable achievements where possible
- Do NOT use bullet points — write as a paragraph
- Do NOT include a greeting or sign-off`;

    const summary = await generateGeminiContent({
      contents: prompt,
      systemInstruction: "You are a professional resume writer specializing in tech industry profiles.",
      temperature: 0.7,
      maxOutputTokens: 300,
    });

    if (!summary) {
      return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
    }

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("Generate summary error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI service temporarily unavailable. Please try again." }, { status: 500 });
  }
}
