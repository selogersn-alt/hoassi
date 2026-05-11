# HOASSI - Plateforme de Crowdfunding & Solidarité au Togo

HOASSI est une plateforme de financement participatif dédiée au soutien de projets locaux, de créateurs de contenu et d'initiatives solidaires au Togo. Elle permet de collecter des fonds via les moyens de paiement locaux (T-Money, Moov Money) et par carte bancaire.

## Technologies Utilisées

- **Frontend** : Next.js 14+ (App Router), Tailwind CSS, Framer Motion
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : PostgreSQL
- **Authentification** : NextAuth.js
- **Paiements** : Intégrations FedaPay et PayGate Global
- **Emails** : Nodemailer (SMTP)

## Structure du Projet

- `/src/app` : Routes de l'application et logique de rendu.
- `/src/components` : Composants UI réutilisables.
- `/src/lib` : Utilitaires, configuration Prisma, services de paiement et email.
- `/src/app/api` : Points de terminaison API pour le dashboard admin et les webhooks.

## Installation

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Configurez les variables d'environnement dans un fichier `.env`
4. Lancez les migrations Prisma : `npx prisma migrate dev`
5. Lancez le serveur de développement : `npm run dev`

---
© 2026 HOASSI. Développé par Digitalh.
