import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const isGoogleOAuthConfigured = Boolean(googleClientId && googleClientSecret);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  providers: isGoogleOAuthConfigured
    ? [
        GoogleProvider({
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        }),
      ]
    : [],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  logger: {
    error(code, metadata) {
      console.error("[NextAuth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth][warn]", code);
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // must be defined
};

// 🔹 Helper to get server-side session
export function auth() {
  return getServerSession(authOptions);
}

// 🔹 Helper to get current logged-in user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
