import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") || "google";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. If Google OAuth credentials are fully provided in .env, redirect to Google consent screen
    if (provider === "google" && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      const redirectUri = `${appUrl}/api/auth/sso/callback`;
      const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
      googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
      googleAuthUrl.searchParams.set("response_type", "code");
      googleAuthUrl.searchParams.set("scope", "openid email profile");
      googleAuthUrl.searchParams.set("state", "google");
      return NextResponse.redirect(googleAuthUrl.toString());
    }

    // 2. If GitHub OAuth credentials are fully provided in .env, redirect to GitHub
    if (provider === "github" && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      const redirectUri = `${appUrl}/api/auth/sso/callback`;
      const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
      githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
      githubAuthUrl.searchParams.set("scope", "user:email");
      githubAuthUrl.searchParams.set("state", "github");
      return NextResponse.redirect(githubAuthUrl.toString());
    }

    // 3. Fallback / Dev mode: Instantly authenticate as Job Seeker candidate and redirect to /profile
    let candidate = await prisma.user.findFirst({
      where: { role: "jobseeker" },
      include: { organization: true, profile: true },
    });

    if (!candidate) {
      // Find default org or create one
      let org = await prisma.organization.findFirst();
      if (!org) {
        org = await prisma.organization.create({
          data: {
            name: "Techcitta",
            slug: "techcitta",
            plan: "enterprise",
          },
        });
      }

      candidate = await prisma.user.create({
        data: {
          email: "candidate@techcitta.com",
          name: "Alex Morgan",
          role: "jobseeker",
          password: "password123",
          organizationId: org.id,
          emailVerifiedAt: new Date(),
        },
        include: { organization: true, profile: true },
      });
    }

    // Ensure candidate has a profile
    if (!candidate.profile) {
      await prisma.profile.create({
        data: {
          userId: candidate.id,
          step: 1,
        },
      });
    }

    const { token, expiresAt } = await createSession(candidate.id, candidate.organizationId);

    // Redirect straight to Job Seeker portal
    const redirectUrl = new URL("/profile", request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    });

    return response;
  } catch (error) {
    console.error("SSO init error:", error);
    return NextResponse.redirect(new URL("/login?error=sso_failed", request.url));
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
