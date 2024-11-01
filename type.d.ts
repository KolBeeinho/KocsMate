export type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isRegistered: boolean;
};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      MONGODB_PASS: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    }
  }
}
