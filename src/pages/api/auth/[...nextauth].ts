import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as argon2 from "argon2";
import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error("Kérjük, adja meg a felhasználónevet és a jelszót.");
        }

        const user = await prisma.user.findFirst({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Felhasználó nem található.");
        }

        const isPasswordValid = await argon2.verify(
          user.password as string,
          credentials.password
        );
        if (!isPasswordValid) {
          throw new Error("Érvénytelen jelszó.");
        }

        return {
          id: user.id,
          username: user.username || "",
          email: user.email,
          fullName: user.fullName || "",
          createdAt: user.createdAt,
          dateOfBirth: user.dateOfBirth || null,
          business: user.business,
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
      async profile(profile: GoogleProfile): Promise<User> {
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (!user) {
          const hashedPassword = await argon2.hash(profile.name);
          user = await prisma.user.create({
            data: {
              id: profile.id,
              email: profile.email,
              username: profile.email.split("@")[0],
              fullName: profile.name as string,
              password: hashedPassword,
              createdAt: new Date(),
              dateOfBirth: null,
              business: false,
            },
          });
        }

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
          fullName: user.fullName as string,
          createdAt: user.createdAt,
          dateOfBirth: user.dateOfBirth,
          business: user.business,
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
      async profile(profile: FacebookProfile): Promise<User> {
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (!user) {
          const hashedPassword = await argon2.hash(profile.name);
          user = await prisma.user.create({
            data: {
              email: profile.email,
              username: profile.email.split("@")[0],
              fullName: profile.name,
              password: hashedPassword,
              createdAt: new Date(),
              dateOfBirth: null,
              business: false,
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
          fullName: user.fullName as string,
          createdAt: user.createdAt,
          dateOfBirth: user.dateOfBirth,
          business: user.business,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.fullName = user.fullName;
        token.createdAt = user.createdAt;
        token.dateOfBirth = user.dateOfBirth;
        token.business = user.business;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.fullName = token.fullName as string;
        session.user.createdAt = token.createdAt as Date;
        session.user.dateOfBirth = token.dateOfBirth as Date | null;
        session.user.business = token.business as boolean;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});
