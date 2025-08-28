"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { baseURL } from "@/config";

export default function AuthCallback() {
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/workspace");
      return;
    }

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status === "authenticated" && data?.user) {
      const { name, email, image } = data.user;
      if (!name || !email) {
        router.replace("/");
        return;
      }

      axios
        .post(
          `${baseURL}/v1/api/user`,
          { name, email, image: image || null },
          { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        )
        .then((res) => {
          const token = res.data.token;
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


