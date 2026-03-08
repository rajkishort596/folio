"use client";

import { UploadDropzone as UTDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClientIcon } from "@/components/dashboard/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UploadDropzone() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <UTDropzone
        endpoint="pdfUploader"
        onUploadBegin={(name) => {
          setIsUploading(true);
          toast.info("Uploading document...", {
            description: `Sending ${name} to the cloud.`,
          });
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          const fileId = res?.[0]?.serverData?.fileId;

          toast.success("Upload successful!", {
            description: "Redirecting to your workspace...",
            icon: (
              <ClientIcon
                name="CheckCircle2"
                size={16}
                className="text-emerald-500"
              />
            ),
          });

          if (fileId) {
            router.push(`/dashboard/${fileId}`);
          } else {
            router.refresh(); // Fallback if no ID
          }
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          toast.error("Upload failed", {
            description: error.message,
          });
        }}
        appearance={{
          container: cn(
            "flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-3xl transition-all duration-300",
            isUploading
              ? "border-primary bg-primary/5 cursor-wait"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50 cursor-pointer",
          ),
          uploadIcon:
            "text-primary/40 size-16 mb-4 group-hover:text-primary transition-colors",
          label: "text-xl font-bold tracking-tight mb-2",
          allowedContent: "text-sm text-muted-foreground",
          button:
            "mt-6 bg-primary text-primary-foreground h-11 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 cursor-pointer",
        }}
        content={{
          label: "Drag & drop your PDF here",
          allowedContent: "PDF documents up to 4MB",
        }}
      />

      <div className="flex items-center justify-center gap-6 mt-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <ClientIcon name="ShieldCheck" size={14} />
          Secure Upload
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <ClientIcon name="Zap" size={14} />
          Instant Analysis
        </div>
      </div>
    </div>
  );
}
