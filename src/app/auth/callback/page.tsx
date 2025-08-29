"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { baseURL } from "@/config";

export default function AuthCallback() {
  const router = useRouter();
  const { data, status } = useSession();
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/workspace");
      return;
    }

    if (status === "loading") {
      return;
    }

    // Do NOT immediately kick unauthenticated users to "/".
    // Give NextAuth a moment to hydrate the session and then proceed once authenticated.
    if (status === "unauthenticated") {
      // As a safety, if we remain unauthenticated for a while, send to sign in.
      const timeout = setTimeout(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("token")) {
          router.replace("/auth/signin");
        }
      }, 8000);
      return () => clearTimeout(timeout);
    }

    if (status === "authenticated" && data?.user && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;
      const { name, email, image } = data.user;
      if (!name || !email) {
        router.replace("/");
        return;
      }

      axios
        .post(
          `${baseURL}/v1/api/user`,
          { name, email, image: image || null },
          { headers: { "Content-Type": "application/json" }, timeout: 15000 }
        )
        .then((res) => {
          const token = res.data?.token;
          if (token) {
            localStorage.setItem("token", token);
            router.replace("/workspace");
          } else {
            router.replace("/");
          }
        })
        .catch(() => router.replace("/"));
    }
  }, [status, router, data?.user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}


