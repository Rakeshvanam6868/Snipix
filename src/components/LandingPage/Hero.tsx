"use client";
import React, { useState } from "react";
import { SignUpButton } from "../SignUpButton/SignUpButton";
import Image from "next/image";
import Link from "next/link"; // Import Link
import Header from "./Header";
import { BackgroundBeams } from "../ui/background-beams";
import Features from "./Features";

const Hero: React.FC = () => {
  return (
    <>
    <Header/>
    <div className="w-full flex flex-col items-center justify-center bg-[#030303] backdrop-blur-md relative overflow-hidden">
      <BackgroundBeams/>
      <div className="flex flex-col items-center justify-center gap-4 text-center py-32 sm:pb-32 lg:pb-48">
        <h1 className="text-4xl md:text-6xl font-bold mt-10 sm:px-12 md:px-52 lg:px-96 text-[#F2F2F2] mb-4">
          Manage Your Code Snippets with Ease
        </h1>
        <p className="text-lg md:text-xl text-[#FFFFFF] mb-6 px-5 max-w-2xl">
          Snipix provides a clean and intuitive interface to help you
          quickly find, organize, and share your code snippets. Never
          waste time searching for that one snippet you need again.
        </p>
        
        <SignUpButton description="Get Started" />
        </div>
    </div>

      {/* <style>{`
        .top-100 {
            animation: slideDown .5s ease-in-out;
        }

        @keyframes slideDown {
            0% {
                top: -50%;
            }

            100% {
                top: 0;
            }
        }

        * {
            outline: none !important;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            -webkit-tap-highlight-color: transparent;
        } `}</style> */}
    </>
  );
};

export default Hero;
