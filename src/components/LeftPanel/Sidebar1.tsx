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
import React, { useEffect, useState, useRef, Suspense } from "react";
import Collection1 from "./Collection1";
import { baseURL } from "@/config";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@mui/material";
import Modal from "./Modal";
import Collection from "./Collection";

// Mock dat

export default function Sidebar() {
  const [workspace, setWorkspace] = useState<any>([]);
  const [sharedWorkspace, setSharedWorkspace] = useState<any>([]);
  const [isSharedOpen, setIsSharedOpen] = useState(false);

  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );

  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState<
    number | null
  >(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    console.log("in here");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
  // const [singleWorkSpace, setSingleWorkspace] = useState<Workspace>();
  const router = useRouter();
  const session = useSession();
  const email = session.data?.user?.email;

  const fetchWorkspace = () => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`${baseURL}/v1/api/workspace`, { headers })
      .then((response) => {
        setWorkspace(response.data);
        // setIsDataLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setIsDataLoading(false);
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
  console.log(email);
  useEffect(() => {
    setIsDataLoading(true);
    const fetchWorkspace = async () => {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios
        .get(`${baseURL}/v1/api/workspace`, { headers })
        .then((response) => {
          setWorkspace(response.data);
          console.log("My wworkspaces", response.data);
          // setIsDataLoading(false);
        })
        .catch((error) => {
          console.log(error);
          // setIsDataLoading(false);
        });
      await axios
        .get(`${baseURL}/v1/api/workspace?email=${email}`, { headers })
        .then((response) => {
          setSharedWorkspace(response.data);
          console.log("shared workspaces =>", response.data);
          setIsDataLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsDataLoading(false);
        });
    };

    fetchWorkspace();
  }, [email]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: "https://snipix.vercel.app/" });
  };

  const updateUrl = (name: string) => {
    setSelectedWorkspace(name);
    localStorage.setItem("selectedWorkspace", name);

    const query = { workspace: name };
    router.push(`?${new URLSearchParams(query).toString()}`);
  };

  interface Workspace {
    _id: string;
    name: string;
    description: string;
  }

  const searchParams = useSearchParams();
  const w_id = searchParams.get("workspace") || "";

  useEffect(() => {
    // Add event listener for clicks on the document
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Cleanup: Remove event listener when component unmounts
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
      target instanceof Node &&
      dropdownRef.current &&
      dropdownRef.current.contains(target)
    );
  };
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string>();

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
    } else setIsSharedOpen(false);
  };
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const handleOptionClick = (option: string) => {
    console.log("Option clicked:", option);
    setIsDropdownOpen(false);

    switch (option) {
      case "edit":
        console.log("Edit clicked");
        setEditModalOpen(true);
        break;
      case "delete":
        console.log("Delete clicked");
        setDeleteModalOpen(true);
        break;

      case "share":
        console.log("Share clicked");
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
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      {/* Main Sidebar */}
      <aside className="fixed left-0 top-0 z-30 w-[260px] h-screen flex flex-col bg-[#141415] text-white border-r border-zinc-800 px-4 py-4">
        {/* App Name */}
        <div className="font-semibold text-lg mb-4">Snipix</div>

        {/* Add Workspace Button */}
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full justify-start bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-3 py-2 text-sm mb-4">
              <Plus className="mr-2 w-4 h-4" />
              Add Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#141415] border border-zinc-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Create New Workspace
              </DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter workspace name"
              className="mt-2 bg-zinc-800 text-white border-none"
              onChange={(e) => console.log(e.target.value)}
            />
            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
              Create
            </Button>
          </DialogContent>
        </Dialog> */}
        <div className="">
          <Modal fetchWorkspace={fetchWorkspace} />
        </div>

        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Search"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery:(()=>e.target.value)}
            className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none"
          />
        </div>

        {/* Workspace List */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="text-xs text-zinc-400 uppercase mb-2">Workspace</div>
          <div className="space-y-0 mr-2">
            {!isDataLoading ? (
              workspace?.map((workspace: Workspace, i: number) => {
                return (
                  <div
                    onClick={() => updateUrl(workspace._id)}
                    onContextMenu={(e) =>
                      handleRightClick(e, i, workspace, "owns")
                    }
                    key={workspace._id}
                    className={`mb-1 hover:bg-zinc-800 rounded-xl text-white cursor-pointer ${
                      selectedWorkspace === workspace.name ? "bg-zinc-800" : ""
                    }`}
                  >
                    <SidebarItem label={workspace.name} />
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
                <Skeleton
                  sx={{ bgcolor: "grey.700", borderRadius: "10px" }}
                  variant="rectangular"
                  width="100%"
                  height={30}
                />
              </div>
            )}
          </div>
          <div className="space-y-0 mr-2">
            {!isDataLoading ? (
              sharedWorkspace?.map((workspace: any, i: number) => {
                 return (
                  <div
                    onClick={() => updateUrl(workspace.workspace_id)}
                    onContextMenu={(e) =>
                      handleRightClick(e, i, workspace, "shared")
                    }
                    key={workspace.workspace_id}
                    className={`mb-1 hover:bg-zinc-800 rounded-xl text-white cursor-pointer ${
                      selectedWorkspace === workspace?.workspace_name ? "bg-zinc-800" : ""
                    }`}
                  >
                    <SidebarItem label={workspace?.workspace_name} />
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
                <Skeleton
                  sx={{ bgcolor: "grey.700", borderRadius: "10px" }}
                  variant="rectangular"
                  width="100%"
                  height={30}
                />
              </div>
            )}
          </div>
        </div>

        {/* Shared Section */}
        <div className="text-xs text-zinc-400 uppercase mb-2">Shared</div>
        <SidebarItem label="Start collaborating" />

        {/* Bottom Menu */}
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={UserPlus} label="Invite members" />
          {/* Todo partial Logout */}
          <span onClick={() => handleLogOut()}>
            {" "}
            <SidebarItem icon={LogOut} label="Logout" />
          </span>
        </div>
      </aside>

      <Collection1
         selectedWorkspace={selectedWorkspace}
         setSelectedWorkspace={setSelectedWorkspace}
         workspaces={workspace}
      />
    </>
  );
}

function SidebarItem({ icon: Icon, label }: { icon?: any; label: string }) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-2 text-sm text-zinc-200 hover:text-white"
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </Button>
  );
}
