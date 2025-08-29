"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const sp = useSearchParams();
  const error = sp.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 rounded-lg bg-zinc-900 border border-zinc-800 w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold mb-4">Authentication error</h1>
        <p className="text-zinc-300 break-all">{error || "Unknown error"}</p>
        <a href="/auth/signin" className="inline-block mt-6 underline">Back to sign in</a>
      </div>
    </div>
  );
}



