import React, { useState, useEffect, useRef, Suspense } from "react";
import { FilePlus2, Plus, Search, X } from "lucide-react";
import { FaFolderOpen } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import { baseURL } from "@/config";
import DeleteCollectionModal from "./DeleteCollectionModal";
import EditCollection from "./EditCollection";

const Collection = ({
  selectedWorkspace,
  setSelectedWorkspace,
  workspaces,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collection, setCollection] = useState<any[]>([]);
  const [data, setData] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState<
    number | null
  >(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const workspace = searchParams.get("workspace") || "";
  const collectionid = searchParams.get("collection") || "";
  const shared = searchParams.get("shared") || "";
  const [deleteCollectionModalOpen, setDeleteCollectionModalOpen] =
    useState(false);
  const [editCollectionOpenby, setEditCollectionOpenby] = useState(false);
  const [singleCollection, setSingleCollection] = useState({
    _id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    collection: any
  ) => {
    e.preventDefault();
    setDropdownPosition({ x: e.clientX, y: e.clientY });
    setActiveCollectionIndex(index);
    setIsDropdownOpen(true);
    setSingleCollection(collection);
  };

  const handleOptionClick = (option: string) => {
    switch (option) {
      case "edit":
        setEditCollectionOpenby(true);
        break;
      case "delete":
        setDeleteCollectionModalOpen(true);
        break;
      default:
        break;
    }
  };

  const fetchCategories = () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(`${baseURL}/v1/api/category/${workspace}`, { headers })
      .then((res) => {
        setCollection(res.data);
        setIsDataLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (workspace) {
      setIsDataLoading(true);
      fetchCategories();
    }
  }, [workspace]);

  const handleCreateCollection = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const body = {
      id: workspace,
      name: data,
      description: "Snipix Project Snippets",
    };
    axios
      .post(`${baseURL}/v1/api/category`, body, { headers })
      .then(() => {
        fetchCategories();
        setShowInput(false);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreateCollection();
  };

  const updateUrl = (id: string) => {
    const query = shared
      ? { shared, workspace, collection: id }
      : { workspace, collection: id };
    router.push(`?${new URLSearchParams(query).toString()}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <aside
        className={`fixed left-0 top-0 z-10 w-[260px] h-screen bg-[#141415] text-white border-1 border-zinc-100 px-4 py-4 transition-transform duration-300 ease-in-out transform ${
          selectedWorkspace ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">
            {" "}
            {workspaces?.find((ws) => ws._id === selectedWorkspace)?.name ||
              "Workspace"}
          </div>
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => setSelectedWorkspace(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          <Button
            className="w-full justify-start bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-3 py-2 text-sm mb-4"
            onClick={() => {
              setShowInput(true);
              setData(""); // optional: clear previous input
            }}
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Collection
          </Button>
        </div>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Search collections"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none"
          />
        </div>

        {showInput && (
          <div className="flex items-center mb-2">
            <Input
              value={data}
              type="text"
              className="mr-2 flex-1 bg-zinc-800 text-white rounded-xl"
              placeholder="Collection name .."
              onChange={(e) => setData(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            {!isLoading ? (
              <>
                <Button
                  variant="outline"
                  className="bg-gray-600 h-8 px-3 text-xs mr-1"
                  onClick={handleCreateCollection}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-white h-8 px-2"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <CircularProgress size={20} color="success" />
            )}
          </div>
        )}

        <div className="text-xs text-zinc-400 uppercase mb-2">Collections</div>
        <div className="space-y-2 overflow-y-auto">
          {!isDataLoading ? (
            collection
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, index) => (
                <div
                  key={item._id}
                  onContextMenu={(e) => handleRightClick(e, index, item)}
                  onClick={() => updateUrl(item._id)}
                  className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer hover:bg-zinc-800 transition-colors ${
                    collectionid === item._id
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FilePlus2 className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((s) => (
                <Skeleton
                  key={s}
                  height={30}
                  sx={{ bgcolor: "grey.700", borderRadius: "8px" }}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            padding: "10px",
            top: dropdownPosition.y,
            left: dropdownPosition.x,
            backgroundColor: "#131211c4",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
          }}
        >
          <ul className="w-20">
            <li
              className="cursor-pointer flex justify-between hover:bg-slate-300 hover:text-black p-1 rounded"
              onClick={() => handleOptionClick("edit")}
            >
              Edit <MdEdit className="mt-1" />
            </li>
            <li
              className="cursor-pointer flex justify-between hover:bg-slate-300 hover:text-black p-1 rounded"
              onClick={() => handleOptionClick("delete")}
            >
              Delete <MdDelete className="mt-1" />
            </li>
          </ul>
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
    </Suspense>
  );
};

export default Collection;
