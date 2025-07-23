"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { LuCopyPlus } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { TbPencilCancel } from "react-icons/tb";
import { CiShare2 } from "react-icons/ci";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-twilight.css";
import axios from "axios";

import ShareSnippet from "./ShareSnippet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addSnippetBody } from "@/inputValidation";
import { baseURL } from "@/config";

interface Props {
  isEditable: boolean;
  setIsEditable: any;
  shared: string;
  setIsOpen: any;
}

export default function CodeBlock({
  isEditable,
  setIsEditable,
  shared,
  setIsOpen,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const snippet = searchParams.get("snippet") ?? "";
  const collection = searchParams.get("collection") ?? "";
  const workspace = searchParams.get("workspace") ?? "";
  const edit = searchParams.get("edit") ?? "";
  const add = searchParams.get("add") ?? "";

  const [codeData, setCodeData] = useState<any>({});
  const [showShare, setShowShare] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [data, setData] = useState({
    title: "",
    description: "",
    code: "",
    tags: [],
    category_id: "",
  });

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const isSnippetArray = Array.isArray(codeData);
  const cleanCode = isSnippetArray
    ? codeData[0]?.code?.trim().replace(/`/g, "")
    : "";

  useEffect(() => {
    if (snippet) {
      const token = localStorage.getItem("token");
      axios
        .get(`${baseURL}/v1/api/snippet?snippet_id=${snippet}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCodeData(res.data))
        .catch((err) => console.log(err));
    }
    Prism.highlightAll();
  }, [snippet]);

  const toggleEditable = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (edit) {
      nextParams.delete("edit");
      setIsEditable(false);
    } else {
      nextParams.append("edit", "true");
      setIsEditable(true);
    }
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const handleCreateSnippet = async () => {
    const validation = addSnippetBody.safeParse({
      title: data.title,
      description: data.description,
      code: data.code,
      tags,
    });

    if (!validation.success) return alert("Invalid Inputs");

    try {
      const body = {
        ...data,
        tags,
        category_id: collection,
        workspace_id: workspace,
      };

      const token = localStorage.getItem("token");
      const res = await axios.post(`${baseURL}/v1/api/snippet`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const id = res.data.data._id;
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("snippet", id);
      setIsOpen(false);
      router.push(`${pathname}?${nextParams.toString()}`);
    } catch (err) {
      console.log("Failed to create snippet:", err);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    toast.success("Copied to clipboard");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4 w-full gap-5 flex flex-col lg:flex-row xl:flex-row">
        <div className="w-full space-y-4 flex flex-col pr-10 gap-2 lg:w-1/2 xl:w-1/2">
          {/* Title + Description */}
          {snippet && isSnippetArray ? (
            <>
              <h2 className="text-white text-2xl font-semibold">
                {codeData[0].title}
              </h2>
              <p className="text-white">{codeData[0].description}</p>
            </>
          ) : (
            <>
              <Input
                placeholder="Title..."
                className="text-white rounded-xl"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
              <Input
                placeholder="Description..."
                className="text-white rounded-xl"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </>
          )}

          {/* Tags */}
          {!snippet && (
            <div className="space-y-2">
              <Input
                placeholder="Add tag and press Enter"
                className="text-white border border-zinc-100 w-full rounded-xl"
                value={tagInput}
                onKeyDown={handleTagAdd}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-purple-700 text-white"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Language Selector */}
          {!snippet && (
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setTags([e.target.value]);
              }}
              className="bg-zinc-900 text-white border border-zinc-700 p-2 rounded-md"
            >
              <option value="" disabled>
                Select language...
              </option>
              {[
                "JavaScript",
                "Python",
                "Java",
                "C++",
                "TypeScript",
                "Rust",
              ].map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          )}

          {/* Action Buttons */}
          {shared !== "true" && snippet && (
            <div className="flex pt-6 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={toggleEditable}
                  >
                    {isEditable ? <TbPencilCancel /> : <MdEdit />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isEditable ? "Cancel" : "Edit"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" onClick={handleCopy}>
                    <LuCopyPlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setShowShare(true)}
                  >
                    <CiShare2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            </div>
          )}


           {/* Save Button - always visible */}
          {!snippet && (
            <div className="mt-4 rounded-xl text-center">
              <Button
                onClick={handleCreateSnippet}
                className="w-6/12 lg:w-3/12 xl:w-3/12 rounded-xl hover:bg-blue-600  bg-blue-500 text-white"
              >
                Save Snippet
              </Button>
            </div>
          )}

          {/* Share Modal */}
          {showShare && snippet && (
            <ShareSnippet
              snippet_id={snippet}
              onClose={() => setShowShare(false)}
            />
          )}
        </div>


        {/* Code Block or Editor */}
        <div className="w-full flex flex-col max-h-[70vh] lg:w-1/2 xl:w-1/2">
          {/* Scrollable Code Area */}
          <div className="rounded-xl bg-zinc-900 p-4 shadow-inner border border-zinc-100 overflow-y-auto min-h-[60vh] max-h-[60vh]">
            {snippet ? (
              <pre>
                <code
                  className={`language-${selectedLanguage || "javascript"}`}
                  id="editable-code"
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                >
                  {cleanCode}
                </code>
              </pre>
            ) : (
              <Textarea
                placeholder="Write your code here..."
                className="text-white border-none font-mono min-h-[30vh] h-full resize-none"
                value={data.code}
                onChange={(e) => setData({ ...data, code: e.target.value })}
              />
            )}
          </div>

         
        </div>
        
      </div>
    </Suspense>
  );
}
