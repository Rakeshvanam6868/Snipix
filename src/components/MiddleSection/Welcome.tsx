import React from "react";
import Image from 'next/image'
const Welcome = () => {
    return (
    <div className="flex flex-col justify-center w-full m-auto items-center self-center h-[80vh]">
      <Image
      src="/welcome_logo.png"
      className="opacity-30 grayscale m-auto"
      width={700}
      height={200}
      alt="Picture of the "
    />
    </div>
  );
};

export default Welcome;
