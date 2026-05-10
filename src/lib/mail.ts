import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendDonationEmail({
  to,
  donorName,
  amount,
  message,
  projectTitle,
}: {
  to: string;
  donorName: string;
  amount: number;
  message?: string;
  projectTitle: string;
}) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: `Nouveau don reçu ! ✨ - ${projectTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h1 style="color: #D4AF37; text-align: center;">HOASSI</h1>
        <h2 style="color: #020617; text-align: center;">Bonne nouvelle !</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
          Bonjour,<br><br>
          Votre projet <strong>"${projectTitle}"</strong> vient de recevoir un nouveau soutien de la part de <strong>${donorName}</strong>.
        </p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Montant du don</p>
          <p style="margin: 5px 0 0 0; color: #020617; font-size: 32px; font-weight: 900;">${amount} FCFA</p>
        </div>
        ${message ? `
          <div style="border-left: 4px solid #D4AF37; padding: 10px 20px; background-color: #fffaf0; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-style: italic;">"${message}"</p>
          </div>
        ` : ""}
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
          Ceci est une notification automatique de la plateforme HOASSI propulsée par Digitalh.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur SMTP:", error);
  }
}
export async function sendWithdrawalEmail({
  to,
  amount,
  status,
  method,
  grossAmount,
  platformFee,
  techFee,
}: {
  to: string;
  amount: number;
  status: string;
  method: string;
  grossAmount?: number;
  platformFee?: number;
  techFee?: number;
}) {
  const isCompleted = status === "COMPLETED";
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: isCompleted ? "Facture de Retrait HOASSI - Payé 🧾" : "Reçu de Retrait HOASSI - En attente",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h1 style="color: #059669; text-align: center; margin-bottom: 0;">HOASSI</h1>
        <p style="text-align: center; color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Excellence Crowdfunding Togo</p>
        
        <h2 style="color: #020617; text-align: center; margin-top: 30px;">${isCompleted ? "Facture de Paiement" : "Reçu de Demande"}</h2>
        
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Montant Collecté (Brut)</td>
              <td style="padding: 12px 0; text-align: right; color: #020617; font-weight: bold;">${grossAmount || amount} FCFA</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Commission HOASSI (5%)</td>
              <td style="padding: 12px 0; text-align: right; color: #ef4444;">-${platformFee || 0} FCFA</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; color: #64748b; font-size: 14px;">Frais Techniques (2%)</td>
              <td style="padding: 12px 0; text-align: right; color: #ef4444;">-${techFee || 0} FCFA</td>
            </tr>
            <tr>
              <td style="padding: 20px 0 0 0; color: #020617; font-size: 18px; font-weight: 900;">NET À RECEVOIR</td>
              <td style="padding: 20px 0 0 0; text-align: right; color: #059669; font-size: 24px; font-weight: 900;">${amount} FCFA</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
           <p style="color: #475569; font-size: 14px;"><strong>Méthode :</strong> ${method}</p>
           <span style="display: inline-block; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: bold; ${isCompleted ? 'background-color: #ecfdf5; color: #059669;' : 'background-color: #fffbeb; color: #b45309;'}">
             ${status === "COMPLETED" ? "PAIEMENT EFFECTUÉ" : "TRAITEMENT EN COURS"}
           </span>
        </div>

        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 40px; line-height: 1.6;">
          Merci pour votre confiance.<br>
          HOASSI est une plateforme propulsée par Digitalh Togo.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erreur SMTP Retrait:", error);
  }
}

export async function sendProjectStatusEmail({
  to,
  projectTitle,
  status,
}: {
  to: string;
  projectTitle: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: status === "PENDING" ? "Cagnotte en cours de révision ⏳" : "Mise à jour de votre cagnotte ✨",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h1 style="color: #D4AF37; text-align: center;">HOASSI</h1>
        <h2 style="color: #020617; text-align: center;">Statut de votre projet</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
          Bonjour,<br><br>
          Votre projet <strong>"${projectTitle}"</strong> a été ${
            status === "PENDING" ? "soumis avec succès et est en attente de modération par notre équipe." :
            status === "APPROVED" ? "approuvé ! Il est désormais public et peut recevoir des dons." :
            "refusé ou suspendu. Veuillez nous contacter pour plus d'informations."
          }
        </p>
        ${status === "APPROVED" ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hoassi.tg/dashboard" style="background-color: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold;">Accéder à mon tableau de bord</a>
          </div>
        ` : ""}
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
          L'équipe HOASSI
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erreur SMTP Projet:", error);
  }
}
