import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, User } from "./../../../prisma";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Felhasználónév", type: "text" },
        password: { label: "Jelszó", type: "password" },
      },
      async authorize(credentials) {
        const { password, email } = credentials as User;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          console.log("Invalid username or password");
          return null;
        }

        // Jelszó ellenőrzése bcrypttel
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log("Invalid username or password");
        }
        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          username: user.username,
          password: user.password,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user !== undefined) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
