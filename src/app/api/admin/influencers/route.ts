import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const influencers = await prisma.influencer.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(influencers);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, approved, suspended, isVerified } = body;

    const updated = await prisma.influencer.update({
      where: { id },
      data: {
        approved: approved !== undefined ? approved : undefined,
        suspended: suspended !== undefined ? suspended : undefined,
        isVerified: isVerified !== undefined ? isVerified : undefined
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error updating influencer" }, { status: 500 });
  }
}
