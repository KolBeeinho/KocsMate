import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import checkIfUnderEightTeen from "../../../utils/checkIfUnder18";
import { prisma } from "./../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password, full_name, id, date_of_birth } =
      req.body;

    console.log("Received data:", req.body);
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Már létezik ilyen felhasználónév!" });
    }

    const isUnder18 = checkIfUnderEightTeen(date_of_birth);

    if (isUnder18) {
      return res
        .status(403)
        .json({ error: "18 év alattiak nem regisztrálhatnak." });
    }

    // Jelszó hashelése
    const hashedPassword = await bcrypt.hash(password, 16);
    // Felhasználó létrehozása
    try {
      const user = await prisma.user.create({
        data: {
          fullName: full_name,
          username: username,
          email: email,
          id: id,
          createdAt: new Date(Date.now()),
          dateOfBirth: date_of_birth,
          password: hashedPassword,
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
