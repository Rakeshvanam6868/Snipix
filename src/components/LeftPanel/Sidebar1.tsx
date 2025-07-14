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
import { useState } from "react";

// Mock data
const workspaces = [
  {
    name: "Psoriasis Healing Journey",
    collections: [
      { title: "Treatment Plan", date: "Jul 10" },
      { title: "Symptom Tracker", date: "Jun 25" },
      { title: "Doctor Appointments", date: "May 15" },
    ],
  },
  {
    name: "AI-Powered Tool",
    collections: [
      { title: "Project Overview", date: "Jul 5" },
      { title: "Code Repository", date: "Jun 20" },
      { title: "Deployment Notes", date: "May 10" },
    ],
  },
  {
    name: "Resume",
    collections: [
      { title: "Job Hunt Tracker", date: "Jul 1" },
      { title: "Mainly For Development Passwords", date: "Jun 30" },
      { title: "Projects Setup", date: "Jun 22" },
      { title: "Value Hunter", date: "Jun 14" },
      { title: "3 Projects", date: "Jun 11" },
      { title: "Portfolio", date: "May 26" },
      { title: "Important daily", date: "May 19" },
      { title: "Job Application Companies", date: "Apr 28" },
      { title: "SSC CGL", date: "Apr 28" },
    ],
  },
];

export default function Sidebar() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Main Sidebar */}
      <aside className="fixed left-0 top-0 z-30 w-[260px] h-screen flex flex-col bg-[#141415] text-white border-r border-zinc-800 px-4 py-4">
        {/* App Name */}
        <div className="font-semibold text-lg mb-4">Snipix</div>

        {/* Add Workspace Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full justify-start bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-3 py-2 text-sm mb-4">
              <Plus className="mr-2 w-4 h-4" />
              Add Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#141415] border border-zinc-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Workspace</DialogTitle>
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
        </Dialog>

        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none"
          />
        </div>

        {/* Workspace List */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="text-xs text-zinc-400 uppercase mb-2">Workspace</div>
          <div className="space-y-0 mr-2">
            {workspaces.map((workspace, index) => (
              <div
                key={index}
                className={`mb-1 hover:bg-zinc-800 rounded-xl text-white cursor-pointer ${
                  selectedWorkspace === workspace.name ? "bg-zinc-800" : ""
                }`}
                onClick={() =>
                  setSelectedWorkspace((prev) =>
                    prev === workspace.name ? null : workspace.name
                  )
                }
              >
                <SidebarItem label={workspace.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Shared Section */}
        <div className="text-xs text-zinc-400 uppercase mb-2">Shared</div>
        <SidebarItem label="Start collaborating" />

        {/* Bottom Menu */}
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={UserPlus} label="Invite members" />
          <SidebarItem icon={HelpCircle} label="Help" />
        </div>
      </aside>

      {/* Collections Slide-in Panel */}
      <aside
        className={`fixed left-0 top-0 z-10 w-[260px] h-screen bg-[#141415] text-white border-1 border-zinc-100 px-4 py-4 transition-transform duration-300 ease-in-out transform ${
          selectedWorkspace ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">{selectedWorkspace}</div>
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => setSelectedWorkspace(null)}
          >
            Close
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

        <div className="flex-1 overflow-y-auto">
          <div className="text-xs text-zinc-400 uppercase mb-2">Collections</div>
          <div className="space-y-2">
            {(workspaces.find((ws) => ws.name === selectedWorkspace)?.collections || [])
              .filter((collection) =>
                collection.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((collection, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FilePlus2 className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm">{collection.title}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{collection.date}</span>
                </div>
              ))}
          </div>
        </div>
      </aside>
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