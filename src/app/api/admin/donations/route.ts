import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const donations = await prisma.donation.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" }
  });

  const influencerDonations = await prisma.influencerDonation.findMany({
    include: { influencer: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ donations, influencerDonations });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, type, status } = body; // type is 'project' or 'influencer'

    if (type === 'project') {
      const updated = await prisma.donation.update({
        where: { id },
        data: { status }
      });
      return NextResponse.json(updated);
    } else {
      const updated = await prisma.influencerDonation.update({
        where: { id },
        data: { status }
      });
      return NextResponse.json(updated);
    }
  } catch (error) {
    return NextResponse.json({ error: "Error updating donation" }, { status: 500 });
  }
}
