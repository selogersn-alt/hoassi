import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendWithdrawalEmail } from "@/lib/mail";

/**
 * =========================================================================
 * API UTILISATEUR - Demandes de Retrait
 * =========================================================================
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, destination, type, referenceId } = body;

    if (!amount || !method || !destination || !referenceId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Vérifier que l'utilisateur est bien le proprio
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { projects: true, influencer: true }
    });

    if (!user) return NextResponse.json({ error: "User non trouvé" }, { status: 404 });

    let authorized = false;
    if (type === "PROJECT") {
      authorized = user.projects.some(p => p.id === referenceId);
    } else if (type === "INFLUENCER") {
      authorized = user.influencer?.id === referenceId;
    }

    if (!authorized) {
      return NextResponse.json({ error: "Action non autorisée sur cette ressource" }, { status: 403 });
    }

    // Vérifier le solde disponible (Brut)
    const resource = type === "PROJECT" 
      ? await prisma.project.findUnique({ where: { id: referenceId } })
      : await prisma.influencer.findUnique({ where: { id: referenceId } });

    if (!resource || resource.raised < amount) {
      return NextResponse.json({ error: "Solde insuffisant" }, { status: 400 });
    }

    // Récupérer la config des frais
    const config = await prisma.config.findUnique({ where: { id: "global" } });
    const platformRate = config?.commissionFee || 5.0;
    const techRate = config?.technicalFee || 2.0;

    // Calculs
    const grossAmount = amount; // Le montant que l'utilisateur a choisi de retirer (souvent le total)
    const platformFee = Math.floor(grossAmount * (platformRate / 100));
    const techFee = Math.floor(grossAmount * (techRate / 100));
    const netAmount = grossAmount - platformFee - techFee;

    const withdrawal = await prisma.withdrawal.create({
      data: {
        amount: netAmount,
        platformFee,
        techFee,
        grossAmount,
        method,
        destination,
        type,
        referenceId,
        requesterName: user.name || user.email,
        userEmail: user.email,
        status: "PENDING"
      }
    });

    // Envoyer email de "Facture / Reçu de Retrait"
    await sendWithdrawalEmail({
      to: session.user.email,
      amount: netAmount,
      status: withdrawal.status,
      method: withdrawal.method,
      grossAmount: grossAmount,
      platformFee: platformFee,
      techFee: techFee
    });

    return NextResponse.json(withdrawal, { status: 201 });

  } catch (error) {
    console.error("Withdrawal request error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
