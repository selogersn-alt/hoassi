import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDonationEmail } from "@/lib/mail";
import { processMobilePayment } from "@/lib/payment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    
    if (!body.amount || !body.network || !body.donorPhone) {
      return NextResponse.json(
        { error: "Montant, réseau et numéro de donneur requis" },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Montant invalide" },
        { status: 400 }
      );
    }

    // Récupérer le projet pour le titre
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
       return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    const paymentRes = await processMobilePayment({
      amount: amount,
      currency: "XOF",
      phoneNumber: body.donorPhone,
      network: body.network,
      projectId: projectId,
      donationType: "PROJECT",
      donorName: body.publicName || "Anonyme",
      projectName: project.title
    });

    if (!paymentRes.success) {
      return NextResponse.json({ error: paymentRes.message }, { status: 400 });
    }

    // 1. Enregistrer le don (Statut PENDING par défaut)
    const donation = await prisma.donation.create({
      data: {
        amount: amount,
        network: body.network,
        donorPhone: body.donorPhone,
        transactionId: paymentRes.transactionId || "TX-ERR",
        publicName: body.publicName || "Anonyme",
        message: body.message || null,
        projectId: projectId,
        status: "PENDING"
      }
    });

    // NOTE: On ne met plus à jour prisma.project.update ici.
    // C'est le WEBHOOK qui s'en chargera une fois le paiement confirmé.

    return NextResponse.json({
       donation: donation,
       paymentUrl: paymentRes.paymentUrl,
       message: paymentRes.message 
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors du don:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du traitement du don" },
      { status: 500 }
    );
  }
}
