import { proxyToBackend } from "@/lib/proxy";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try proxy first if backend is running
  try {
    const res = await proxyToBackend(request, {
      method: "GET",
      path: `/api/interviews/${id}`,
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return NextResponse.json(data);
      }
    }
  } catch {
    // Backend offline or error, proceed to Prisma
  }

  // Fallback to Prisma database
  try {
    const user = await getUserFromRequest(request);
    const interview = await prisma.interview.findFirst({
      where: {
        OR: [
          { id },
          ...(user ? [{ userId: user.userId }] : [])
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: true,
          }
        }
      }
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      interview,
      user: interview.user,
      profile: interview.user?.profile,
    });
  } catch (err) {
    console.error("Prisma interview lookup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

