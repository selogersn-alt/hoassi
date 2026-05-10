import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processMobilePayment } from "@/lib/payment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username: influencerParam } = await params;
    const body = await request.json();
    
    if (!body.amount || !body.network || !body.donorPhone) {
      return NextResponse.json(
        { error: "Montant, réseau et numéro requis" },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Montant de soutien invalide" },
        { status: 400 }
      );
    }

    const influencer = await prisma.influencer.findUnique({
      where: { username: influencerParam }
    });
    
    if (!influencer) {
       return NextResponse.json(
        { error: "Influenceur introuvable" },
        { status: 404 }
      );
    }

    // 1. Initialiser le paiement
    const paymentRes = await processMobilePayment({
      amount: amount,
      currency: "XOF",
      phoneNumber: body.donorPhone,
      network: body.network,
      influencerId: influencer.id,
      donationType: "INFLUENCER",
      donorName: body.publicName || "Follower",
      projectName: `Soutien @${influencer.username}`
    });

    if (!paymentRes.success) {
      return NextResponse.json({ error: paymentRes.message }, { status: 400 });
    }

    // 2. Enregistrer le don influenceur (PENDING)
    const donation = await prisma.influencerDonation.create({
      data: {
        amount: amount,
        network: body.network,
        donorPhone: body.donorPhone,
        transactionId: paymentRes.transactionId || "TX-ERR",
        publicName: body.publicName || "Un follower",
        message: body.message || null,
        influencerId: influencer.id,
        status: "PENDING"
      }
    });

    // NOTE: On ne met plus à jour prisma.influencer.update ici.
    // C'est le WEBHOOK qui s'en chargera une fois le paiement confirmé.

    return NextResponse.json({
      donation: donation,
      paymentUrl: paymentRes.paymentUrl,
      message: paymentRes.message 
    }, { status: 201 });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Erreur lors du don:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du soutien" },
      { status: 500 }
    );
  }
}
