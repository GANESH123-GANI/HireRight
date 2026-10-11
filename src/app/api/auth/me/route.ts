import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        organizationId: user.organizationId,
        emailVerified: !!user.emailVerifiedAt,
      },
      organization: user.organization,
    });
  } catch (err) {
    console.error("Auth me error:", err);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
