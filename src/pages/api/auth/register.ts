import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password, full_name } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email, username: username },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Már létezik ilyen felhasználónév!" });
    }

    // Jelszó hashelése
    const hashedPassword = await bcrypt.hash(password, 16);
    // Felhasználó létrehozása
    const user = await prisma.user.create({
      data: {
        fullName: full_name,
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`); //Postman miatt figyelni kell erre
  }
}
