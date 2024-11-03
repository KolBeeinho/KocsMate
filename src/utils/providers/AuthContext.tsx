import { User } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { createContext, ReactNode } from "react";

export const AuthContext = createContext<
  | {
      user: User | null;
      login: (email: string, password: string) => Promise<void>;
      logout: () => void;
      isRegistered: boolean;
    }
  | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session } = useSession();

  const user: any = session?.user && {
    //egyelőre any amúgy User
    id: session.user.id,
    fullName: session.user.name,
    email: session.user.email,
    username: session.user.username,
    createdAt: new Date(session.user.createdAt),
    dateOfBirth: session.user.dateOfBirth,
  };

  const isRegistered = user !== null && user !== undefined;

  const login = async (email: string, password: string) => {
    await signIn("credentials", { email, password, redirect: false });
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isRegistered }}>
      {children}
    </AuthContext.Provider>
  );
};
