import { NextApiRequest, NextApiResponse } from "next";
import { Image } from "prisma/generated/client";
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "A metódus nem engedélyezett." });
  }

  try {
    const images = await prisma.image.findMany();
    const imageUrls = images.map((image: Image) => image.url);
    res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error("Hiba a képek lekérése során:", error);
    res.status(500).json({ error: "Nem sikerült lekérni a képeket." });
  }
}
