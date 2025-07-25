import React from "react";
import Collection from "@/components/LeftPanel/Collection";
import Sidebar from "@/components/LeftPanel/Sidebar";
import Sidebar1 from "@/components/LeftPanel/Sidebar1";
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#18181B] min-h-screen w-screen flex">
      <div className=" flex">
        {/* Sidebar content goes here */}
        <Sidebar1/>
      </div>
      {children}
    </div>
  );
};

export default Layout;
