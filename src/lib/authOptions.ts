// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const BACKEND_URL = process.env.BACKEND_URL || "";
const NEXTAUTH_URL_ENV = process.env.NEXTAUTH_URL || "";

if (!NEXTAUTH_URL_ENV) {
  console.warn(
    "NEXTAUTH_URL is not set. This will cause callback/redirect and Invalid URL errors. Set NEXTAUTH_URL in .env.local (e.g. http://localhost:3000) and restart."
  );
}
if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "NEXTAUTH_SECRET is not set. Set NEXTAUTH_SECRET in .env.local (generate a secure random string)."
  );
}
if (!BACKEND_URL) {
  console.warn("BACKEND_URL not set. Backend calls will fail.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user?.email && BACKEND_URL) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image ?? "",
            }),
          });

          if (!res.ok) {
            console.warn("Backend exchange failed:", await res.text());
            (token as any).backendJwt = null;
            return token;
          }

          const data = await res.json();
          (token as any).backendJwt = data.token ?? null;
          (token as any).backendRefreshToken = data.refreshToken ?? null;
          (token as any).backendJwtExpires = data.expiresIn
            ? Date.now() + Number(data.expiresIn) * 1000
            : null;
        } catch (error) {
          console.error("Error exchanging user with backend:", error);
          (token as any).backendJwt = null;
        }
      }

      // Token refresh logic
      const expires = typeof (token as any).backendJwtExpires === "number" ? (token as any).backendJwtExpires : 0;
      if ((token as any).backendJwt && expires && Date.now() > expires) {
        if ((token as any).backendRefreshToken && BACKEND_URL) {
          try {
            const res = await fetch(`${BACKEND_URL}/api/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken: (token as any).backendRefreshToken,
              }),
            });

            if (!res.ok) {
              console.warn(
                "Backend refresh failed: status",
                res.status,
                await res.text()
              );
              (token as any).backendJwt = null;
              (token as any).backendRefreshToken = null;
              (token as any).backendJwtExpires = null;
              return token;
            }

            const data = await res.json();
            (token as any).backendJwt = data.token ?? null;
            (token as any).backendRefreshToken = data.refreshToken ?? null;
            (token as any).backendJwtExpires = data.expiresIn
              ? Date.now() + Number(data.expiresIn) * 1000
              : null;
          } catch (error) {
            console.error("Error refreshing backend JWT:", error);
            (token as any).backendJwt = null;
            (token as any).backendRefreshToken = null;
            (token as any).backendJwtExpires = null;
          }
        } else {
          // No refresh token - force logout
          (token as any).backendJwt = null;
          (token as any).backendRefreshToken = null;
          (token as any).backendJwtExpires = null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).backendJwt = (token as any).backendJwt ?? null;
      (session as any).backendJwtExpires = (token as any).backendJwtExpires ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
