// EditModal.tsx (or .jsx)
import React, { useState, useEffect } from "react";
import { baseURL } from "@/config";
import axios from "axios";

// Import shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Import Label for better accessibility

// Define ShareModalProps interface (renamed to EditModalProps for clarity)
interface EditModalProps {
  open: boolean;
  onClose: () => void;
  workspace: {
    _id: string;
    name: string;
    description: string;
  };
}

const EditModal: React.FC<EditModalProps> = ({ open, onClose, workspace }) => {
  console.log("outside effect", workspace);

  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  useEffect(() => {
    // Populate fields when workspace data changes (e.g., modal opens)
    if (workspace && workspace._id) { // Check if workspace and ID exist
      setNewName(workspace.name || ""); // Use empty string as fallback
      setNewDescription(workspace.description || ""); // Use empty string as fallback
    }
  }, [workspace]); // Depend on the workspace object

  const handleEditWorkspace = async () => {
    // Basic validation can be added here if needed

    const body = {
      id: workspace._id,
      name: newName,
      description: newDescription,
    };
    const token = localStorage.getItem("token");
    
    // Add a check for token existence
    if (!token) {
        console.error("Authorization token not found.");
        alert("Authentication error. Please log in again.");
        onClose();
        return;
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put(`${baseURL}/v1/api/workspace/`, body, {
        headers,
      });
      console.log(response);
      alert("Workspace Updated");
      // Reload the page after successful update
      window.location.reload();
      // onClose(); // onClose is called after reload, so might not be necessary
    } catch (error) {
      console.log("Error updating workspace:", error);
      // Optionally, show an error message to the user
      alert("Failed to update workspace. Please try again."); // Added user feedback
    }
    // Note: onClose() was here previously, moved inside the try/catch success block
    // If you want it to close regardless of success/failure, put it in a finally block:
    // finally {
    //   onClose();
    // }
  };

  return (
    // Use shadcn Dialog component instead of MUI Modal
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-700 text-white"> {/* Light theme styling */}
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold  text-white">
            Edit Workspace
          </DialogTitle>
        </DialogHeader>

        {/* Dialog Content - Form Fields */}
        <div className="space-y-4 py-4"> {/* Use space-y for consistent vertical spacing */}
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="new-workspace-name" className="text-white"> {/* Use Label component */}
              New Workspace Name {/* Label text */}
            </Label>
            <Input
              id="new-workspace-name" // Add id for accessibility
              placeholder="Enter new workspace name" // Placeholder text
              value={newName} // Controlled component value
              onChange={(e) => setNewName(e.target.value)} // Update state on change
              className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500" // Style the input for light theme
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="new-workspace-description" className="text-white">
              New Description
            </Label>
            <Input
              id="new-workspace-description"
              placeholder="Enter new description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Dialog Footer - Action Button */}
        <div className="pt-2"> {/* Add padding top for spacing from inputs */}
          <Button
            // Use shadcn Button with primary color (default variant is usually primary)
            className="w-full" // Full width
            onClick={handleEditWorkspace} // Handle click
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;