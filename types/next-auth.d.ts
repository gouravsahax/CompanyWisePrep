import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      credits?: number;
      defaultLanguage?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    credits?: number;
    defaultLanguage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits?: number;
    defaultLanguage?: string;
  }
}
