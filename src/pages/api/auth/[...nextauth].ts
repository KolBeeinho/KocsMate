import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider, {
  FacebookProfile,
} from "next-auth/providers/facebook";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { prisma } from "../../../prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials): Promise<User> {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error("Kérjük, adja meg a felhasználónevet és a jelszót.");
        }

        const user = await prisma.user.findFirst({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Felhasználó nem található.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Érvénytelen jelszó.");
        }
        const hashedPassword = await bcrypt.hash(user.password, 16);
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
          dateOfBirth: user.dateOfBirth,
          password: hashedPassword,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      async profile(profile: GoogleProfile) {
        console.log("Google Profile:", profile);
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });
        console.log("Google Profile ID:", profile.id);
        console.log("Google Profile Email:", profile.email);
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.email.split("@")[0],
              fullName: profile.name,
              password: "",
              createdAt: new Date(Date.now()),
              dateOfBirth: null,
            },
          });
        }
        //Szerezzük meg a Google fiókot
        // const providerAccountId = profile.id ? String(profile.id) : null;
        // if (!providerAccountId) {
        //   throw new Error("hiányzik a google fiók idje?");
        // }

        //nem tökéletes, a profile.idjét nem látni
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId: user.id,
            },
          },
          create: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: user.id,
            refresh_token: profile.refreshToken,
            access_token: profile.accessToken,
            expires_at: profile.expiresAt,
            token_type: profile.tokenType,
            scope: profile.scope,
            id_token: profile.idToken,
            session_state: profile.sessionState,
          },
          update: {
            access_token: profile.accessToken,
            refresh_token: profile.refreshToken,
            expires_at: profile.expiresAt,
          },
        });

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
          dateOfBirth: user.dateOfBirth,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "public_profile email",
        },
      },
      async profile(profile: FacebookProfile) {
        console.log("Facebook Profile:", profile);
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });
        console.log("Facebook Profile ID:", profile.id);
        console.log("Facebook Profile Email:", profile.email);

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.email.split("@")[0],
              fullName: profile.name,
              password: "",
              createdAt: new Date(Date.now()),
              dateOfBirth: null,
            },
          });
        }

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "facebook",
              providerAccountId: user.id,
            },
          },
          create: {
            userId: user.id,
            type: "oauth",
            provider: "facebook",
            providerAccountId: user.id,
            refresh_token: profile.refreshToken,
            access_token: profile.accessToken,
            expires_at: profile.expiresAt,
            token_type: profile.tokenType,
            scope: profile.scope,
          },
          update: {
            access_token: profile.accessToken,
            refresh_token: profile.refreshToken,
            expires_at: profile.expiresAt,
          },
        });

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
          dateOfBirth: user.dateOfBirth,
        };
      },
    }),
    //TODO X, apple
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});
