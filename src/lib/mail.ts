import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const APP_NAME = "HOASSI";
const PRIMARY_COLOR = "#ff5a5f"; // Coral
const FOOTER_TEXT = "HOASSI - L'excellence Crowdfunding au Togo. Propulsé par Digitalh.";

/**
 * Modèle HTML de base pour les notifications
 */
const getHtmlTemplate = (title: string, content: string, ctaText?: string, ctaUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff9f9; margin: 0; padding: 0; color: #334155; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 10px 40px rgba(255, 90, 95, 0.1); border: 1px solid #ffe4e4; }
    .header { background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #ff8a8e 100%); padding: 40px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; }
    .content { padding: 40px 30px; line-height: 1.6; font-size: 16px; }
    .content h2 { color: #0f172a; font-weight: 800; margin-top: 0; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #f8fafc; }
    .button { display: inline-block; padding: 16px 32px; background-color: ${PRIMARY_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; margin-top: 20px; box-shadow: 0 10px 20px rgba(255, 90, 95, 0.2); }
    .emoji { font-size: 24px; vertical-align: middle; }
    .highlight { color: ${PRIMARY_COLOR}; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_NAME} ❤️</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
      ${ctaText && ctaUrl ? `<div style="text-align: center; margin-top: 30px;"><a href="${ctaUrl}" class="button">${ctaText}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>${FOOTER_TEXT}</p>
      <p>© ${new Date().getFullYear()} Digitalh. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
`;

export async function sendWelcomeEmail(to: string, name: string) {
  const title = "Bienvenue dans l'aventure HOASSI ! ✨";
  const content = `
    <p>Bonjour <span class="highlight">${name}</span>,</p>
    <p>Nous sommes ravis de vous compter parmi nous ! HOASSI est bien plus qu'une plateforme de crowdfunding, c'est une communauté de solidarité qui fait bouger le Togo. 🇹🇬</p>
    <p>Vous pouvez dès maintenant :</p>
    <ul>
      <li>Lancer votre propre cagnotte solidaire.</li>
      <li>Soutenir des projets inspirants.</li>
      <li>Partager votre lien de parrainage pour agrandir la communauté.</li>
    </ul>
    <p>Ensemble, créons de la joie et de l'impact ! ❤️</p>
  `;
  
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Bienvenue chez ${APP_NAME} !`,
    html: getHtmlTemplate(title, content, "Accéder à mon tableau de bord", `${process.env.NEXTAUTH_URL}/dashboard`),
  });
}

export async function sendDonationSuccessEmail(to: string, amount: number, projectTitle: string) {
  const title = "Merci pour votre générosité ! ❤️";
  const content = `
    <p>Votre don de <span class="highlight">${new Intl.NumberFormat('fr-FR').format(amount)} XOF</span> pour le projet <strong>"${projectTitle}"</strong> a bien été reçu.</p>
    <p>Grâce à votre soutien, nous faisons un pas de plus vers la réussite de cette initiative. Chaque geste compte énormément.</p>
    <p>N'hésitez pas à partager ce projet autour de vous pour décupler son impact ! ✨</p>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Merci pour votre don ! - ${APP_NAME}`,
    html: getHtmlTemplate(title, content, "Voir l'avancement du projet", `${process.env.NEXTAUTH_URL}/`),
  });
}

export async function sendNewDonationNotification(to: string, donorName: string, amount: number, projectTitle: string) {
  const title = "Nouvelle contribution reçue ! 🌟";
  const content = `
    <p>Excellente nouvelle ! <span class="highlight">${donorName}</span> vient de contribuer à hauteur de <span class="highlight">${new Intl.NumberFormat('fr-FR').format(amount)} XOF</span> à votre projet <strong>"${projectTitle}"</strong>.</p>
    <p>Votre cagnotte continue de grimper ! C'est le moment idéal pour remercier vos soutiens et continuer à partager votre aventure.</p>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Nouveau don reçu ! 🎉 - ${APP_NAME}`,
    html: getHtmlTemplate(title, content, "Gérer mon projet", `${process.env.NEXTAUTH_URL}/dashboard`),
  });
}

export async function sendWithdrawalUpdateEmail(to: string, amount: number, status: string) {
  const isCompleted = status === "COMPLETED";
  const title = isCompleted ? "Votre retrait a été effectué ! 💸" : "Mise à jour de votre demande de retrait";
  
  const content = isCompleted 
    ? `<p>Bonne nouvelle ! Votre demande de retrait de <span class="highlight">${new Intl.NumberFormat('fr-FR').format(amount)} XOF</span> a été traitée avec succès. Les fonds ont été envoyés vers votre compte de destination.</p>`
    : `<p>Votre demande de retrait de <span class="highlight">${new Intl.NumberFormat('fr-FR').format(amount)} XOF</span> a été refusée. Veuillez contacter le support pour plus d'informations ou vérifier vos informations de paiement.</p>`;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: isCompleted ? `Paiement effectué ! ✅ - ${APP_NAME}` : `Mise à jour retrait - ${APP_NAME}`,
    html: getHtmlTemplate(title, content, "Consulter mon historique", `${process.env.NEXTAUTH_URL}/dashboard`),
  });
}

