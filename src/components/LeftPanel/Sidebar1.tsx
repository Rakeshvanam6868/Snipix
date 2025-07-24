"use client";
import {
  Plus,
  Home, // Default fallback icon
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
  // --- Icons for Dynamic Assignment ---
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
  // --- Icons for Dropdown ---
  MoreVertical, // Three dots icon
  Pencil, // Edit icon
  Trash2, // Delete icon
  Share, // Share icon
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

// Define Workspace type
interface Workspace {
  _id: string;
  name: string;
  description: string;
  // Add icon property if your backend sends it, or we'll derive it
  // icon?: string;
}

// --- Icon Mapping Function ---
const getIconForWorkspace = (workspaceName: string) => {
  const name = workspaceName.toLowerCase();

  // Map keywords to icons
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

  // Default icon if no match found
  return Folder;
};

export default function Sidebar() {
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]); // Store all fetched workspaces
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([]); // For search results
  const [sharedWorkspace, setSharedWorkspace] = useState<any[]>([]);
  const [isSharedOpen, setIsSharedOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  ); // Use ID for selection
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
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
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
    setIsDataLoading(true); // Start loading before fetches
    axios
      .get(`${baseURL}/v1/api/workspace`, { headers })
      .then((response) => {
        setAllWorkspaces(response.data);
        setFilteredWorkspaces(response.data); // Initially show all
      })
      .catch((error) => {
        console.error("Error fetching owned workspaces:", error);
      })
      .finally(() => {
         // Check if shared workspaces have also loaded
         if (sharedWorkspace.length > 0 || !email) {
            setIsDataLoading(false);
         }
      });

    axios
      .get(`${baseURL}/v1/api/workspace?email=${email}`, { headers })
      .then((response) => {
        setSharedWorkspace(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shared workspaces:", error);
      })
      .finally(() => {
         // Check if owned workspaces have also loaded
         if (allWorkspaces.length > 0 || !token) {
             setIsDataLoading(false);
         }
      });
  };

  useEffect(() => {
    fetchWorkspace();
  }, [email]);

  // --- Search Effect ---
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
    localStorage.removeItem("token");
    signOut({ callbackUrl: "https://snipix.vercel.app/ " });
  };

  const updateUrl = (id: string) => {
    setSelectedWorkspaceId(id);
    localStorage.setItem("selectedWorkspaceId", id); // Store ID
    const query = { workspace: id };
    router.push(`?${new URLSearchParams(query).toString()}`);
  };

  const searchParams = useSearchParams();
  const w_id = searchParams.get("workspace") || "";
  useEffect(() => {
    // Set initial selected workspace from URL or localStorage
    const initialId = searchParams.get("workspace") || localStorage.getItem("selectedWorkspaceId");
    if (initialId) {
       setSelectedWorkspaceId(initialId);
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Run once on mount

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
      target instanceof HTMLElement && target.closest('[data-dropdown-trigger]')
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

  // --- Function to handle 3-dot button click ---
  const handleThreeDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
    workspace: any,
    check: string
  ) => {
     e.stopPropagation(); // Prevent triggering the main div click
     // Use button position for dropdown
     const rect = e.currentTarget.getBoundingClientRect();
     setDropdownPosition({ x: rect.left, y: rect.bottom + 5 });
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
          className={`absolute right-5 ${isSidebarOpen ? "top-5" : "top-14"}  w-6 h-6  text-white z-50`}
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
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
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
          <div className={`space-y-0 mr-2 ${isSidebarOpen ? "mt-0" : "mt-6"} `}>
            {!isDataLoading ? (
              filteredWorkspaces?.map((workspace: Workspace, i: number) => {
                 const IconComponent = getIconForWorkspace(workspace.name);
                 return (
                   <div
                     key={workspace._id}
                     onClick={() => updateUrl(workspace._id)}
                     // onContextMenu removed or kept for right-click if desired
                     className={`mb-1 hover:bg-zinc-800 rounded-xl cursor-pointer flex items-center justify-between ${
                       selectedWorkspaceId === workspace._id ? "bg-zinc-800 ring-1 ring-inset ring-blue-500" : ""
                     }`}
                   >
                     <SidebarItem
                       icon={IconComponent} // Use dynamic icon
                       label={workspace.name}
                       isSidebarOpen={isSidebarOpen}
                     />
                     {/* Three Dot Menu Button */}
                     {isSidebarOpen && (
                       <Button
                         variant="ghost"
                         size="icon"
                         data-dropdown-trigger // For identifying trigger
                         className="h-8 w-8 text-zinc-400 hover:text-white"
                         onClick={(e) => handleThreeDotClick(e, i, workspace, "owns")}
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

          {/* Shared Workspaces */}
          {/* <div
            className={`text-xs text-zinc-400 uppercase mb-2 mt-4 ${
              !isSidebarOpen && "sr-only"
            }`}
          >
            Shared With Me
          </div> */}
          {!isDataLoading ? (
            sharedWorkspace?.map((workspace: any, i: number) => {
               const IconComponent = getIconForWorkspace(workspace?.workspace_name);
               return (
                 <div
                   key={workspace.workspace_id}
                   onClick={() => updateUrl(workspace.workspace_id)}
                   // onContextMenu removed or kept for right-click if desired
                   className={`mb-1 hover:bg-zinc-800 rounded-xl cursor-pointer flex items-center justify-between ${
                     selectedWorkspaceId === workspace.workspace_id ? "bg-zinc-800 ring-1 ring-inset ring-blue-500" : ""
                   }`}
                 >
                   <SidebarItem
                     icon={IconComponent} // Use dynamic icon
                     label={workspace?.workspace_name}
                     isSidebarOpen={isSidebarOpen}
                   />
                   {/* Three Dot Menu Button for Shared (if needed) */}
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
        {/* Bottom Menu */}
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <SidebarItem
            icon={Settings}
            label="Settings"
            isSidebarOpen={isSidebarOpen}
            onClick={() => setIsSettingsModalOpen(true)} // Add click handler
          />
          <SidebarItem
            icon={UserPlus}
            label="Invite members"
            isSidebarOpen={isSidebarOpen}
            // Add click handler if needed
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
        selectedWorkspace={selectedWorkspaceId} // Pass ID
        setSelectedWorkspace={setSelectedWorkspaceId} // Pass setter for ID
        workspaces={allWorkspaces} // Pass all workspaces
        isSidebarOpen={isSidebarOpen}
      />
      {/* Dropdown Menu (context menu) */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-1 min-w-[160px]" // Darker background, border, shadow, min width
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
              <span>Remove</span> {/* Or "Leave" depending on action */}
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      <SettingsModal
        open={isSettingsModalOpen}
        setOpen={setIsSettingsModalOpen}
      />
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

// Updated SidebarItem Component
function SidebarItem({
  icon: Icon,
  label,
  isSidebarOpen,
  onClick, // Add onClick prop
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isSidebarOpen?: boolean;
  onClick?: () => void; // Add onClick type
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick} // Attach onClick handler
      className={`w-full justify-start px-2 text-sm text-zinc-200 hover:text-white overflow-hidden ${
        isSidebarOpen ? "gap-2" : "justify-center"
      }`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {isSidebarOpen && <span className="truncate">{label}</span>}
    </Button>
  );
}