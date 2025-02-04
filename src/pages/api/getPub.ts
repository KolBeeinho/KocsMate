import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma";
//TODO ÁTNEVEZNI GETADMINPUBRA ISMÉT!!!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({ message: "Admin ID szükséges" });
  }
  try {
    const admin = await prisma.admin.findUnique({
      where: { userId: String(adminId) },
      include: {
        pub: {
          include: { reviews: true, products: true },
        },
      },
    });
    console.log("Admin id:" + admin?.userId);
    if (!admin || !admin.pub) {
      return res
        .status(404)
        .json({ message: "Nem található az admin vagy pubja." });
    }

    return res.status(200).json({ pub: admin.pub });
  } catch (error) {
    console.error("Nem sikerült pub datát kinyerni:", error);
    return res.status(500).json({ message: "Belső szerver hiba." });
  }
}
