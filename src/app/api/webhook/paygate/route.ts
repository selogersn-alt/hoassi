import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDonationEmail } from "@/lib/mail";

/**
 * =========================================================================
 * WEBHOOK PAYGATE GLOBAL - Validation des Paiements
 * =========================================================================
 * PayGate appelle cette URL après chaque transaction.
 */

export async function POST(request: Request) {
  try {
    // PayGate envoie souvent les données en x-www-form-urlencoded ou JSON
    // On essaie de récupérer le body quel que soit le format
    let body;
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }

    console.log("[Webhook PayGate] Données reçues:", body);

    const transactionId = body.identifier?.toString(); // Notre ID généré (PG_...)
    const status = body.status?.toString(); // 0 = Succès chez PayGate
    const amount = Number(body.amount);

    if (!transactionId) {
      return NextResponse.json({ error: "Identifier manquant" }, { status: 400 });
    }

    // Uniquement si le paiement est réussi (status 0)
    if (status === "0") {
      
      // Chercher la donation par son transactionId (qui est notre identifier PayGate)
      const donation = await prisma.donation.findUnique({
        where: { transactionId },
        include: { project: true }
      });

      if (donation && donation.status !== "COMPLETED") {
        // Mise à jour atomique
        await prisma.$transaction([
          prisma.donation.update({
            where: { id: donation.id },
            data: { 
              status: "COMPLETED",
              // On peut aussi stocker la référence réelle de PayGate si on veut
              message: donation.message ? `${donation.message} (Ref: ${body.tx_reference})` : `(Ref: ${body.tx_reference})`
            }
          }),
          prisma.project.update({
            where: { id: donation.projectId },
            data: {
              raised: { increment: donation.amount },
              donorsCount: { increment: 1 }
            }
          })
        ]);

        // Email de notification
        if (donation.project.email) {
          sendDonationEmail({
            to: donation.project.email,
            projectTitle: donation.project.title,
            donorName: donation.publicName || "Donateur anonyme",
            amount: donation.amount,
            message: donation.message || ""
          }).catch(e => console.error("SMTP error:", e));
        }

        console.log(`[Success PayGate] Don de ${donation.amount} validé pour ${donation.projectId}`);
      } else {
        // On vérifie si c'est un don pour un influenceur
        const influencerDonation = await prisma.influencerDonation.findUnique({
          where: { transactionId },
          include: { influencer: true }
        });

        if (influencerDonation && influencerDonation.status !== "COMPLETED") {
          await prisma.$transaction([
            prisma.influencerDonation.update({
              where: { id: influencerDonation.id },
              data: { status: "COMPLETED" }
            }),
            prisma.influencer.update({
              where: { id: influencerDonation.influencerId },
              data: {
                raised: { increment: influencerDonation.amount },
                donorsCount: { increment: 1 }
              }
            })
          ]);

           if (influencerDonation.influencer.email) {
            sendDonationEmail({
              to: influencerDonation.influencer.email,
              projectTitle: `Soutien @${influencerDonation.influencer.username}`,
              donorName: influencerDonation.publicName || "Un follower",
              amount: influencerDonation.amount,
              message: influencerDonation.message || ""
            }).catch(e => console.error("SMTP error:", e));
          }
          console.log(`[Success PayGate] Soutien Influenceur validé (+${influencerDonation.amount})`);
        }
      }

      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    return NextResponse.json({ message: "Statut ignoré" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook PayGate Error]:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
