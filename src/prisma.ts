import { PrismaClient } from "prisma/generated/client";

export const prisma: PrismaClient =
  (global as any).prisma ||
  new PrismaClient({
    log: ["error"],
  });

export * from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  (global as any).prisma = prisma;
}

//#region Emailek feltöltése manuálisan, egyszeri futtatás mindig
//egyelőre véletlenszerű
// const generateRandomEmail = () => {
//   const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
//   let email = "";
//   for (let i = 0; i < 10; i++) {
//     email += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return `${email}@example.com`;
// };

// const uploadAdminEmails = async () => {
//   const randomEmails = Array.from({ length: 3 }).map(generateRandomEmail); // Három véletlenszerű email generálása

//   for (const email of randomEmails) {
//     await prisma.admin.create({
//       data: {
//         email,
//       },
//     });
//     console.log(`Admin e-mail hozzáadva: ${email}`);
//   }
// };

// uploadAdminEmails()
//   .catch((e) => {
//     console.error("Hiba történt az admin e-mailek feltöltésekor:", e);
//   })
//   .finally(() => {
//     prisma.$disconnect();
//   });
//#endregion
//#region Pub lekérdezései
async function assignPubToAdmin(pubId: string, adminEmail: string) {
  try {
    // Admin keresése az email alapján
    const admin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.error("Admin nem található!");
      return;
    }

    // Admin frissítése a megfelelő pub-hoz kapcsolva
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        pubId: pubId,
      },
    });

    console.log("Admin sikeresen hozzá lett rendelve a pubhoz!");
  } catch (error) {
    console.error("Hiba a pub és admin összekapcsolásakor:", error);
  } finally {
    await prisma.$disconnect();
  }
}

//assignPubToAdmin(, ); //Véletlenszerű adminokkal feltöltés
//#endregion
