import Image from "next/image";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className=" xl:px-20 lg:px-12 sm:px-6 px-4 py-12 backdrop-blur-md bg-gradient-to-r from-[#0b0b0e] to-[#030303] border-t border-[#f2f2f237]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row">
          <Image width={200} height={100} src="/fullLogo.png" alt="" />
        </div>
        <div className="flex flex-row gap-4">
        <div className="flex items-center gap-x-8 mt-6">
          <a
            href="https://www.linkedin.com/in/rakeshvanam1/"
            target="_blank"
            className="cursor-pointer"
          >
            <FaLinkedin size={25} />
          </a>
        </div>
        <div className="flex items-center gap-x-8 mt-6">
          <a
            href="https://github.com/Rakeshvanam6868/Snipix"
            target="_blank"
            className="cursor-pointer"
          >
            <FaGithub size={25} />
          </a>
        </div>
        </div>
        <div className="flex items-center mt-6">
          <p className="text-base leading-4 text-gray-300">
            <span>{new Date().getFullYear()}</span> <span className="font-semibold">Snipix</span>
          </p>
          <div className="border-l border-gray-800 pl-2 ml-2">
            <p className="text-base leading-4 text-gray-300">
              Inc. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
