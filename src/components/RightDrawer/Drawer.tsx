"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { MdCancel } from "react-icons/md";
import CodeBlock from "./CodeBlock";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Props {
  isOpen: boolean;
  setIsOpen: any;
  isEditable: boolean;
  setIsEditable: any;
  className: string;
  shared: any;
}

const RightDrawer = ({
  isOpen,
  setIsOpen,
  isEditable,
  setIsEditable,
  className,
  shared,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const snippet = searchParams.get("snippet") ?? "";
  const edit = searchParams.get("edit") ?? "";
  const collection = searchParams.get("collection") ?? "";
  const add = searchParams.get("add") ?? "";

  const flag = shared === "true";

  const updateUrl = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("snippet");
    if (edit) nextParams.delete("edit");
    if (add) nextParams.delete("add");
    router.push(`${pathName}?${nextParams.toString()}`);
  };

  const closeDrawer = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (add) nextParams.delete("add");
    router.push(`${pathName}?${nextParams.toString()}`);
  };

  // DELETE THIS BLOCK
  useEffect(() => {
    if (snippet) setIsOpen(true);
  }, [snippet, setIsOpen]);

  const shouldShowDrawer = Boolean(snippet) || add === "true";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center">
        <Drawer
          open={shouldShowDrawer}
          onClose={flag ? undefined : closeDrawer}
        >
          <DrawerContent
            className={` w-full  bg-zinc-900 shadow-2xl ${className}`}
          >
            <DrawerHeader className="flex w-full items-center justify-between px-4 py-3">
              <DrawerTitle className="text-white text-lg">
                {snippet ? "Edit Snippet" : "Add Snippet"}
              </DrawerTitle>
              {!flag && (
                <DrawerClose asChild>
                  <button
                    className="text-white text-2xl hover:text-red-500 transition"
                    onClick={snippet ? updateUrl : closeDrawer}
                  >
                    <MdCancel />
                  </button>
                </DrawerClose>
              )}
            </DrawerHeader>

            <div className="p-4 ">
              <CodeBlock
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                setIsOpen={setIsOpen}
                shared={shared}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </Suspense>
  );
};

export default RightDrawer;
