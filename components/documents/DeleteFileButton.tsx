"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteFile } from "@/lib/actions/delete-file";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface DeleteFileButtonProps {
  fileId: string;
  fileName: string;
}

export function DeleteFileButton({ fileId, fileName }: DeleteFileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteFile({ id: fileId });

      if (result.success) {
        toast.success("File deleted successfully");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to delete file");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer group/delete relative z-10"
      >
        <Trash2 className="size-4.5" style={{ pointerEvents: "none" }} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertTriangle className="size-5" style={{ pointerEvents: "none" }} />
              </div>
              Delete Document
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-4 text-base">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">"{fileName}"</span>?
              This action cannot be undone and will remove all associated chat
              history and vector data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-xl font-bold border-border/40 hover:bg-muted cursor-pointer"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 cursor-pointer"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
