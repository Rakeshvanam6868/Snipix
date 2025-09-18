// DeleteModal.tsx (or .jsx)
import React from "react";
import { baseURL } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
// Import shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  workspace_id: string;
  type: string;
  email: any; // Consider typing this more specifically if possible, e.g., string or string[]
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  workspace_id,
  type,
  email,
}) => {
  const { data: session, status } = useSession(); // Use hook at top level

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default if triggered by a form submit, though it's a button click here
    
    // Add a check for workspace_id
    if (!workspace_id) {
        console.error("Workspace ID is missing.");
        alert("Error: Workspace ID is missing.");
        return;
    }

    

    try {
      const token = (session as any).backendJwt;

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

      if (type === "shared") {
        // Validate email for shared workspace deletion
        if (!email) {
            console.error("Email is required for shared workspace deletion.");
            alert("Error: Recipient email is missing.");
            return;
        }
        const body = {
          workspace_id,
          email, // Assuming email is a string based on usage
        };
        console.log("Deleting shared workspace with body:", body); // Log the request body
        
        await axios.delete(`${baseURL}/v1/api/workspace/shared`, {
          data: body, // Axios delete with body requires 'data' property
          headers,
        });
        
        alert("Shared Workspace Removed!");
        // Reload the page after successful deletion
        window.location.reload();
        
      } else {
        // Standard workspace deletion
        console.log("Deleting workspace with ID:", workspace_id); // Log the workspace ID
        
        await axios.delete(`${baseURL}/v1/api/workspace?w_id=${workspace_id}`, {
          headers,
        });
        
        alert("Workspace Removed!");
        // Reload the page after successful deletion
        window.location.reload();
      }
    } catch (error: any) { // Type the error
      console.error("Error deleting workspace:", error);
      // Provide more specific error messages if possible from your API
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("API Error Response:", error.response.data);
        console.error("API Error Status:", error.response.status);
        // Check status code for specific messages
        if (error.response.status === 403) {
            alert("Error: You do not have permission to delete this workspace.");
        } else if (error.response.status === 404) {
            alert("Error: Workspace not found.");
        } else {
             alert(`Error occurred while removing the ${type === 'shared' ? 'shared workspace' : 'workspace'}. Status: ${error.response.status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API No Response:", error.request);
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("General Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
    // Note: onClose is not called here because window.location.reload() will close the modal anyway.
    // If you remove reload, call onClose() in the finally block.
  };

  return (
    // Use shadcn Dialog component
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-700 text-white">
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        {/* Dialog Content */}
        <div className="py-4">
          <p className="text-white">
            Are you sure you want to delete this {type === "shared" ? "shared " : ""}workspace? This action cannot be undone.
          </p>
        </div>

        {/* Dialog Footer with Actions */}
        <DialogFooter className="gap-2 sm:space-x-0"> {/* Responsive gap */}
          {/* DialogClose automatically handles closing the dialog */}
          <DialogClose asChild>
            <Button
              type="button" // Explicitly set type
              variant="outline" // Use outline variant for Cancel
              className="border-zinc-600 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button" // Explicitly set type
            onClick={handleDelete}
            variant="destructive" // Use destructive variant for Delete
            className="bg-red-600 hover:bg-red-700" // Specific red colors
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;