export async function sendProjectStatusEmail(to: string, projectTitle: string, status: string) {
  const isApproved = status === "APPROVED";
  const title = isApproved ? "Votre projet est en ligne ! 🚀" : "Mise à jour de votre projet";
  
  const content = isApproved 
    ? `<p>Félicitations ! Votre projet <strong>"${projectTitle}"</strong> a été validé par notre équipe. Il est désormais visible par toute la communauté et prêt à recevoir des dons.</p><p>C'est le moment de partager votre lien au maximum ! ❤️</p>`
    : `<p>Votre projet <strong>"${projectTitle}"</strong> a été suspendu ou nécessite des modifications. Notre équipe de modération vous contactera prochainement si nécessaire, ou vous pouvez nous écrire directement.</p>`;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: isApproved ? `Projet Validé ! 🎉 - ${APP_NAME}` : `Statut de votre projet - ${APP_NAME}`,
    html: getHtmlTemplate(title, content, "Voir mon projet", `${process.env.NEXTAUTH_URL}/dashboard`),
  });
}

export async function sendDonationEmail(params: { to: string; projectTitle: string; donorName: string; amount: number; message?: string }) {
  const title = "Nouvelle contribution reçue ! 🌟";
  const content = `
    <p>Excellente nouvelle ! <span class="highlight">${params.donorName}</span> vient de contribuer à hauteur de <span class="highlight">${new Intl.NumberFormat('fr-FR').format(params.amount)} XOF</span> à votre projet <strong>"${params.projectTitle}"</strong>.</p>
    ${params.message ? `<p>Message du donateur : <em>"${params.message}"</em></p>` : ''}
    <p>Votre cagnotte continue de grimper ! ❤️</p>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: params.to,
    subject: `Nouveau don reçu ! 🎉 - ${APP_NAME}`,
    html: getHtmlTemplate(title, content, "Gérer mon projet", `${process.env.NEXTAUTH_URL}/dashboard`),
  });
}

export async function sendWithdrawalEmail(params: { 
  to: string; 
  amount: number; 
  status: string; 
  method: string; 
  grossAmount: number; 
  platformFee: number; 
  techFee: number; 
}) {
  const title = "Demande de retrait enregistrée 💸";
  const content = `
    <p>Votre demande de retrait de <span class="highlight">${new Intl.NumberFormat('fr-FR').format(params.amount)} XOF</span> a bien été prise en compte.</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Détails du retrait :</strong></p>
      <ul style="list-style: none; padding: 0;">
        <li>Montant Brut : ${new Intl.NumberFormat('fr-FR').format(params.grossAmount)} XOF</li>
        <li>Frais Plateforme : -${new Intl.NumberFormat('fr-FR').format(params.platformFee)} XOF</li>
        <li>Frais Techniques : -${new Intl.NumberFormat('fr-FR').format(params.techFee)} XOF</li>
        <li style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;"><strong>Montant Net à recevoir : ${new Intl.NumberFormat('fr-FR').format(params.amount)} XOF</strong></li>
      </ul>
      <p style="margin: 10px 0 0 0;">Mode : ${params.method}</p>
    </div>
    <p>Notre équipe valide actuellement votre demande. Vous recevrez un email dès que les fonds seront envoyés. ✨</p>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: params.to,
    subject: `Demande de retrait reçue - ${APP_NAME}`,
    html: getHtmlTemplate(title, content, "Suivre mon retrait", `${process.env.NEXTAUTH_URL}/dashboard`),
  });
}
