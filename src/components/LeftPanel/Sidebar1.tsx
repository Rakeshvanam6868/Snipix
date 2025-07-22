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

// Define Workspace type
interface Workspace {
  _id: string;
  name: string;
  description: string;
}

export default function Sidebar() {
  const [workspace, setWorkspace] = useState<Workspace[]>([]);
  const [sharedWorkspace, setSharedWorkspace] = useState<any[]>([]);
  const [isSharedOpen, setIsSharedOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState<
    number | null
  >(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [singleWorkSpace, setSingleWorkspace] = useState<Workspace>({
    _id: "",
    name: "",
    description: "",
  });
  const [modalClose, setModalClose] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string>();
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  // Toggle sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const router = useRouter();
  const session = useSession();
  const email = session.data?.user?.email;

  // Load saved sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const fetchWorkspace = () => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`${baseURL}/v1/api/workspace`, { headers })
      .then((response) => {
        setWorkspace(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${baseURL}/v1/api/workspace?email=${email}`, { headers })
      .then((response) => {
        setSharedWorkspace(response.data);
        setIsDataLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsDataLoading(false);
      });
  };

  useEffect(() => {
    setIsDataLoading(true);
    fetchWorkspace();
  }, [email]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: "https://snipix.vercel.app/ " });
  };

  const updateUrl = (name: string) => {
    setSelectedWorkspace(name);
    localStorage.setItem("selectedWorkspace", name);
    const query = { workspace: name };
    router.push(`?${new URLSearchParams(query).toString()}`);
  };

  const searchParams = useSearchParams();
  const w_id = searchParams.get("workspace") || "";

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !isDropdownButton(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const isDropdownButton = (target: Node) => {
    return (
      target instanceof HTMLElement && dropdownRef.current?.contains(target)
    );
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
    workspace: any,
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
      setDeleteWorkspaceId(workspace.workspace_id);
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
      default:
        break;
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Main Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen flex flex-col bg-[#141415] text-white border-r border-zinc-800 px-4 py-4 transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-[260px]" : "w-16"
        }`}
      >
        {/* App Name / Logo */}
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

        {/* Toggle Button */}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-5 ${isSidebarOpen ?"top-5":"top-14" }  w-6 h-6  text-white z-50`}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? (
            <PanelRightOpen className="w-10 h-10" />
          ) : (
            <PanelLeftOpen className="w-10 h-10" />
          )}
        </Button>
        {/* Add Workspace Button (only when open) */}
        {isSidebarOpen && (
          <div className="mb-0">
            <Modal fetchWorkspace={fetchWorkspace} />
          </div>
        )}

        {/* Search Input */}
        {isSidebarOpen && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none"
            />
          </div>
        )}

        {/* Workspace List */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`text-xs text-zinc-400 uppercase mb-2 ${
              !isSidebarOpen && "sr-only"
            }`}
          >
            My Workspaces
          </div>
          <div className={`space-y-0 mr-2 ${isSidebarOpen ?"mt-0":"mt-6"} `}>
            {!isDataLoading ? (
              workspace?.map((workspace: Workspace, i: number) => (
                <div
                  key={workspace._id}
                  onClick={() => updateUrl(workspace._id)}
                  onContextMenu={(e) =>
                    handleRightClick(e, i, workspace, "owns")
                  }
                  className={`mb-1 hover:bg-zinc-800 rounded-xl cursor-pointer ${
                    selectedWorkspace === workspace.name ? "bg-zinc-800" : ""
                  }`}
                >
                  <SidebarItem
                    icon={Home}
                    label={workspace.name}
                    isSidebarOpen={isSidebarOpen}
                  />
                </div>
              ))
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

          {/* Shared Workspaces */}
          {/* <div
            className={`text-xs text-zinc-400 uppercase mb-2 ${
              !isSidebarOpen && "sr-only"
            }`}
          >
            Shared
          </div> */}
          {!isDataLoading ? (
            sharedWorkspace?.map((workspace: any, i: number) => (
              <div
                key={workspace.workspace_id}
                onClick={() => updateUrl(workspace.workspace_id)}
                onContextMenu={(e) =>
                  handleRightClick(e, i, workspace, "shared")
                }
                className={`mb-1 hover:bg-zinc-800 rounded-xl cursor-pointer ${
                  selectedWorkspace === workspace?.workspace_name
                    ? "bg-zinc-800"
                    : ""
                }`}
              >
                <SidebarItem
                  icon={Mail}
                  label={workspace?.workspace_name}
                  isSidebarOpen={isSidebarOpen}
                />
              </div>
            ))
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

        {/* Bottom Menu */}
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <SidebarItem
            icon={Settings}
            label="Settings"
            isSidebarOpen={isSidebarOpen}
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

      {/* Main Content */}
      <Collection1
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
        workspaces={workspace}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Dropdown Menu (context menu) */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-1"
          style={{ left: dropdownPosition.x, top: dropdownPosition.y }}
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700"
            onClick={() => handleOptionClick("edit")}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700"
            onClick={() => handleOptionClick("delete")}
          >
            Delete
          </button>
          {!isSharedOpen && (
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700"
              onClick={() => handleOptionClick("share")}
            >
              Share
            </button>
          )}
        </div>
      )}
    </>
  );
}

// Updated SidebarItem Component
function SidebarItem({
  icon: Icon,
  label,
  isSidebarOpen,
}: {
  icon?: any;
  label: string;
  isSidebarOpen?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start px-2 text-sm text-zinc-200 hover:text-white overflow-hidden ${
        isSidebarOpen ? "gap-2" : "justify-center"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {isSidebarOpen && <span>{label}</span>}
    </Button>
  );
}
