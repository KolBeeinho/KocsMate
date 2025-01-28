import * as argon2 from "argon2";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { prisma } from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { action, email, token, newPassword } = req.body;

    //Jelszó-visszaállítási token generálása
    if (action === "request-reset") {
      if (!email) {
        return res.status(400).json({ error: "Email megadása kötelező!" });
      }

      //Megkeressük a felhasználót
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "Nem található email-cím!" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1); //1 órás lejárati idő

      //Token mentése az adatbázisba
      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt: tokenExpiration,
        },
      });
      //Levél küldése a felhasználónak

      const transporter = nodemailer.createTransport({
        service: "gmail", // Ha Gmail-t használsz
        auth: {
          user: process.env.RESTORE_USER, //mehetne majd envbe
          pass: process.env.RESTORE_PASS, //Alkalmazásjelszó
        },
      });
      const mailOptions = {
        from: process.env.RESTORE_USER,
        to: email,
        subject: "Jelszó-visszaállító link",
        text: `Használja az alábbi linket a jelszó visszaállításához: http://localhost:3000/password-reset?token=${resetToken}`, //ide mehet valami embed
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Hiba történt az e-mail küldésekor:", error);
          return res
            .status(500)
            .json({ message: "Hiba történt az e-mail küldésekor." });
        } else {
          console.log("E-mail sikeresen elküldve:", info.response);
        }
      });
      return res
        .status(200)
        .json({ message: "Jelszó-visszaállítás elküldve!" });
    }
    //Jelszó frissítése
    if (action === "reset-password") {
      if (!token || !newPassword) {
        return res.status(400).json({
          error: "Token és az új jelszó megadása kötelező!",
        });
      }

      // Ellenőrizzük a token érvényességét
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
      });

      if (!resetToken) {
        return res.status(400).json({ error: "Érvénytelen token!" });
      }

      // Ellenőrizzük, hogy a token lejárt-e
      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: "A token lejárt!" });
      }

      const hashedPassword = await argon2.hash(newPassword);

      //Jelszó frissítése az adatbázisban
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });

      // A token törlése, hogy ne használják újra
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return res.status(200).json({ message: "Jelszó sikeresen frissítve!" });
    }
    //Ismeretlen action
    return res.status(400).json({ error: "Érvénytelen művelet!" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
