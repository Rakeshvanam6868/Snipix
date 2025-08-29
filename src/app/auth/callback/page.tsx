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
      }, 12000);
      return () => clearTimeout(timeout);
    }

    if (status === "authenticated" && data?.user && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;
      const { name, email, image } = data.user;
      if (!name || !email) {
        // Still go to workspace to allow guarded mint there using session
        router.replace("/workspace");
        return;
      }

      // If baseURL is missing, skip minting here and let workspace mint.
      if (!baseURL) {
        router.replace("/workspace");
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
            // Proceed to workspace and let it mint using the session
            router.replace("/workspace");
          }
        })
        .catch(() => {
          // Proceed to workspace and let it mint using the session
          router.replace("/workspace");
        });
    }
  }, [status, router, data?.user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}


