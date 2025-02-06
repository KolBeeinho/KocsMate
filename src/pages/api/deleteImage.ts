import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Image } from "prisma/generated/client";
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { url, pubId } = req.body as Image;

  try {
    // 1. Kép törlése az adatbázisból
    const deletedImage = await prisma.image.delete({
      where: {
        pubId_url: { pubId, url },
      },
    });

    //Kép törlése a fájlrendszerből (feltételezve, hogy a képek a public/uploads mappában vannak)
    const filePath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Törli a fájlt
    }
    return res.status(200).json({ message: "Kép törölve", deletedImage });
  } catch (error) {
    console.error("Hiba történt a kép törlésénél:", error);
    return res.status(500).json({ error: "Hiba történt a kép törlésénél" });
  }
}
