import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.username || !body.fullname || !body.bio || !body.image || !body.phone || !body.cni) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    // Vérifier si le username existe déjà
    const existing = await prisma.influencer.findUnique({
      where: { username: body.username }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris." },
        { status: 400 }
      );
    }

    const newInfluencer = await prisma.influencer.create({
      data: {
        username: body.username,
        fullname: body.fullname,
        email: body.email,
        bio: body.bio,
        image: body.image,
        socialLink: body.socialLink || null,
        phone: body.phone,
        cniFront: body.cni,
        cniBack: "A fournir",
      },
    });

    return NextResponse.json(newInfluencer, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'influenceur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
