import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "prisma/generated/client";
import { Pub } from "types"; //?

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
  const {
    id,
    name,
    fullAddress,
    phone,
    email,
    googleRating,
    rating,
    href,
    openingHours,
    description,
  } = req.body as Pub;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Pub ID szükséges." });
  }

  try {
    const updatedPub = await prisma.pub.update({
      where: { id: id },
      data: {
        name,
        fullAddress,
        phone,
        email,
        googleRating,
        rating,
        href,
        openingHours: openingHours,
        description,
      },
    });
    return res.status(200).json({ success: true, pub: updatedPub });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Nem sikerült a kocsma frissítése!" });
  }
}
