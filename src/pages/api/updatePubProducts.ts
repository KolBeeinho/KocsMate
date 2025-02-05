import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Product } from "../../../prisma/prisma/generated/client";
const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res
      .status(405)
      .json({ success: false, message: "Csak PUT metódus engedélyezett." });
  }
  const { id, products } = req.body;

  try {
    const updatePromises = products.map((product: Product) =>
      prisma.product.update({
        where: { id: product.id },
        data: { name: product.name, price: product.price },
      })
    );

    await Promise.all(updatePromises);

    const updatedPub = await prisma.pub.findUnique({
      where: { id },
      include: { products: true },
    });

    res.status(200).json({ success: true, pub: updatedPub });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Hiba a termékek frissítésekor." });
  }
}
