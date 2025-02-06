import { NextApiRequest, NextApiResponse } from "next";
import { Image } from "prisma/generated/client"; // Prisma adatbázis kliens
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url, pubId, isBackground }: Image = req.body;

  try {
    //Újonnan kiválasztott háttérkép
    if (isBackground) {
      const existingBackgroundImage = await prisma.image.findFirst({
        where: {
          pubId: pubId,
          isBackground: true,
        },
      });
      //Régi háttérkép
      if (existingBackgroundImage) {
        await prisma.image.update({
          where: {
            pubId_url: {
              pubId: pubId,
              url: existingBackgroundImage.url,
            },
          },
          data: {
            isBackground: false,
          },
        });
      }
    }
    //Újonnan kiválasztott háttérkép
    const updatedImage = await prisma.image.update({
      where: {
        pubId_url: {
          pubId: pubId,
          url: url,
        },
      },
      data: {
        isBackground: isBackground,
      },
    });
    return res
      .status(200)
      .json({ message: "Kép tájolása frissítve", updatedImage });
  } catch (error) {
    console.error("Hiba történt a kép frissítésekor:", error);
    return res.status(500).json({ error: "Hiba történt a kép frissítésekor" });
  }
}
