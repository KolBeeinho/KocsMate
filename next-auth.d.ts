import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    fullName: string;
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
