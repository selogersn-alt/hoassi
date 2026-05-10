import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ads = await prisma.advertisement.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(ads);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ad = await prisma.advertisement.create({
      data: {
        location: body.location,
        type: body.type,
        content: body.content,
        link: body.link,
        active: body.active ?? true
      }
    });
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: "Error creating ad" }, { status: 500 });
  }
}
