"use client";
import {
  Plus,
  Home,
  Mail,
  Settings,
  UserPlus,
  HelpCircle,
  Search,
  FilePlus2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelRightOpen,
  PanelLeftOpen,
  Code,
  FileText,
  Database,
  Globe,
  Briefcase,
  BookOpen,
  ShoppingCart,
  Users,
  Calendar,
  CreditCard,
  Folder,
  MoreVertical,
  Pencil,
  Trash2,
  Share,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState, useRef } from "react";
import Collection1 from "./Collection1";
import { baseURL } from "@/config";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@mui/material";
import Modal from "./Modal";
import Image from "next/image";
import EditModal from "./EditModal";
import ShareModal from "./ShareModal";
import DeleteModal from "./DeleteModal";
import SettingsModal from "../Settings/SettingsModal";

interface Workspace {
  _id: string;
  name: string;
  description: string;
}

const getIconForWorkspace = (workspaceName: string) => {
  const name = workspaceName.toLowerCase();

  if (name.includes("code") || name.includes("dev")) return Code;
  if (name.includes("doc") || name.includes("text")) return FileText;
  if (name.includes("data") || name.includes("db")) return Database;
  if (name.includes("web") || name.includes("site")) return Globe;
  if (name.includes("project")) return Briefcase;
  if (name.includes("book") || name.includes("note")) return BookOpen;
  if (name.includes("shop") || name.includes("store")) return ShoppingCart;
  if (name.includes("team") || name.includes("group")) return Users;
  if (name.includes("calendar") || name.includes("event")) return Calendar;
  if (name.includes("finance") || name.includes("pay")) return CreditCard;

  return Folder;
};

