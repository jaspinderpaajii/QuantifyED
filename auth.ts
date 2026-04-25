import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const plainPassword = process.env.ADMIN_PASSWORD;
        const hashedPassword = process.env.ADMIN_PASSWORD_HASH;
        const submittedEmail = parsed.data.email.trim().toLowerCase();

        if (!adminEmail || submittedEmail !== adminEmail) {
          return null;
        }

        const matchesPlain = Boolean(
          plainPassword && plainPassword === parsed.data.password,
        );

        const matchesHash = hashedPassword
          ? await compare(parsed.data.password, hashedPassword)
          : false;

        if (!matchesPlain && !matchesHash) {
          return null;
        }

        return {
          id: "quantifyed-admin",
          email: process.env.ADMIN_EMAIL,
          name: "QuantifyED Admin",
          role: "ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: "ADMIN" | "STUDENT" }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "STUDENT" | undefined;
      }

      return session;
    },
  },
});
