// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const BACKEND_URL = process.env.BACKEND_URL || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "";

if (!NEXTAUTH_URL) {
  console.warn(
    "Warning: NEXTAUTH_URL is not set. Set it in .env.local (e.g., http://localhost:3000)"
  );
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "Warning: NEXTAUTH_SECRET not set. Generate one and set it in .env.local"
  );
}

if (!BACKEND_URL) {
  console.warn("Warning: BACKEND_URL not set. Backend calls will fail.");
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
   cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user?.email && BACKEND_URL) {
        try {
          const res = await fetch(`${BACKEND_URL}/v1/api/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image ?? "",
            }),
          });

          if (!res.ok) {
            console.warn("Backend exchange failed:", await res.text());
            token.backendJwt = null;
            return token;
          }

          const data = await res.json();
          token.backendJwt = data.token ?? null;
          token.backendRefreshToken = data.refreshToken ?? null;
          token.backendJwtExpires = data.expiresIn
            ? Date.now() + Number(data.expiresIn) * 1000
            : null;
        } catch (error) {
          console.error("Error exchanging user with backend:", error);
          token.backendJwt = null;
        }
      }

      const expires =
        typeof token.backendJwtExpires === "number" ? token.backendJwtExpires : 0;
      if (token.backendJwt && expires && Date.now() > expires) {
        if (token.backendRefreshToken && BACKEND_URL) {
          try {
            const res = await fetch(`${BACKEND_URL}/api/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: token.backendRefreshToken }),
            });

            if (!res.ok) {
              console.warn("Backend refresh failed:", res.status, await res.text());
              token.backendJwt = null;
              token.backendRefreshToken = null;
              token.backendJwtExpires = null;
              return token;
            }

            const data = await res.json();
            token.backendJwt = data.token ?? null;
            token.backendRefreshToken = data.refreshToken ?? null;
            token.backendJwtExpires = data.expiresIn
              ? Date.now() + Number(data.expiresIn) * 1000
              : null;
          } catch (error) {
            console.error("Error refreshing backend JWT:", error);
            token.backendJwt = null;
            token.backendRefreshToken = null;
            token.backendJwtExpires = null;
          }
        } else {
          token.backendJwt = null;
          token.backendRefreshToken = null;
          token.backendJwtExpires = null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).backendJwt = token.backendJwt ?? null;
      (session as any).backendJwtExpires = token.backendJwtExpires ?? null;
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
