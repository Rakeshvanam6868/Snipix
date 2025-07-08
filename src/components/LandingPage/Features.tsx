import { FaRegFolderOpen } from "react-icons/fa6";
import { TiCloudStorage } from "react-icons/ti";
import { MdAssistantNavigation } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { FaShare } from "react-icons/fa";
import { GlowingEffectDemo } from "./GlowingEffectDemo";

export default function Features() {
  return (
    <div  id="features" className=" text-white m-auto flex flex-col items-center justify-center w-full ">
      <h1 className="text-4xl md:text-6xl font-bold mt-5 text-center text-[#F2F2F2] mb-4">
          Everything you need in one platform
        </h1>
        <p className="text-lg md:text-xl text-[#FFFFFF] mb-6 px-5 pb-10 max-w-2xl">
          We have built the best in class tools to manage the.
        </p>
      <GlowingEffectDemo/>
    </div>
  );
}
