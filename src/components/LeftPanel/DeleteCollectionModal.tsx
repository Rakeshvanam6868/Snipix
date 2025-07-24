// DeleteCollectionModal.tsx (or .jsx)
import React from "react";
import { baseURL } from "@/config";
import axios from "axios";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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

interface collectionItem {
  name: string;
  description: string;
  _id: string;
}

interface DeleteCollectionModalProps {
  open: boolean;
  onClose: () => void;
  collection: collectionItem;
  fetchCategories: () => void;
}

const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  open,
  onClose,
  collection,
  fetchCategories,
}) => {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace") || "";
  const collection_id = searchParams.get("collection") || "";
  const snippet_id = searchParams.get("snippet") || ""; // Note: snippet_id is retrieved but not used in the original logic
  const router = useRouter();
  const pathName = usePathname();

  const handleDelete = async (e: React.FormEvent) => { // Type the event correctly
    e.preventDefault(); // Prevent default if this is triggered by a form submit, though it's a button click here
    try {
      const body = {
        workspace_id: workspace,
        category_id: collection._id,
      };
      console.log("Delete Collection Body =>", body);

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

      const response = await axios.delete(`${baseURL}/v1/api/category/`, {
        data: body, // Axios delete with body requires 'data' property
        headers,
      });

      console.log("Collection deleted successfully", response.data);

      // Check if the deleted collection was the one currently selected in the URL
      if (collection._id === collection_id) {
        console.log("Deleted collection was the active one. Updating URL...");
        // Create a new URLSearchParams instance based on current search params
        const nextSearchParams = new URLSearchParams(searchParams.toString());
        // Remove 'snippet' and 'collection' parameters from the URL
        nextSearchParams.delete("snippet");
        nextSearchParams.delete("collection");
        // Push the new URL state without the snippet and collection params
        router.push(`${pathName}?${nextSearchParams.toString()}`);
      }

      alert("Collection Removed!");
      onClose();
      fetchCategories(); // Refresh the list of categories
    } catch (error: any) { // Type the error
      console.error("Error deleting collection:", error);
      // Provide more specific error messages if possible from your API
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("API Error Response:", error.response.data);
        console.error("API Error Status:", error.response.status);
        alert(`Error: ${error.response.data?.message || "Failed to delete collection. Please try again."}`);
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
            Are you sure you want to delete the collection {collection.name} ? This action cannot be undone.
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

export default DeleteCollectionModal;