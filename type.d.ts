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
  href: string;
};
export interface OpeningHoursEntry {
  day: string;
  hours: string;
}
// export interface GoogleProfile {
//   sub: string; // A felhasználó egyedi azonosítója
//   name: string; // A felhasználó neve
//   given_name: string; // Keresztnév
//   family_name: string; // Vezetéknév
//   picture: string; // Profilkép URL
//   email: string; // E-mail cím
//   email_verified: boolean; // E-mail megerősítése
//   locale: string; // Nyelvi beállítás
// } //csak ha mégis kéne

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
