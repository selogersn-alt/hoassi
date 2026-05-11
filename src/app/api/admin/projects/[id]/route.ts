import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendProjectStatusEmail } from "@/lib/mail";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Pour l'instant, pas d'auth complexe, mais on pourrait ajouter un check de header secret
    // const secret = request.headers.get("x-admin-secret");
    // if (secret !== process.env.ADMIN_SECRET) return ...

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        approved: body.approved !== undefined ? body.approved : undefined,
        suspended: body.suspended !== undefined ? body.suspended : undefined,
        isVerified: body.isVerified !== undefined ? body.isVerified : undefined
      }
    });

    // Notification de statut
    if (updatedProject.email) {
      try {
        await sendProjectStatusEmail(
          updatedProject.email,
          updatedProject.title,
          updatedProject.suspended ? "REJECTED" : (updatedProject.approved ? "APPROVED" : "PENDING")
        );
      } catch (mailError) {
        console.error("Erreur envoi email statut projet:", mailError);
      }
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Erreur admin:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
