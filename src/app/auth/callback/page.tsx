"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }

    if (status === "authenticated" && !hasRedirected.current) {
      hasRedirected.current = true;
      // Redirect user to protected workspace or dashboard
      router.replace("/workspace");
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}
