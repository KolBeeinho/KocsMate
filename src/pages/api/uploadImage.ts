import fs from "fs";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Image } from "prisma/generated/client";
import { prisma } from "../../prisma";

interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

// Fájl tárolás beállítása
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage }).single("image");

export const config = {
  api: {
    bodyParser: false, //A multer middlwarehez
  },
};

const handler = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "A metódus nem engedélyezett." });
  }

  //Multer middleware hívása
  upload(req as any, res as any, async (err: any) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Hiba a fájl feltöltése közben", details: err });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nem lett fájl feltöltve." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const { isBackground, pubId } = req.body as Image; //Adat frontendről

    try {
      const newImage = await prisma.image.create({
        data: {
          url: imageUrl,
          pubId: pubId,
          isBackground: isBackground,
        },
      });

      res.status(200).json({ imageUrl, newImage });
    } catch (error) {
      console.error("Hiba a fájl mentése közben:", error);
      res.status(500).json({ error: "Nem sikerült menteni a képet." });
    }
  });
};

export default handler;
