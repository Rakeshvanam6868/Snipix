// components/MiddleSection/SnippetCard.tsx (or your relevant path)
"use client"; // Important for client-side interactivity

import React, { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { FaShareAlt } from "react-icons/fa";
import ShareSnippet from "@/components/RightDrawer/ShareSnippet";
import DeleteSnippet from "./DeleteSnippet";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

// Import Shadcn UI Components
import {
  Card,
  CardContent,
  CardHeader,
  // CardTitle, // Might not be needed if title is handled directly
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import Lucide React Icon
import { MoreVertical } from "lucide-react";

interface SnippetCardProps {
  title: string;
  code: string;
  // description: string; // Seems unused in current logic, commented out
  tags: (
    | "C++"
    | "Python"
    | "JavaScript"
    | "Java"
    | "TypeScript"
    | "React"
    | "Node"
  )[];
  _id: string;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  title,
  code,
  // description, // Unused
  tags,
  _id,
}) => {
  // State for controlling the dropdown menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteSnippetOpen, setDeleteSnippetOpen] = useState(false);
  // Ref for the dropdown trigger button to position the menu
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const snippet_id = searchParams.get("snippet") || "";

  const [shareSnippet, setShareSnippet] = useState(false);

  // --- Logic functions (kept mostly the same) ---

  // Function to update the URL when a snippet is selected
  const updateUrl = (id: string) => {
    const workspace = searchParams.get("workspace") || "";
    const collection = searchParams.get("collection") || "";
    const query: Record<string, string> = {
      workspace,
      collection,
    };
    if (id) {
      query.snippet = id;
    }
    // Use replace to avoid adding to browser history on selection
    router.replace(`?${new URLSearchParams(query).toString()}`);
  };

  // Function to update the URL for editing
  const newUpdateUrlForEdit = () => {
    const workspace = searchParams.get("workspace") || "";
    const collection = searchParams.get("collection") || "";
    const query: Record<string, string> = {
      workspace,
      collection,
    };
    query.snippet = _id;
    query.edit = "true";
    router.push(`?${new URLSearchParams(query).toString()}`); // Use push for navigation to edit
  };

  // Handler for dropdown menu options
  const handleOptionClick = (option: string) => {
    console.log("Option clicked:", option);
    switch (option) {
      case "edit":
        console.log("Edit clicked");
        newUpdateUrlForEdit();
        setIsDropdownOpen(false); // Close dropdown after action
        break;
      case "delete":
        console.log("Delete clicked");
        setDeleteSnippetOpen(true);
        setIsDropdownOpen(false); // Close dropdown after action
        break;
      case "share":
        console.log("Share clicked");
        setShareSnippet(true);
        setIsDropdownOpen(false); // Close dropdown after action
        break;
      default:
        break;
    }
  };

  // --- Icon Handling (kept mostly the same) ---
  const languageIcon =
    "https://img.icons8.com/?size=50&id=22183&format=png&color=808080";
  const languages: Record<string, string> = {
    Python: "/icon_py.png",
    JavaScript: "/icon_js.png",
    Java: "/icon_java.png",
    TypeScript: "/icon_ts.png",
    "C++": "/icon_cpp.png",
    React: "/icon_react.png",
    Node: "/icon_node.png",
  };
  const lang_icon = tags[0]; // Get the first tag for the icon

  // Handler to close the share snippet modal
  const handleCloseShare = () => {
    setShareSnippet(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Use Shadcn Card for structure */}
      <Card
        className={`relative overflow-visible mb-3 mr-2 transition-all duration-200 ease-in-out
          ${
            snippet_id === _id
              ? "bg-zinc-800 border-zinc-600 shadow-md" // Selected state
              : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800/70 hover:border-zinc-700 hover:shadow-sm" // Default & hover state
          }`}
        onClick={() => updateUrl(_id)} // Click handler on the card itself
      >
        <CardHeader className="p-3 pb-2">
          {" "}
          {/* Reduced padding */}
          <div className="flex items-start">
            {/* Language Icon {`${lang_icon || 'Language'} Icon`} */}
            <div className="flex items-center mr-2 mt-1 flex-shrink-0">
              <Image
                src={languages[lang_icon] || languageIcon}
                alt=""
                className=""
                width={18}
                height={18}
              />
            </div>
            {/* Title */}
            <h3 className="text-base font-semibold truncate text-zinc-100">
              {" "}
              {/* Adjusted font size and weight */}
              {title}
            </h3>
            {/* Dropdown Menu Trigger - Positioned at the end */}
            <div className="ml-auto flex-shrink-0">
              {/* Use Button from shadcn/ui for the trigger */}
              <Button
                ref={dropdownTriggerRef} // Attach ref for positioning if needed (though shadcn usually handles it)
                variant="ghost" // Ghost variant for a subtle button
                size="sm" // Smaller size
                className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 rounded-md" // Custom styling
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking the menu button
                  setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown
                }}
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" /> {/* Lucide icon */}
              </Button>

              {/* Conditional rendering of the dropdown menu based on isDropdownOpen */}
              {isDropdownOpen && (
                <div
                  // Improved styling and positioning for visibility outside card
                  className="absolute z-50 ml-10 mt-1 w-40 rounded-md border border-zinc-700 bg-zinc-900  shadow-lg" // Darker background, border, shadow
                  style={{
                    // Ensure it appears below the trigger button, slightly offset
                    top: dropdownTriggerRef.current
                      ? `${dropdownTriggerRef.current.offsetTop + dropdownTriggerRef.current.offsetHeight + 5}px`
                      : "auto",
                    right: "0px", // Align to the right edge of the parent relative container
                  }}
                >
                  <div className="flex flex-col">
                    {/* Edit Button - Blue Theme */}
                    <button
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer w-full text-left text-gray-400 hover:bg-gray-500/20 transition-colors duration-150" // Blue text, light blue hover bg
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick("edit");
                      }}
                    >
                      <span>Edit</span>
                      <MdEdit className="h-4 w-4" />
                    </button>
                    {/* Delete Button - Red Theme */}
                    <button
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer w-full text-left text-red-400 hover:bg-red-500/20 transition-colors duration-150" // Red text, light red hover bg
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick("delete");
                      }}
                    >
                      <span>Delete</span>
                      <MdDelete className="h-4 w-4" />
                    </button>
                    {/* Share Button - Blue Theme (or choose another) */}
                    <button
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer w-full text-left text-blue-400 hover:bg-blue-500/20 transition-colors duration-150" // Blue text, light blue hover bg
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick("share");
                      }}
                    >
                      <span>Share</span>
                      <FaShareAlt className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {/* Code Preview */}
          <p className="text-xs text-zinc-400 mb-2 line-clamp-2">
            {" "}
            {/* Smaller text, line clamp */}
            {code.substring(0, 100)} {/* Adjust substring length if needed */}
          </p>
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5" // Notion-like tag style
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-zinc-700 text-zinc-400 text-xs px-2 py-0.5">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals - Logic kept the same */}
      {deleteSnippetOpen && (
        <DeleteSnippet
          open={deleteSnippetOpen}
          onClose={() => setDeleteSnippetOpen(false)}
          snippet_id={_id}
        />
      )}
      {shareSnippet && (
        <ShareSnippet snippet_id={_id} onClose={handleCloseShare} />
      )}

      {/* Click outside to close dropdown (optional, can be refined) */}
      {/* This is a basic implementation. Consider using a more robust solution or shadcn's built-in features if using Popover/DropdownMenu */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </Suspense>
  );
};

export default SnippetCard;
