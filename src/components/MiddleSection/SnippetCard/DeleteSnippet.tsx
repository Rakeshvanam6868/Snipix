// DeleteSnippet.tsx (or .jsx)
import React from "react";
import { baseURL } from "@/config";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

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

interface DeleteSnippetProps {
    open: boolean;
    onClose: () => void;
    snippet_id: string;
}

const DeleteSnippet: React.FC<DeleteSnippetProps> = ({ open, onClose, snippet_id }) => {
    const searchParams = useSearchParams();
    const router = useRouter(); // Standard convention is lowercase 'r'

    async function deleteSnippet(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        const token = localStorage.getItem("token");
        
        // Add a check for token existence
        if (!token) {
            console.error("Authorization token not found.");
            onClose();
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const _id = snippet_id;
            const snippet = searchParams.get("snippet") || "";
            if (snippet === _id) {
                const workspace = searchParams.get("workspace") || "";
                const collection = searchParams.get("collection") || "";
                // Build query object, only including non-empty values if desired
                const query: Record<string, string> = {
                    workspace,
                    collection,
                    // Consider if you want to clear the snippet param or just omit it
                    // If omitted, the current snippet might persist in the URL
                };

                // Filter out empty values if you don't want them in the URL
                const filteredQuery = Object.fromEntries(
                    Object.entries(query).filter(([_, v]) => v)
                );

                router.push(`?${new URLSearchParams(filteredQuery).toString()}`);
            }
            console.log("Deleting snippet with id:", _id);
            const response = await axios.delete(
                `${baseURL}/v1/api/snippet?s_id=${_id}`,
                {
                    headers,
                }
            );
            if (response.status === 200) {
                console.log("Snippet deleted successfully");
                // Optionally, show a success toast notification here
            } else {
                console.log("Failed to delete snippet");
                // Optionally, show an error toast notification here
            }
        } catch (error) {
            console.error("Error deleting snippet:", error);
            // Optionally, show a generic error toast notification here
        } finally {
            onClose();
        }
    }

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
                        Are you sure you want to delete this item? This action cannot be undone.
                    </p>
                </div>

                {/* Dialog Footer with Actions */}
                <DialogFooter className="gap-2 sm:space-x-0"> {/* Responsive gap */}
                     {/* DialogClose automatically handles closing the dialog */}
                    <DialogClose asChild>
                        <Button
                            variant="outline" // Use outline variant for Cancel
                            className="border-zinc-600 text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={(e) => deleteSnippet(e)}
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

export default DeleteSnippet;