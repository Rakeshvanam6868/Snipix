"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FilePlus2,
  Plus,
  Search,
  X,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import { baseURL } from "@/config";
import DeleteCollectionModal from "./DeleteCollectionModal";
import EditCollection from "./EditCollection";

interface CollectionProps {
  selectedWorkspace: string | null;
  setSelectedWorkspace: (id: string | null) => void;
  workspaces: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  isSidebarOpen: boolean;
}

const Collection1 = ({
  selectedWorkspace,
  setSelectedWorkspace,
  workspaces,
  isSidebarOpen,
}: CollectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collection, setCollection] = useState<any[]>([]);
  const [data, setData] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteCollectionModalOpen, setDeleteCollectionModalOpen] = useState(false);
  const [editCollectionOpenby, setEditCollectionOpenby] = useState(false);
  const [singleCollection, setSingleCollection] = useState({
    _id: "",
    name: "",
    description: "",
  });
  const [selectedColor, setSelectedColor] = useState<string>("#3b82f6");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const workspace = searchParams.get("workspace") || "";
  const collectionid = searchParams.get("collection") || "";
  const shared = searchParams.get("shared") || "";

  const fetchCategories = React.useCallback(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(`${baseURL}/v1/api/category/${workspace}`, { headers })
      .then((res) => {
        setCollection(res.data);
        setIsDataLoading(false);
      })
      .catch((err) => console.error(err));
  }, [workspace]);

  useEffect(() => {
    if (workspace) {
      setIsDataLoading(true);
      fetchCategories();
    }
  }, [workspace, fetchCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownTriggerRef.current !== event.target
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleThreeDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    collection: any
  ) => {
    e.stopPropagation();
    dropdownTriggerRef.current = e.currentTarget;
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({ x: rect.left - 230, y: rect.bottom + 5 });
    setIsDropdownOpen(true);
    setSingleCollection(collection);
  };

  const handleOptionClick = (option: string) => {
    setIsDropdownOpen(false);
    switch (option) {
      case "edit":
        setEditCollectionOpenby(true);
        break;
      case "delete":
        setDeleteCollectionModalOpen(true);
        break;
    }
  };

  const handleCreateCollection = () => {
    if (!data.trim()) return;
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      id: workspace,
      name: data,
      description: "Snipix Project Snippets",
      color: selectedColor,
    };
    axios
      .post(`${baseURL}/v1/api/category`, body, { headers })
      .then(() => {
        fetchCategories();
        setShowInput(false);
        setIsLoading(false);
        setData("");
        setSelectedColor("#3b82f6");
      })
      .catch((err) => {
        console.error("Error creating collection:", err);
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreateCollection();
  };

  const updateUrl = (id: string) => {
    const params = new URLSearchParams();
    params.set("workspace", workspace);
    params.set("collection", id);
    if (shared) params.set("shared", shared);
    router.push(`?${params.toString()}`);
  };

  const getTextColor = (bgColor: string) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? "#000000" : "#ffffff";
  };

  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (!selectedWorkspace) return null;

  return (
    <aside
      className={`fixed left-0 top-0 z-10 w-[260px] h-screen bg-[#141415] text-white border-r border-zinc-800 px-4 py-4 transition-transform duration-300 ease-in-out transform ${
        isSidebarOpen ? "translate-x-[260px]" : "translate-x-16"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg truncate">
          {workspaces.find((ws) => ws._id === selectedWorkspace)?.name || "Workspace"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white"
          onClick={() => setSelectedWorkspace(null)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Button
        className="w-full justify-start bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-3 py-2 text-sm mb-4"
        onClick={() => {
          setShowInput(true);
          setData("");
          setSelectedColor("#3b82f6");
        }}
      >
        <Plus className="mr-2 w-4 h-4" />
        Add Collection
      </Button>

      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Search collections"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
        />
      </div>

      {showInput && (
        <div className="flex flex-col mb-4">
          <Input
            autoFocus
            value={data}
            type="text"
            className="mb-2 bg-zinc-800 text-white rounded-xl"
            placeholder="Collection name .."
            onChange={(e) => setData(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="mb-2">
            <label className="block text-xs text-zinc-400 mb-1">Color:</label>
            <div className="flex flex-wrap gap-1">
              {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {!isLoading ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={handleCreateCollection}
                  disabled={!data.trim()}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <CircularProgress size={20} color="inherit" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-zinc-400 uppercase mb-2">Collections</div>
      <div className="space-y-1 overflow-y-auto">
        {!isDataLoading ? (
          collection
            .filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => {
              const isActive = collectionid === item._id;
              const bgColor = item.color || "#3b82f6";
              const textColor = getTextColor(bgColor);
              return (
                <div
                  key={item._id}
                  onClick={() => updateUrl(item._id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors group ${
                    isActive ? "" : "hover:bg-zinc-800"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: hexToRGBA(bgColor, 0.2),
                          color: textColor,
                          border: `1px solid ${hexToRGBA(bgColor, 0.5)}`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2 truncate">
                    <FilePlus2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? textColor : "#a1a1aa" }}
                    />
                    <span className="text-sm truncate">{item.name}</span>
                  </div>
                  <Button
                    ref={dropdownTriggerRef}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleThreeDotClick(e, item)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
        ) : (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((s) => (
              <Skeleton
                key={s}
                height={36}
                sx={{ bgcolor: "grey.700", borderRadius: "12px" }}
              />
            ))}
          </div>
        )}
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-1 min-w-[160px]"
          style={{
            top: `${dropdownPosition.y}px`,
            left: `${dropdownPosition.x}px`,
          }}
        >
          <button
            className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-500/20 transition-colors duration-150"
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("edit");
            }}
          >
            <span>Edit</span>
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-150"
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick("delete");
            }}
          >
            <span>Delete</span>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <DeleteCollectionModal
        open={deleteCollectionModalOpen}
        onClose={() => setDeleteCollectionModalOpen(false)}
        collection={singleCollection}
        fetchCategories={fetchCategories}
      />
      <EditCollection
        open={editCollectionOpenby}
        onClose={() => setEditCollectionOpenby(false)}
        workspace={workspace}
        collection={singleCollection}
        fetchCategories={fetchCategories}
      />
    </aside>
  );
};

export default Collection1;