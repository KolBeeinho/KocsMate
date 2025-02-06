import "next";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    fullName?: string;
    email: string;
    createdAt: Date;
    dateOfBirth: Date | null;
    business: boolean;
    password?: string;
  }

  interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      fullName: string;
      email: string;
      createdAt: Date;
      dateOfBirth: Date | null;
      business: boolean;
      password?: string;
    };
  }
}

export type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isRegistered: boolean;
};
export type Pub = {
  id: string;
  name: string;
  fullAddress: string;
  longitude: number;
  latitude: number;
  phone: string;
  email: string;
  openingHours: { day: string; hours: string }[];
  products: string[];
  functioning: boolean;
  googleRating: number;
  rating: number;
  state: string;
  href: string;
};
export type OpeningHoursEntry = {
  day: string;
  hours: string;
};
// export type GoogleProfile = {
//   sub: string; // A felhasználó egyedi azonosítója
//   name: string; // A felhasználó neve
//   given_name: string; // Keresztnév
//   family_name: string; // Vezetéknév
//   picture: string; // Profilkép URL
//   email: string; // E-mail cím
//   email_verified: boolean; // E-mail megerősítése
//   locale: string; // Nyelvi beállítás
// }; //csak ha mégis kéne

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      MONGODB_PASS: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      RESTORE_USER: string;
      RESTORE_PASS: string;
    }
  }
}
