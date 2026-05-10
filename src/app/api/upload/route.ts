import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier n'a été fourni." }, { status: 400 });
    }

    // Validation du type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format non supporté. Utilisez JPG, PNG ou WEBP." }, { status: 400 });
    }

    // Validation de la taille (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop lourd (max 2MB)." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nom de fichier sécurisé
    const filename = `${uuidv4()}.webp`;
    const uploadDir = join(process.cwd(), "public", "uploads", "projects");
    
    // S'assurer que le dossier existe
    await mkdir(uploadDir, { recursive: true });
    const path = join(uploadDir, filename);

    // Compression et conversion avec Sharp
    await sharp(buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/projects/${filename}` 
    });

  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload de l'image." }, { status: 500 });
  }
}
