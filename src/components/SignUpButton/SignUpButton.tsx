"use client";
import { baseURL } from "@/config";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import React, { useLayoutEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import StarBorder from "../ui/StarBorder";

interface ButtonProps {
  description: string;
}

export function SignUpButton({ description }: ButtonProps) {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useLayoutEffect(() => {
    const CreateUser = async () => {
      const body = {
        name: session.data?.user?.name,
        image: session.data?.user?.image,
        email: session.data?.user?.email,
      };
      console.log("body->", body);
      
      try {
        const response = await axios.post(`${baseURL}/v1/api/user`, body);
        console.log(response);
        localStorage.setItem("token", `${response.data.token}`);
        router.push("/workspace");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      router.push("/workspace");
    } else if (session && session.status === "authenticated") {
      setIsLoading(true);
      CreateUser();
    }
  }, [session, router]);

  const handleSignInGoogle = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);
    
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <>
      {isLoading &&  <LoadingSpinner />}
      
      <StarBorder
        onClick={handleSignInGoogle}
        as="button"
        className="custom-class"
        color="cyan"
        speed="5s"
        disabled={isDisabled || isLoading}
      >
        {description}
      </StarBorder>
    </>
  );
}