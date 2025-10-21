import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    sub: string;
  }
}
