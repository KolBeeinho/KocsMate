import * as argon2 from "argon2";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { prisma } from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, username } = req.body;
    // Input validation
    if (!email || !username) {
      return res.status(400).json({ error: "Minden mező megadása kötelező!" });
    }

    //Check if the email or username already exists
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({ error: "A felhasználó már létezik!" });
      }

      // Check if the email is authorized to create an admin account
      const adminEmail = await prisma.admin.findUnique({
        where: { email },
      });

      if (!adminEmail) {
        return res.status(403).json({
          error:
            "Ezzel az email-lel nem jogosult adminisztrátori fiók létrehozására!",
        });
      }

      // Generate a random password
      const generateRandomPassword = (length = 12) => {
        const charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
          password += charset.charAt(
            Math.floor(Math.random() * charset.length)
          );
        }
        return password;
      };

      const randomPassword = generateRandomPassword();
      const hashedPassword = await argon2.hash(randomPassword);

      // Create the user
      await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          business: true,
        },
      });

      // Send email with the generated password
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.RESTORE_USER,
          pass: process.env.RESTORE_PASS,
        },
      });

      const mailOptions = {
        from: process.env.RESTORE_USER,
        to: email,
        subject: "Üzleti admin fiók létrehozva",
        text: `Az Ön üzleti admin fiókja sikeresen létrejött. Az első belépéshez használja az alábbi jelszót:\n\n🔑 Jelszó: ${randomPassword}\n\nBiztonsági okokból az első belépés után kérjük, változtassa meg a jelszavát!\n\nÜdvözlettel,\nKocsmate Hungary csapata`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Hiba történt az e-mail küldésekor:", error);
          return res
            .status(500)
            .json({ message: "Hiba történt az e-mail küldésekor." });
        } else {
          console.log("E-mail sikeresen elküldve:", info.response);
          return res.status(200).json({
            message: "Admin fiók sikeresen létrehozva és az e-mail kiküldve!",
          });
        }
      });
    } catch (error) {
      console.error("Hiba történt:", error);
      return res.status(500).json({ error: "Valami hiba történt!" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
