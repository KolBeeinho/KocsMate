// api/moderateReview.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reviewId, action } = req.body; // A komment ID-ja és a végrehajtandó művelet (pl. "disable" vagy "enable")

  try {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isActive: action === "disable" ? false : true },
    });

    res.status(200).json({ message: "Komment állapota frissítve", review });
  } catch (error) {
    res.status(500).json({ error: "Hiba történt a komment frissítése során" });
  }
}
