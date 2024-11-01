import "next-auth";

declare module "next-auth" {
  interface user {
    //megegyezik a prisma sémájával
    id: string;
    username: string;
    fullName: string;
    email: string;
    createdAt: Date;
    dateOfBirth: Date;
  }
  interface Session {
    user: User | null;
  }
}
