import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendProjectStatusEmail } from "@/lib/mail";

// GET: Récupérer tous les projets approuvés (ou tous pour l'admin)
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { approved: true, suspended: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// POST: Créer un nouveau projet (cagnotte) - Nécessite d'être connecté
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        category: body.category,
        goal: Number(body.goal),
        description: body.description,
        fullname: body.fullname,
        email: body.email,
        phone: body.phone,
        cni: body.cni,
        cniFront: body.cniFront,
        cniBack: body.cniBack,
        image: body.image,
        socialLink: body.socialLink || null,
        userId: user.id
      },
    });
    
    // Notification Email
    if (newProject.email) {
      await sendProjectStatusEmail({
        to: newProject.email,
        projectTitle: newProject.title,
        status: "PENDING"
      });
    }

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
