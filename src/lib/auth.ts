import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// 🔐 Ensure PrismaAdapter runs only if DATABASE_URL exists
const adapter = process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined;

export const authOptions: NextAuthOptions = {
  adapter,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with that email");
        }

        // ✅ Guard against null password from DB
        if (!user.password) {
          throw new Error("This account does not have a password set.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // ✅ Convert ID to string (NextAuth requires string IDs)
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role as Role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // token is a generic object; we extend it here
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // we assume you've extended Session in next-auth.d.ts
        (session.user as any).id = (token as any).id as string;
        (session.user as any).role = (token as any).role as Role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // ✅ custom error route handler
  },

  secret: process.env.NEXTAUTH_SECRET,
};
