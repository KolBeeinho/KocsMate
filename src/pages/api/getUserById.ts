import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const user = await prisma.user.findFirst({
        where: { id: String(id) },
        select: { username: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Nem található felhasználó" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching user data" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
