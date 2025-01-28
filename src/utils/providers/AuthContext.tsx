import { User } from "next-auth";
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

  const user: User | null = session?.user
    ? {
        id: session.user.id as string,
        username: session.user.username as string,
        email: session.user.email as string,
        fullName: session.user.fullName as string,
        dateOfBirth: session.user.dateOfBirth
          ? new Date(session.user.dateOfBirth)
          : null,
        createdAt: new Date(session.user.createdAt),
        business: session.user.business as boolean,
      }
    : null;

  const isRegistered = !!user;

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
