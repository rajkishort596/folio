"use client";

import { formatDistanceToNow } from "date-fns";
import { FileText, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DeleteFileButton } from "./DeleteFileButton";
import { motion } from "motion/react";

interface File {
  id: string;
  name: string;
  createdAt: Date | string;
  url: string;
}

interface DocumentListProps {
  files: File[];
}

export function DocumentList({ files }: DocumentListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed border-border/40">
        <div className="size-20 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground mb-6">
          <FileText size={40} />
        </div>
        <h3 className="text-xl font-bold">No documents yet</h3>
        <p className="text-muted-foreground mt-2 font-medium">Upload your first PDF to get started.</p>
        <Link href="/dashboard" className="mt-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            Upload Now
          </motion.div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative p-6 rounded-[2rem] bg-card border border-border/40 hover:border-primary/40 transition-all hover:bg-muted/30 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-start justify-between">
              <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <FileText size={28} />
              </div>
              <DeleteFileButton fileId={file.id} fileName={file.name} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                {file.name}
              </h4>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Added {formatDistanceToNow(new Date(file.createdAt))} ago
              </p>
            </div>

            <Link href={`/dashboard/${file.id}`} className="mt-4">
              <div className="w-full py-3 rounded-2xl bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center gap-2 font-bold transition-all">
                <span>Open in Chat</span>
                <MessageSquare size={18} />
              </div>
            </Link>
          </div>

          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight
              size={16}
              className="text-primary/50"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
