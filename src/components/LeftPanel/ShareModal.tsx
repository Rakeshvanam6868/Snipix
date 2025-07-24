// ShareModal.tsx (or .jsx)
import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config";

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

// Define ShareModalProps interface (keeping the original name)
interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  workspace: {
    _id: string;
    name: string;
    description: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  workspace,
}) => {
  const [email, setEmail] = useState<string>(); // Consider initializing with an empty string: useState<string>("");

  const handleShareWorkspace = async () => {
    // Basic validation can be added here if needed, e.g., check if email is provided and valid

    const body = {
      email: email,
      workspace_id: `${workspace._id}`, // Ensure workspace._id exists
      sharedData: "workspace",
    };
    const token = localStorage.getItem("token");

    // Add a check for token existence (good practice)
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
      const response = await axios.post(`${baseURL}/v1/api/share/workspace`, body, { headers });
      console.log(response);
      alert("Workspace Shared Successfully");
      // Optionally, clear the email input after successful share:
      // setEmail("");
    } catch (error) {
      console.log("Error sharing workspace:", error);
      // Optionally, show an error message to the user
      alert("Failed to share workspace. Please try again."); // Added user feedback
    } finally {
      onClose(); // Move onClose to finally block to ensure it's called
    }
  };

  return (
    // Use shadcn Dialog component instead of MUI Modal
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] text-white bg-black"> {/* Light theme styling */}
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Share Access
          </DialogTitle>
        </DialogHeader>

        {/* Dialog Content - Form Fields */}
        <div className="space-y-4 py-4"> {/* Use space-y for consistent vertical spacing */}
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="share-email" className="text-white"> {/* Use Label component */}
              Enter Email {/* Label text */}
            </Label>
            <Input
              id="share-email" // Add id for accessibility
              type="email" // Specify email type for better mobile UX and validation
              placeholder="user@example.com" // Placeholder text
              value={email || ""} // Controlled component value, handle undefined
              onChange={(e) => setEmail(e.target.value)} // Update state on change
              className="bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500" // Style the input for light theme
            />
          </div>
        </div>

        {/* Dialog Footer - Action Button */}
        <div className="pt-2"> {/* Add padding top for spacing from inputs */}
          <Button
            // Use shadcn Button with primary color (default variant is usually primary)
            className="w-full" // Full width
            onClick={handleShareWorkspace} // Handle click
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;