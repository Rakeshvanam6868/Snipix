// Modal.tsx (or WorkspaceCreateModal.tsx for better naming)
"use client";
import * as React from "react";
// import Box from "@mui/material/Box"; // Removed MUI Box
// import Typography from "@mui/material/Typography"; // Removed MUI Typography
// import SnippetModal from "@mui/material/Modal"; // Removed MUI Modal
// import { TextField } from "@mui/material"; // Removed MUI TextField
// import Image from "next/image"; // Image import seems unused in the provided code
// import Workspace from "../../../public/workspace.jpg"; // Image import seems unused
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseURL } from "@/config";
import { Plus } from "lucide-react";

export default function Modal({ fetchWorkspace }: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [data, setData] = React.useState({
    name: "",
    description: "",
  });

  // This function exists but isn't called in the original logic
  const handleSubmit = () => {
    setOpen(false);
    alert("Works space created!"); // Note: Typo in original ("Works space")
  };

  const handleCreateWorkspace = async () => {
    // Keeping logic exactly the same
    const body = {
      name: data.name,
      description: data.description,
    };
    const token = localStorage.getItem("token");
    // Add a check for token existence (good practice, doesn't change core logic flow)
    if (!token) {
        console.error("Authorization token not found.");
        alert("Authentication error. Please log in again.");
        handleClose(); // Use handleClose instead of setOpen(false) for consistency
        return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    await axios.post(`${baseURL}/v1/api/workspace`, body, { headers }).then(
      (response) => {
        console.log(response);
        alert("Workspace Created");
        window.location.reload();
      },
      (error) => {
        console.log(error);
        // Optionally, add user feedback on error
        // alert("Failed to create workspace. Please try again.");
      }
    );
    // handleClose(); was not present in original logic, so it's omitted to preserve exact behavior
    // If you want the modal to close on success/failure before reload, uncomment below:
    // handleClose();
  };

  return (
    // Replaced MUI Modal with shadcn/ui Dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-3 py-2 text-sm mb-4">
          <Plus className="mr-2 w-4 h-4" />
          Add Workspace
        </Button>
      </DialogTrigger>
      {/* Applied styling using Tailwind classes */}
      <DialogContent
        className="sm:max-w-[425px] rounded-3xl bg-black backdrop-blur-sm" // Added bg-white and backdrop-blur-sm
      >
        <DialogHeader>
          <DialogTitle className="text-black">Create Workspace</DialogTitle> {/* Explicit text color */}
          <DialogDescription className="text-gray-600"> {/* Explicit text color */}
            Add Name & Description to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Name Input Group */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-black"> {/* Explicit text color */}
              Name
            </Label>
            <Input
              id="name"
              placeholder="New Workspace"
              className="col-span-3"
              value={data.name} // Added value for controlled component (good practice)
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          {/* Description Input Group */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-black"> {/* Changed id and explicit text color */}
              Description
            </Label>
            <Input
              id="description" // Changed id from 'username' to 'description' for clarity
              placeholder="Project Snippets"
              className="col-span-3"
              value={data.description} // Added value for controlled component (good practice)
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          {/* Added type="button" for explicitness, though default is usually fine for DialogFooter buttons */}
          <Button type="button" onClick={handleCreateWorkspace}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}