import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../prisma"; // Adjust the import path according to your project structure

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Adja meg emailjét!",
        },
        password: { label: "Jelszó", type: "password" },
        username: { label: "Felhasználónév", type: "username" },
        fullName: { label: "Teljes név", type: "text" },
        id: { label: "Id", type: "id" },
        dateOfBirth: { label: "Date of Birth", type: "date" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (
          user &&
          credentials?.password &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
