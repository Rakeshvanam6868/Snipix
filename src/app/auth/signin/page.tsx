"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/auth/callback" });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/auth/callback" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 rounded-lg bg-zinc-900 border border-zinc-800 w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold mb-6">Sign in to continue</h1>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2 rounded bg-white text-black hover:bg-zinc-200 disabled:opacity-60 mb-4"
        >
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
        <button
          onClick={handleGithubSignIn}
          disabled={loading}
          className="w-full py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60"
        >
          {loading ? "Redirecting..." : "Continue with Github"}
        </button>
      </div>
    </div>
  );
}
