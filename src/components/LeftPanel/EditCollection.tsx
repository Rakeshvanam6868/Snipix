// EditCollection.tsx (or .jsx)
import React, { useState, useEffect } from "react";
import { baseURL } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
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

interface EditCollectionProps {
  open: boolean;
  onClose: () => void;
  workspace: string;
  collection: {
    _id: string;
    name: string;
    description: string;
  };
  fetchCategories: () => void;
}

const EditCollection: React.FC<EditCollectionProps> = ({
  open,
  onClose,
  workspace,
  collection,
  fetchCategories,
}) => {
  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
const { data: session, status } = useSession();
  useEffect(() => {
    // Populate fields when collection data changes (e.g., modal opens)
    if (collection._id) { // Check if collection ID exists
      setNewName(collection.name || ""); // Use empty string as fallback
      setNewDescription(collection.description || ""); // Use empty string as fallback
    }
  }, [collection]); // Depend on the collection object

  const handleEditCollection = async () => {
    // Basic validation can be added here if needed

    const body = {
      collectionid: collection._id,
      name: newName,
      description: newDescription,
    };
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

    try {
      const response = await axios.put(
        `${baseURL}/v1/api/category/${workspace}/${collection._id}`,
        body,
        {
          headers,
        }
      );
      console.log(response);
      alert("Collection Updated");
      fetchCategories();
      onClose(); // Move onClose inside the success block
    } catch (error) {
      console.log("Error updating collection:", error);
      // Optionally, show an error message to the user
      alert("Failed to update collection. Please try again."); // Added user feedback
    }
    // Note: onClose() was here previously, moved inside the try/catch success block above
    // If you want it to close regardless of success/failure, put it in a finally block:
    // finally {
    //   onClose();
    // }
  };

  return (
    // Use shadcn Dialog component instead of MUI Modal
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-700 text-white">
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Edit Collection
          </DialogTitle>
        </DialogHeader>

        {/* Dialog Content - Form Fields */}
        <div className="space-y-4 py-4"> {/* Use space-y for consistent vertical spacing */}
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="new-collection-name" className="text-white"> {/* Use Label component */}
              New Name {/* Label text */}
            </Label>
            <Input
              id="new-collection-name" // Add id for accessibility
              placeholder={collection.name || "Enter new name"} // Use collection.name or a default placeholder
              value={newName} // Controlled component value
              onChange={(e) => setNewName(e.target.value)} // Update state on change
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400" // Style the input
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="new-collection-description" className="text-white">
              New Description
            </Label>
            <Input
              id="new-collection-description"
              placeholder={collection.description || "Enter new description"}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Dialog Footer - Action Button */}
        <div className="pt-2"> {/* Add padding top for spacing from inputs */}
          <Button
            // Use shadcn Button variants and custom classes for styling
            className="w-full bg-orange-500 hover:bg-orange-600 text-white" // Full width, orange colors
            onClick={handleEditCollection} // Handle click
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCollection;