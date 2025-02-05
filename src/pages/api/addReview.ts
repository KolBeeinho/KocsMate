import { NextApiRequest, NextApiResponse } from "next";
import { Review } from "../../../prisma/prisma/generated/client";
import { prisma } from "../../prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    //Később valszeg websocket
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { pubId, userId, rating, comment } = req.body as Review;

  if (!pubId || !rating || !comment) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  }

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Felhasználó azonosító nem található" });
  }

  try {
    const review = await prisma.review.create({
      data: {
        pubId,
        userId,
        rating: Number(rating),
        comment,
      },
    });
    return res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Hiba a vélemény mentésekor:", error);
    return res.status(500).json({ message: "Szerverhiba" });
  }
}
