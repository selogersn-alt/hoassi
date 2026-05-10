import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDonationEmail } from "@/lib/mail";

/**
 * =========================================================================
 * WEBHOOK FEDAPAY - Validation Automatique des Paiements
 * =========================================================================
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[Webhook FedaPay] Notification reçue:", body);

    // SECURITY: Vérification de signature FedaPay (À implémenter avec votre Webhook Secret)
    // const signature = request.headers.get("X-FEDAPAY-SIGNATURE");
    // if (!verifySignature(body, signature)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transactionId = (body.id || body.v1_transaction?.id)?.toString();
    const status = body.status || body.v1_transaction?.status;
    
    // FedaPay envoie souvent les métadonnées dans la transaction
    const metadata = body.v1_transaction?.custom_metadata || body.custom_metadata;
    const donationType = metadata?.donationType; // "PROJECT" ou "INFLUENCER"
    
    if (!transactionId) {
      return NextResponse.json({ error: "ID de transaction manquant" }, { status: 400 });
    }

    // Uniquement si le paiement est approuvé/réussi
    if (["approved", "success", "completed"].includes(status)) {
      
      if (donationType === "PROJECT") {
        // --- CAS PROJET CLASSIQUE ---
        const donation = await prisma.donation.findUnique({
          where: { transactionId },
          include: { project: true }
        });

        if (donation && donation.status !== "COMPLETED") {
          await prisma.$transaction([
            prisma.donation.update({
              where: { id: donation.id },
              data: { status: "COMPLETED" }
            }),
            prisma.project.update({
              where: { id: donation.projectId },
              data: {
                raised: { increment: donation.amount },
                donorsCount: { increment: 1 }
              }
            })
          ]);

          // Email de notification au porteur de projet
          if (donation.project.email) {
            sendDonationEmail({
              to: donation.project.email,
              projectTitle: donation.project.title,
              donorName: donation.publicName || "Donateur anonyme",
              amount: donation.amount,
              message: donation.message || ""
            }).catch(e => console.error("SMTP error:", e));
          }
          console.log(`[Success] Projet ${donation.projectId} mis à jour (+${donation.amount})`);
        }
      } 
      else if (donationType === "INFLUENCER") {
        // --- CAS INFLUENCER ---
        const donation = await prisma.influencerDonation.findUnique({
          where: { transactionId },
          include: { influencer: true }
        });

        if (donation && donation.status !== "COMPLETED") {
          await prisma.$transaction([
            prisma.influencerDonation.update({
              where: { id: donation.id },
              data: { status: "COMPLETED" }
            }),
            prisma.influencer.update({
              where: { id: donation.influencerId },
              data: {
                raised: { increment: donation.amount },
                donorsCount: { increment: 1 }
              }
            })
          ]);

          // Email de notification à l'influenceur
          if (donation.influencer.email) {
            sendDonationEmail({
              to: donation.influencer.email,
              projectTitle: `Soutien @${donation.influencer.username}`,
              donorName: donation.publicName || "Un follower",
              amount: donation.amount,
              message: donation.message || ""
            }).catch(e => console.error("SMTP error:", e));
          }
           console.log(`[Success] Influenceur ${donation.influencerId} mis à jour (+${donation.amount})`);
        }
      }

      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    return NextResponse.json({ message: "Statut ignoré" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook Error]:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
