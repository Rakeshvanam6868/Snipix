"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { baseURL } from "../../../../config";

// Deprecated: this page has moved to /auth/callback to avoid conflicting with API routes
export default function AuthCallbackLegacy() {
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    // 1. If already logged in via token, go to workspace
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/workspace");
      return;
    }

    // 2. Wait for session to finish loading
    if (status === "loading") {
      console.log("AuthCallback: Session is still loading...");
      return;
    }

    // 3. If not authenticated, redirect to home
    if (status === "unauthenticated") {
      console.warn("AuthCallback: Not authenticated, redirecting to /");
      router.replace("/");
      return;
    }

    // 4. If authenticated, create user and get JWT
    if (status === "authenticated" && data?.user) {
      const { name, email, image } = data.user;

      if (!name || !email) {
        console.error("Missing required user info:", { name, email });
        router.replace("/");
        return;
      }

      console.log("AuthCallback: Creating user on backend...");
      axios
        .post(
          `${baseURL}/v1/api/user`,
          { name, email, image: image || null },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000, // 10s timeout
          }
        )
        .then((res) => {
          const token = res.data.token;
          if (!token) {
            throw new Error("No token returned from server");
          }

          localStorage.setItem("token", token);
          console.log("AuthCallback: Token saved, redirecting to /workspace");
          router.push("/workspace");
        })
        .catch((error: any) => {
          // Detailed error logging
          if (error.code === "ECONNABORTED") {
            console.error("Request timed out");
          } else if (error.response) {
            console.error("Server responded with error:", error.response.data);
            console.error("Status:", error.response.status);
          } else if (error.request) {
            console.error("No response received (CORS or network blocked)", error.request);
          } else {
            console.error("Error", error.message);
          }

          // Redirect to home on failure
          router.replace("/");
        });
    }
  }, [status, router, data?.user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}