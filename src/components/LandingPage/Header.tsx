"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
// import { ModeToggle } from "@/components/Toggle";
import { useState } from "react";
import { SignUpButton } from "../SignUpButton/SignUpButton";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-gradient-to-r from-[#141a1d] dark:to-[#0e0d0d] border-b border-[#f2f2f237] ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always Visible */}
          <div className="flex items-center gap-3">
            <Image
              src="/fullLogo.png"
              alt="Logo"
              width={150}
              height={40}
              className="h-10 w-32 rounded-full"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Menubar className="bg-transparent space-x-6 text-xl -ml-24 font-bold #F2F2F2">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <a href="/" className="cursor-pointer hover:text-primary transition-colors">
                    Home
                  </a>
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <a href="#features" className="cursor-pointer hover:text-primary transition-colors">
                    Features
                  </a>
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <a href="https://github.com/Rakeshvanam6868/Snipix" className="cursor-pointer hover:text-primary transition-colors">
                    Github
                  </a>
                </MenubarTrigger>
              </MenubarMenu>
              
            </Menubar>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Only show ModeToggle on desktop */}
            {/* <div className="hidden md:block">
              <ModeToggle />
            </div> */}

            <div className="hidden md:block">
              {/* <Avatar>
                <AvatarImage src="https://github.com/shadcn.png " />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> */}
              <SignUpButton description="Sign In"></SignUpButton>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>

                 

                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => console.log("Light theme")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Dark theme")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("System theme")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden p-2">
                  {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-3/4 sm:max-w-sm p-6">
                <nav className="flex flex-col gap-6 mt-6">
                  <a href="/" onClick={() => setOpen(false)} className="block text-lg font-medium hover:text-primary transition-colors">
                    Home
                  </a>
                  <a href="#features" onClick={() => setOpen(false)} className="block text-lg font-medium hover:text-primary transition-colors">
                    Features
                  </a>
                  <a href="https://github.com/Rakeshvanam6868/Snipix" onClick={() => setOpen(false)} className="block text-lg font-medium hover:text-primary transition-colors">
                    Github
                  </a>
                  <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4">
                    {/* Theme Toggle inside Sheet for Mobile */}
                    {/* <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted ">
                      <ModeToggle />
                      <p className="">Theme</p>
                    </div> */}

                    {/* Avatar + Profile Dropdown inside Sheet */}
                    <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png " />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span></span>
                    </div>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => console.log("Light theme")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Dark theme")}>
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("System theme")}>
                          System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}