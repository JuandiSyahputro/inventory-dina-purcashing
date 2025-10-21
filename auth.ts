import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schema/auth-schema";
import type { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;
        const user = await prisma.users.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user?.password) {
          throw new Error("User not found");
        }

        const isValid = compareSync(password, user.password);
        if (!isValid) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const ProtectedRoute = ["/dashboard"];

      if (!isLoggedIn && ProtectedRoute.some((route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"))) {
        return Response.redirect(new URL("/auth/login", nextUrl));
      }

      if (isLoggedIn && nextUrl.pathname.startsWith("/auth/login")) {
        return Response.redirect(new URL("/dashboard/product/overview", nextUrl));
      }

      if (isLoggedIn) {
        if (nextUrl.pathname === "/") {
          return Response.redirect(new URL("/dashboard/product/overview", nextUrl));
        }
      } else {
        if (nextUrl.pathname === "/" || ProtectedRoute.some((route) => nextUrl.pathname.startsWith(route))) {
          return Response.redirect(new URL("/auth/login", nextUrl));
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;

      return session;
    },
  },
});
