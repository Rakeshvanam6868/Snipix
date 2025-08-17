"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SnippetModal = () => {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");
  const collection = searchParams.get("collection");

  const isValidContext = workspace && collection;

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    code: "",
    tags: [],
    category_id: "",
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleCreateSnippet = async () => {
    if (!isValidContext) return;

    const body = {
      title: data.title,
      description: data.description,
      code: data.code,
      tags: tags,
      category_id: collection,
      workspace_id: workspace,
    };

    try {
      await axios.post("http://localhost:8001/v1/api/snippet", body);
      console.log("Snippet created successfully!");
      // Optionally: reset form, close modal, refresh list
    } catch (error) {
      console.error("Failed to create snippet:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-5/6">
        {!isValidContext ? (
          // ❗ Friendly message when context is missing
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-gray-500 italic text-center">
              Select a <strong>workspace</strong> and a{" "}
              <strong>collection</strong> to add snippets.
            </p>
          </div>
        ) : (
          // ✅ Show Add Snippet Button only when valid
          <Sheet>
            <Tooltip title="Add a new snippet" arrow>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="text-2xl rounded-full bg-blue-800 h-10 w-10 flex items-center justify-center text-white hover:bg-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Add snippet"
                >
                  +
                </button>
              </SheetTrigger>
            </Tooltip>

            <SheetContent className="p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle>✨ Create a New Snippet</SheetTitle>
                <SheetDescription>
                  Add your code snippet to this collection.
                </SheetDescription>
              </SheetHeader>

              <div className="h-full overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. API Fetch Example"
                    value={data.title}
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="What does this snippet do?"
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Code *
                  </label>
                  <textarea
                    placeholder="// Your code here..."
                    value={data.code}
                    onChange={(e) =>
                      setData({ ...data, code: e.target.value })
                    }
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Press Enter to add tag"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-900 text-blue-100 rounded-full px-2.5 py-0.5 text-xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() =>
                            setTags(tags.filter((_, i) => i !== index))
                          }
                          className="ml-1 text-blue-300 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateSnippet}
                  variant="contained"
                  disabled={!data.title.trim() || !data.code.trim()}
                  className="w-full mt-4"
                  style={{ height: "40px" }}
                >
                  Create Snippet
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </Suspense>
  );
};

export default SnippetModal;