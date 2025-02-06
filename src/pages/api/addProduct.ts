import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "prisma/generated/client";
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, price, type, description, pubId } = req.body as Product;

  // Ellenőrizzük, hogy minden szükséges adat megérkezett-e
  if (!name || !price || !type) {
    return res.status(400).json({ error: "Név, ár és típus szükséges!" });
  }
  if (!pubId) {
    return res
      .status(401)
      .json({ message: "A termékhez tartozó pub nem található" });
  }
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        type,
        pubId,
        description: description || "", // Alapértelmezett üres string
      },
    });
    res.status(200).json({ product: newProduct });
  } catch (error) {
    console.error("Hiba történt a termék mentése közben:", error);
    res.status(500).json({ error: error || "Valami hiba történt." });
  }
}
