import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma";

interface RequestBody {
  pubId: string;
  productId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
  const { pubId, productId }: RequestBody = req.body;

  try {
    const pub = await prisma.pub.findUnique({
      where: { id: pubId },
      select: { id: true }, // Csak az id mezőt kérjük le
    });

    if (!pub) {
      return res
        .status(404)
        .json({ success: false, message: "Pub nem található" });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    return res.status(200).json({
      success: true,
      message: "Termék sikeresen törölve",
      deletedProduct,
    });
  } catch (error) {
    console.error("Hiba történt a törlés során:", error);
    return res.status(500).json({
      success: false,
      message: "Hiba történt a termék törlésekor",
    });
  }
}
