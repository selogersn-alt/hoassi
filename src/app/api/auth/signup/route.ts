import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, referralBy } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Trouver le parrain si présent
    let referrer = null;
    if (referralBy) {
      referrer = await prisma.user.findUnique({ where: { referralCode: referralBy } });
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        referredById: referrer?.id
      }
    });

    // Optionnel : Créer le profil Influencer si le rôle est INFLUENCER
    if (role === "INFLUENCER") {
      await prisma.influencer.create({
        data: {
          username: email.split("@")[0] + Math.random().toString(36).substring(2, 5),
          fullname: name,
          email: email,
          bio: "Nouveau membre influenceur",
          cniFront: "A fournir",
          cniBack: "A fournir",
          phone: "A fournir",
          image: "/avatar.png"
        }
      });
    }

    return NextResponse.json({ message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 });
  }
}
