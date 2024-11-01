// pages/api/auth/register.js
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    //Csatlakozás az adatbázishoz
    const client = await clientPromise;
    const db = client.db("myDatabase");

    //Keressük az adott usert
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Már létezik ilyen felhasználónév!" });
    }

    const hashedPassword = await bcrypt.hash(password, 16);

    const result = await db.collection("users").insertOne({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
