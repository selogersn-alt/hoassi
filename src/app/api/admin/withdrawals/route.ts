import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendWithdrawalEmail } from "@/lib/mail";

/**
 * =========================================================================
 * API ADMIN - Gestion des Retraits
 * =========================================================================
 */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, status, adminNotes } = await request.json();

    const updated = await prisma.withdrawal.update({
      where: { id },
      data: { 
        status, 
        adminNotes,
        processedAt: status === "COMPLETED" || status === "REJECTED" ? new Date().toISOString() : undefined
      }
    });

    // Envoyer notification au porteur (Facture Finale)
    await sendWithdrawalEmail({
      to: updated.userEmail,
      amount: updated.amount,
      status: updated.status,
      method: updated.method,
      grossAmount: updated.grossAmount,
      platformFee: updated.platformFee,
      techFee: updated.techFee
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// Pour simuler une demande de retrait (utile pour tester)
export async function POST(request: Request) {
  try {
     const body = await request.json();
     
     // Logique simplifiée pour démo
      const withdrawal = await prisma.withdrawal.create({
        data: {
          amount: body.amount - (body.platformFee || 0) - (body.techFee || 0),
          platformFee: body.platformFee || 0,
          techFee: body.techFee || 0,
          grossAmount: body.amount,
          method: body.method,
          destination: body.destination,
          type: body.type,
          referenceId: body.referenceId,
          requesterName: body.requesterName,
          userEmail: body.userEmail || "admin@hoassi.tg",
          status: "PENDING"
        }
      });

     return NextResponse.json(withdrawal);
  } catch (error) {
     return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }
}
