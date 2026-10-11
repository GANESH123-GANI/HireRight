import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { role } = await request.json().catch(() => ({ role: "admin" }));
    const targetRole = role === "jobseeker" ? "jobseeker" : "admin";

    let user = await prisma.user.findFirst({
      where: { role: targetRole },
      include: { organization: true },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        include: { organization: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const { token } = await createSession(user.id, user.organizationId);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        emailVerified: true,
      },
      organization: user.organization,
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("Demo login error:", err);
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
  }
}
