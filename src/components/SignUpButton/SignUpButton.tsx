"use client";

import { baseURL } from "@/config";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import StarBorder from "../ui/StarBorder";

interface ButtonProps {
  description: string;
}

export function SignUpButton({ description }: ButtonProps) {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/workspace");
    }
  }, [router]);

  const handleSignIn = () => {
    // Redirect to callback after login
    signIn("google", { callbackUrl: "/api/auth/callback" });
  };

  return (
    <>
      <StarBorder
        onClick={handleSignIn}
        as="button"
        className="custom-class"
        color="cyan"
        speed="5s"
      >
        {description}
      </StarBorder>
    </>
  );
}