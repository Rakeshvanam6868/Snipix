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
  NotebookPen,
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

const collections = [
  "Psoriasis Healing Journey",
  "AI-Powered Tool",
  "5-Year Career Roadmap",
  "Job Hunt Tracker",
  "Internship Experience",
  "Standout",
  "Fork",
  "Website Tools",
  "Open Source",
  "Resume",
];

export default function Sidebar() {
  return (
    <aside className="w-[260px] h-screen flex flex-col bg-[#141415] text-white border-r border-zinc-800 px-4 py-4">
      {/* Workspace Name */}
      <div className="font-semibold text-lg mb-4">Snipix</div>

      {/* <nav className="space-y-2 mb-2 bg-blue-800  hover:bg-blue-900 rounded-xl">
        <SidebarItem icon={Plus} label="Add workspace" />
      </nav> */}

      {/* Add Workspace Modal Trigger */}
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
          />
          <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
            Create
          </Button>
        </DialogContent>
      </Dialog>

      {/* Private Pages (scrollable) */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Search"
          className="pl-9 pr-3 py-2 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400 border-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="text-xs text-zinc-400 uppercase mb-2">Workspace</div>
        <div className="space-y-0 mr-2">
          {collections.map((name, index) => (
            <div
              key={index}
              className="mb-1 hover:bg-zinc-800 rounded-xl text-white"
            >
              <SidebarItem label={name} />
            </div>
          ))}
        </div>
        {/* <Button
          variant="ghost"
          className="w-full justify-start px-2 mt-2 text-sm text-zinc-400 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button> */}
      </div>

      {/* Shared Section */}
      <div className="text-xs text-zinc-400 uppercase mb-2">Shared</div>
      <SidebarItem label="Start collaborating" />

      {/* Bottom Links */}
      <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4">
        <SidebarItem icon={Settings} label="Settings" />
        <SidebarItem icon={UserPlus} label="Invite members" />
        <SidebarItem icon={HelpCircle} label="Help" />
      </div>
    </aside>
  );
}

// 🔧 Reusable Item Component
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
