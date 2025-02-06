import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Összes pub lekérdezése kapcsolódó adatokkal
    const pubs = await prisma.pub.findMany({
      include: {
        reviews: true,
        products: true,
        images: true,
      },
    });

    if (!pubs.length) {
      return res.status(404).json({ message: "Nincsenek elérhető pubok." });
    }

    return res.status(200).json({ pubs });
  } catch (error) {
    console.error("Nem sikerült pub adatokat lekérni:", error);
    return res.status(500).json({ message: "Belső szerver hiba." });
  }
}
