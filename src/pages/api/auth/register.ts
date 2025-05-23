import * as argon2 from "argon2";
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../prisma";
import checkIfUnderEightTeen from "../../../utils/checkIfUnder18";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password, full_name, id, date_of_birth } =
      req.body;

    console.log("Received data:", req.body);

    // Párhuzamos adatbázis lekérdezések
    const [existingUser, isUnder18] = await Promise.all([
      prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      }),
      checkIfUnderEightTeen(date_of_birth),
    ]);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Már létezik ilyen felhasználónév!" });
    }

    if (isUnder18) {
      return res
        .status(403)
        .json({ error: "18 év alattiak nem regisztrálhatnak." });
    }

    const hashedPassword = await argon2.hash(password);

    // Felhasználó létrehozása
    try {
      const user = await prisma.user.create({
        data: {
          fullName: full_name as string,
          username: username as string,
          email: email as string,
          id: id,
          createdAt: new Date(),
          dateOfBirth: date_of_birth,
          password: hashedPassword,
          business: false,
        },
      });

      res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
      });
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ error: "Hiba a felhasználó létrehozásakor." });
    }
  }
}
