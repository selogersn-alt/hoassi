import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendProjectStatusEmail } from "@/lib/mail";

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

    // Envoyer notification par email
    if (updated.email) {
      try {
        await sendProjectStatusEmail(
          updated.email,
          `Votre compte Créateur @${updated.username}`,
          updated.suspended ? "REJECTED" : (updated.approved ? "APPROVED" : "PENDING")
        );
      } catch (mailError) {
        console.error("Erreur envoi email créateur:", mailError);
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error updating influencer" }, { status: 500 });
  }
}
