"use client";
import Drawer from "@/components/RightDrawer/Drawer";
import SnippetSection from "@/components/MiddleSection/SnippetSection";
import React, { Suspense, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { baseURL } from "@/config";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { RiRefreshLine } from "react-icons/ri";
import SearchParamsHandler from "./SearchParamHandler"; // Ensure this component is compatible or also updated
import { ToastContainer } from "react-toastify";

// Import Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path if needed
import { Input } from "@/components/ui/input"; // Adjust path if needed
import { Button } from "@/components/ui/button"; // Adjust path if needed
import { Search } from "lucide-react"; // Assuming you have lucide-react installed

const WorkspacePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleAdd = () => {
    setOpenDrawer(true);
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.append("add", "true");
    router.push(`${pathname}?${nextSearchParams.toString()}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [inpText, setInpText] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]); // Add type if possible

  useEffect(() => {
    const globalSearch = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Handle case where token is missing
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(
          `${baseURL}/v1/api/snippet/global?text=${inpText}`,
          { headers }
        );
        setSearchData(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchData([]); // Reset on error
      }
    };
    if (inpText) {
      globalSearch();
    } else {
      setSearchData([]);
    }
  }, [inpText]);

  const searchParams = useSearchParams();
  const collection = searchParams.get("collection") ?? "";
  const snippet = searchParams.get("snippet") ?? "";

  const updateURL = (snippetData: any) => { // Renamed snippet to snippetData to avoid conflict
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    searchParams.set("workspace", snippetData.workspace_id);
    searchParams.set("collection", snippetData.category_id);
    searchParams.set("snippet", snippetData._id);
    const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
    handleClose(); // Close the dialog after selection
  };

  const [isRefresh, setIsRefresh] = useState<boolean | undefined>(undefined);
  const toggleRefresh = () => {
    setIsRefresh(prev => !prev);
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <SearchParamsHandler closeGlobalSearch={()=>handleClose()}/> */}
      </Suspense>

      {/* Main Content Area */}
      <div className="fixed  inset-0 top-0 left-0 w-10/12 ml-[12%] sm:ml-[16%] h-screen text-white bg-zinc-900 flex flex-col"> {/* Changed to flex-col */}
        {/* Top Bar - Responsive Container */}
        <div className="w-full p-4 bg-zinc-900"> {/* Adjust padding as needed */}
          {/* Responsive Flex Container */}
          <div className="flex flex-col lg:flex-row items-center justify-evenly mt-10 w-full gap-4"> {/* Stack on small, row on large */}

            {/* Search Bar - Centered */}
            <div className="flex-grow w-full max-w-2xl"> {/* Control width and centering */}
              <Dialog open={open} onOpenChange={setOpen}> {/* Use Shadcn Dialog */}
                <DialogTrigger asChild>
                  {/* Search Input Trigger - Looks like a search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Find by Tag, Description, Title..."
                      className="pl-10 pr-4 py-2 w-full rounded-full bg-zinc-800 border border-zinc-700 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-zinc-100 placeholder-zinc-400"
                      readOnly // Make it readonly to trigger the dialog
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-zinc-400 bg-zinc-700 px-2 py-1 rounded">
                      CTRL+K
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col bg-zinc-950 border border-zinc-800"> {/* Style Dialog Content */}
                  <DialogHeader className="shrink-0">
                    <DialogTitle>Search Snippet</DialogTitle>
                  </DialogHeader>
                  <div className="flex-grow overflow-auto p-1"> {/* Scrollable Content Area */}
                    {/* Search Input inside Dialog */}
                    <Input
                      type="text"
                      placeholder="Type to search..."
                      value={inpText}
                      onChange={(e) => setInpText(e.target.value)}
                      className="mb-4 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-400"
                    />
                    {/* Search Results */}
                    {inpText && (
                      <div className="max-h-[60vh] overflow-y-auto"> {/* Limit height of results */}
                        {searchData && searchData.length > 0 ? (
                          searchData.map((snippetItem: any, index: number) => (
                            <div
                              key={index}
                              onClick={() => updateURL(snippetItem)}
                              className="shadow-lg mb-4 cursor-pointer border border-zinc-800 hover:border-zinc-600 rounded-lg p-3 transition-colors duration-200"
                            >
                              <p className="flex items-center text-sm text-zinc-400 mb-1">
                                <IoIosArrowForward className="mr-1 flex-shrink-0" />
                                workspace
                                <IoIosArrowForward className="mx-1 flex-shrink-0" />
                                collection
                                <IoIosArrowForward className="mx-1 flex-shrink-0" />
                                {snippetItem.title}
                              </p>
                              <div className="flex items-start">
                                <div>
                                  <p className="text-lg font-semibold truncate">
                                    {snippetItem.title}
                                  </p>
                                  <p className="text-sm text-zinc-300 line-clamp-2">
                                    {snippetItem.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {snippetItem.tags.map((tag: string, tagIndex: number) => (
                                  <span
                                    key={tagIndex}
                                    className="bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded"
                                  >
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
                     {/* <Suspense fallback={<div>Loading...</div>}>
                       <SearchParamsHandler closeGlobalSearch={handleClose} />
                     </Suspense> */}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Action Buttons - Right aligned on large, below on small */}
            <div className="flex gap-2 w-full lg:w-auto justify-center lg:justify-start"> {/* Flex row, center on small, left on large */}
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
                variant="outline" // Use outline variant for refresh
                className="border-zinc-700 hover:bg-zinc-800 rounded-xl w-10 h-10"
                onClick={toggleRefresh}
                aria-label="Refresh"
              >
                <RiRefreshLine className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Below Search */}
        <div className="flex-grow overflow-hidden mt-6 p-4 pt-0"> {/* Adjust padding */}
          <SnippetSection isRefresh={isRefresh} />
          {collection && ( // Conditionally render drawer based on collection
            <Drawer
              className="fixed top-16 right-0"
              isOpen={openDrawer}
              setIsOpen={setOpenDrawer}
              isEditable={isEditable} // Pass state correctly
              setIsEditable={setIsEditable}
              shared="false"
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WorkspacePage;