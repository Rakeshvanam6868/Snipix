// ShareSnippet.tsx (or .jsx)
"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { baseURL } from "@/config";
import axios from "axios";

// Import shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Import Icons (make sure you have react-icons installed)
import { LuSendHorizonal, LuCopyPlus } from "react-icons/lu";
import { MdClose } from "react-icons/md"; // Use MdClose for a cleaner 'X' icon

interface ModalProps {
  onClose: () => void;
  snippet_id: string;
}

const ShareSnippet = ({ onClose, snippet_id }: ModalProps) => {
  const session = useSession();
  const [email, setEmail] = useState("");

  const sendEmail = async (e: React.FormEvent) => { // Type the event correctly
    e.preventDefault();
    if (!email) { // Basic validation
        toast.error("Please enter an email address.");
        return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          toast.error("Authentication token not found.");
          return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const body = {
        email,
        snippetid: snippet_id,
        user_name: session.data?.user?.name,
      };
      console.log("Share Snippet Body =>", body);
      await axios.put(`${baseURL}/v1/api/snippet/share`, body, { headers });
      toast.success("Email sent successfully!");
      setEmail(""); // Clear the input after successful send
    } catch (error: any) { // Type the error
      console.error("Error sending email:", error);
      // Provide more specific error messages if possible from your API
      if (error.response?.status === 404) {
         toast.error("Snippet not found.");
      } else if (error.response?.status === 400) {
         toast.error("Invalid email address.");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Link copied to clipboard");
    }).catch((err) => {
       console.error("Failed to copy link: ", err);
       toast.error("Failed to copy link.");
    });
  };

  return (
    // Use shadcn Dialog component
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}> {/* Handle close via backdrop click or X */}
      <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-700 text-white"> {/* Apply dark theme styles */}
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Share Snippet</DialogTitle>
          {/* Dialog Close Button - integrated into header */}
          {/* <DialogClose asChild>
            <Button
              variant="ghost" // Use ghost variant for a subtle close button
              size="icon"
              className="absolute right-4 top-4 h-6 w-6 p-0 text-white hover:bg-zinc-700 hover:text-white rounded-full" // Style the close button
            >
              <MdClose className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose> */}
        </DialogHeader>

        {/* Email Form Section */}
        <form onSubmit={sendEmail} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Recipient Email
            </Label>
            <div className="flex items-center">
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="flex-1 rounded-r-none border-r-0 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus-visible:ring-zinc-600"
                required
              />
              <Button
                type="submit"
                // Use shadcn Button variants for styling
                className="rounded-l-none bg-zinc-700 text-white hover:bg-zinc-600 transition-colors duration-300 border border-l-0 border-zinc-600"
                aria-label="Send Email"
              >
                <LuSendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-400">Or</span>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-center text-white font-medium">
            Do not want to send the email?
          </p>
          <p className="text-center text-white">
            Copy the URL
          </p>
          <Button
            onClick={copyLink}
            variant="outline" // Use outline variant for contrast
            size="icon" // Make it an icon button
            className="h-12 w-12 rounded-full border border-zinc-600 text-white hover:bg-zinc-800 hover:text-white" // Style the button
            aria-label="Copy Link"
          >
            <LuCopyPlus className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSnippet;