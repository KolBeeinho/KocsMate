import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
configDotenv();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Csatlakozás az adatbázishoz
    const client = await clientPromise;
    const db = client.db("myDatabase");

    // Felhasználó keresése MongoDB-ben
    const user = await db
      .collection(process.env.DB_COLLECTION as string)
      .findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Jelszó ellenőrzése bcrypttel
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // JWT token generálása
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Visszaküldjük a tokent
    res.status(200).json({ token });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
