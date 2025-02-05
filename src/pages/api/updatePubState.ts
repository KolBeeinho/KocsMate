import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../../prisma/prisma/generated/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const { id, state } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Pub ID hiányzik." });
    }

    try {
      const updatedPub = await prisma.pub.update({
        where: { id: id },
        data: {
          state,
        },
      });
      return res.status(200).json({ success: true, pub: updatedPub });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Nem sikerült a kocsma állapotfrissítése!",
      });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
}