export default function Sidebar() {
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([]);
  const [sharedWorkspace, setSharedWorkspace] = useState<any[]>([]);
  const [isSharedOpen, setIsSharedOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState<number | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [singleWorkSpace, setSingleWorkspace] = useState<Workspace>({
    _id: "",
    name: "",
    description: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string>();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const token = (session as any)?.backendJwt;
  const email = session?.user?.email;

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !isDropdownButton(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const fetchWorkspace = React.useCallback(async () => {
    if (!token) {
      console.warn("No backend JWT token available to fetch workspaces");
      return;
    }

    setIsDataLoading(true);

    try {
      const [ownedRes, sharedRes] = await Promise.all([
        axios.get(`${baseURL}/v1/api/workspace`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/v1/api/workspace?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Owned workspaces:", ownedRes.data);
      console.log("Shared workspaces:", sharedRes.data);

      setAllWorkspaces(ownedRes.data);
      setFilteredWorkspaces(ownedRes.data);
      setSharedWorkspace(sharedRes.data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setIsDataLoading(false);
    }
  }, [token, email]);

  useEffect(() => {
    if (status === "authenticated" && token) {
      fetchWorkspace();
    }
  }, [email, token, status, fetchWorkspace]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorkspaces(allWorkspaces);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allWorkspaces.filter((ws) =>
        ws.name.toLowerCase().includes(query)
      );
      setFilteredWorkspaces(filtered);
    }
  }, [searchQuery, allWorkspaces]);

  const handleLogOut = () => {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASEURL || "/" });
  };

  const updateUrl = (id: string) => {
    setSelectedWorkspaceId(id);
    localStorage.setItem("selectedWorkspaceId", id);
    const query = { workspace: id };
    router.push(`?${new URLSearchParams(query).toString()}`);
  };

  useEffect(() => {
    const initialId =
      searchParams.get("workspace") || localStorage.getItem("selectedWorkspaceId");
    if (initialId) {
      setSelectedWorkspaceId(initialId);
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside, searchParams]);

  const isDropdownButton = (target: Node) => {
    return target instanceof HTMLElement && target.closest("[data-dropdown-trigger]");
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    workspace: Workspace,
    check: string
  ) => {
    e.preventDefault();
    setDropdownPosition({ x: e.clientX, y: e.clientY });
    setActiveWorkspaceIndex(index);
    setIsDropdownOpen(true);
    setSingleWorkspace(workspace);
    setDeleteWorkspaceId(workspace._id);
    if (check === "shared") {
      setIsSharedOpen(true);
      setDeleteWorkspaceId(workspace._id);
    } else {
      setIsSharedOpen(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setIsDropdownOpen(false);
    switch (option) {
      case "edit":
        setEditModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      case "share":
        setShareModalOpen(true);
        break;
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleThreeDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
    workspace: Workspace,
    check: string
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({ x: rect.left, y: rect.bottom + 5 });
    setActiveWorkspaceIndex(index);
    setIsDropdownOpen(true);
    setSingleWorkspace(workspace);
    setDeleteWorkspaceId(workspace._id);
    if (check === "shared") {
      setIsSharedOpen(true);
      setDeleteWorkspaceId(workspace._id);
    } else {
      setIsSharedOpen(false);
    }
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-30 h-screen flex flex-col bg-[#141415] text-white border-r border-zinc-800 px-4 py-4 transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-[260px]" : "w-16"
        }`}
      >
        <div className="flex items-center mb-4">
          {isSidebarOpen ? (
            <div className="font-semibold text-lg">
              <Image
                src="/fullLogo.png"
                alt="Snipix Logo"
                width={100}
                height={100}
                className="inline-block mr-2"
              />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Image
                src="/logo.png"
                alt="Snipix Logo"
                width={100}
                height={100}
                className="inline-block mr-2"
              />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-5 ${
            isSidebarOpen ? "top-5" : "top-14"
          }  w-6 h-6  text-white z-50`}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? (
            <PanelRightOpen className="w-10 h-10" />
          ) : (
            <PanelLeftOpen className="w-10 h-10" />
          )}
        </Button>
        {isSidebarOpen && (
          <div className="mb-0">
            <Modal fetchWorkspace={fetchWorkspace} />
          </div>
        )}
        {isSidebarOpen && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`text-xs text-zinc-400 uppercase mb-2 ${
              !isSidebarOpen && "sr-only"
            }`}
          >
            My Workspaces
          </div>
          <div className={`space-y-0 mr-2 ${isSidebarOpen ? "mt-0" : "mt-6"} `}>
            {!isDataLoading ? (
              filteredWorkspaces?.map((workspace, i) => {
                const IconComponent = getIconForWorkspace(workspace.name);
                return (
                  <div
                    key={workspace._id}
                    onClick={() => updateUrl(workspace._id)}
                    className={`mb-1 hover:bg-zinc-800 rounded-xl cursor-pointer flex items-center justify-between ${
                      selectedWorkspaceId === workspace._id
                        ? "bg-zinc-800 ring-1 ring-inset ring-blue-500"
                        : ""
                    }`}
                  >
                    <SidebarItem
                      icon={IconComponent}
                      label={workspace.name}
                      isSidebarOpen={isSidebarOpen}
                    />
                    {isSidebarOpen && (
                      <Button
                        variant="ghost"
                        size="icon"
                        data-dropdown-trigger
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                        onClick={(e) =>
                          handleThreeDotClick(e, i, workspace, "owns")
                        }
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Skeleton
                  sx={{ bgcolor: "grey.700", borderRadius: "10px" }}
                  variant="rectangular"
                  width="100%"
                  height={30}
                />
                <Skeleton
                  sx={{ bgcolor: "grey.700", borderRadius: "10px" }}
                  variant="rectangular"
                  width="100%"
                  height={30}
                />
              </div>
            )}
          </div>
          {!isDataLoading ? (
            sharedWorkspace?.map((workspace, i) => {
              const IconComponent = getIconForWorkspace(workspace?.workspace_name);
              return (
                <div
                  key={workspace.workspace_id}
                  onClick={() => updateUrl(workspace.workspace_id)}
                  className={`mb-1 hover:bg-zinc-800 rounded-xl cursor-pointer flex items-center justify-between ${
                    selectedWorkspaceId === workspace.workspace_id
                      ? "bg-zinc-800 ring-1 ring-inset ring-blue-500"
                      : ""
                  }`}
                >
                  <SidebarItem
                    icon={IconComponent}
                    label={workspace?.workspace_name}
                    isSidebarOpen={isSidebarOpen}
                  />
                  {isSidebarOpen && (
                    <Button
                      variant="ghost"
                      size="icon"
                      data-dropdown-trigger
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                      onClick={(e) => handleThreeDotClick(e, i, workspace, "shared")}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton
                sx={{ bgcolor: "grey.700", borderRadius: "10px" }}
                variant="rectangular"
                width="100%"
                height={30}
              />
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <SidebarItem
            icon={Settings}
            label="Settings"
            isSidebarOpen={isSidebarOpen}
            onClick={() => setIsSettingsModalOpen(true)}
          />
          <SidebarItem
            icon={UserPlus}
            label="Invite members"
            isSidebarOpen={isSidebarOpen}
          />
          <span onClick={handleLogOut}>
            <SidebarItem
              icon={LogOut}
              label="Logout"
              isSidebarOpen={isSidebarOpen}
            />
          </span>
        </div>
      </aside>
      <Collection1
        selectedWorkspace={selectedWorkspaceId}
        setSelectedWorkspace={setSelectedWorkspaceId}
        workspaces={allWorkspaces}
        isSidebarOpen={isSidebarOpen}
      />
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-1 min-w-[160px]"
          style={{ left: dropdownPosition.x, top: dropdownPosition.y }}
        >
          {!isSharedOpen && (
            <>
              <button
                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-500/20 transition-colors duration-150"
                onClick={() => handleOptionClick("edit")}
              >
                <span>Edit</span>
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-150"
                onClick={() => handleOptionClick("delete")}
              >
                <span>Delete</span>
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/20 transition-colors duration-150"
                onClick={() => handleOptionClick("share")}
              >
                <span>Share</span>
                <Share className="h-4 w-4" />
              </button>
            </>
          )}
          {isSharedOpen && (
            <button
              className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-150"
              onClick={() => handleOptionClick("delete")}
            >
              <span>Remove</span>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      <SettingsModal open={isSettingsModalOpen} setOpen={setIsSettingsModalOpen} />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        workspace_id={deleteWorkspaceId || ""}
        type={isSharedOpen ? "shared" : ""}
        email={isSharedOpen ? email : ""}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        workspace={singleWorkSpace}
      />
      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        workspace={singleWorkSpace}
      />
    </>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  isSidebarOpen,
  onClick,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isSidebarOpen?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start px-2 text-sm text-zinc-200 hover:text-white overflow-hidden ${
        isSidebarOpen ? "gap-2" : "justify-center"
      }`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {isSidebarOpen && <span className="truncate">{label}</span>}
    </Button>
  );
}
