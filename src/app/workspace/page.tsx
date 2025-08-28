"use client";

import Drawer from "@/components/RightDrawer/Drawer";
import SnippetSection from "@/components/MiddleSection/SnippetSection";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/config";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { RiRefreshLine } from "react-icons/ri";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkspacePage: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [inpText, setInpText] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean | undefined>(undefined);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Auth guard: block access without token
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthorized(false);
      router.replace("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const collection = searchParams.get("collection") ?? "";
  const snippet = searchParams.get("snippet") ?? "";

  const handleAdd = () => {
    setOpenDrawer(true);
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.append("add", "true");
    router.push(`${pathname}?${nextSearchParams.toString()}`);
  };

  // Keyboard shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Debounced global search
  React.useEffect(() => {
    const delay = setTimeout(async () => {
      const token = localStorage.getItem("token");
      if (!token || !inpText.trim()) {
        setSearchData([]);
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${baseURL}/v1/api/snippet/global?text=${encodeURIComponent(inpText)}`,
          { headers }
        );
        setSearchData(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchData([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [inpText]);

  const updateURL = (snippetData: any) => {
    const params = new URLSearchParams();
    params.set("workspace", snippetData.workspace_id || "");
    params.set("collection", snippetData.category_id || "");
    params.set("snippet", snippetData._id || "");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const toggleRefresh = () => setIsRefresh(prev => !prev);

  return (
    <div>
      <ToastContainer />

      {isAuthorized === null && (
        <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>
      )}

      {isAuthorized === false && (
        <div className="flex items-center justify-center min-h-screen text-white">Redirecting...</div>
      )}

      {isAuthorized === true && (
        <div className="fixed inset-0 top-0 left-0 w-10/12 ml-[12%] sm:ml-[16%] h-screen bg-zinc-900 flex flex-col text-white">
          <div className="w-full p-4 bg-zinc-900">
            <div className="flex flex-col lg:flex-row items-center justify-evenly mt-10 gap-4">
              <div className="flex-grow w-full max-w-2xl">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="text"
                        placeholder="Find by Tag, Description, Title..."
                        className="pl-10 pr-4 py-2 w-full rounded-full bg-zinc-800 border border-zinc-700 focus-visible:ring-1 focus-visible:ring-blue-500 text-zinc-100 placeholder-zinc-400"
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 bg-zinc-700 px-2 py-1 rounded">
                        CTRL+K
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col bg-zinc-950 border border-zinc-800">
                    <DialogHeader>
                      <DialogTitle>Search Snippet</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-auto p-1">
                      <Input
                        type="text"
                        placeholder="Type to search..."
                        value={inpText}
                        onChange={(e) => setInpText(e.target.value)}
                        className="mb-4 bg-zinc-900 border-zinc-700 text-white"
                      />
                      {inpText && (
                        <div className="max-h-[60vh] overflow-y-auto">
                          {searchData.length > 0 ? (
                            searchData.map((item, idx) => (
                              <div
                                key={idx}
                                onClick={() => updateURL(item)}
                                className="mb-4 p-3 border border-zinc-800 hover:border-zinc-600 rounded-lg cursor-pointer"
                              >
                                <p className="flex items-center text-sm text-zinc-400 mb-1">
                                  <IoIosArrowForward className="mr-1" />
                                  workspace
                                  <IoIosArrowForward className="mx-1" />
                                  collection
                                  <IoIosArrowForward className="mx-1" />
                                  {item.title}
                                </p>
                                <p className="text-lg font-semibold truncate">{item.title}</p>
                                <p className="text-sm text-zinc-300 line-clamp-2">{item.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.map((tag: string, i: number) => (
                                    <span key={i} className="bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-zinc-500 py-4">No snippets found.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-2 w-full lg:w-auto justify-center lg:justify-start">
                <Button
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl w-10 h-10"
                  onClick={handleAdd}
                  aria-label="Add Snippet"
                >
                  <IoIosAdd className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-zinc-700 hover:bg-zinc-800 rounded-xl w-10 h-10"
                  onClick={toggleRefresh}
                  aria-label="Refresh"
                >
                  <RiRefreshLine className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-hidden mt-6 p-4 pt-0">
            <SnippetSection isRefresh={isRefresh} />
            {collection && (
              <Drawer
                className="fixed top-16 right-0"
                isOpen={openDrawer}
                setIsOpen={setOpenDrawer}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                shared="false"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;