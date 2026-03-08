"use client";

import { UploadButton as UTButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClientIcon } from "@/components/dashboard/icons";

export function UploadButton() {
  const router = useRouter();

  return (
    <UTButton
      endpoint="pdfUploader"
      appearance={{
        button:
          "rounded-2xl h-12 px-8 bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all",
        allowedContent: "hidden",
      }}
      onClientUploadComplete={(res) => {
        toast.success("Document uploaded successfully!", {
          description: "Your file is ready for analysis.",
          icon: (
            <ClientIcon
              name="CheckCircle2"
              size={16}
              className="text-emerald-500"
            />
          ),
        });
        router.refresh();
      }}
      onUploadError={(error: Error) => {
        toast.error("Upload failed", {
          description: error.message,
        });
      }}
      onUploadBegin={(name) => {
        toast.info("Uploading document...", {
          description: `Sending ${name} to the cloud.`,
        });
      }}
    />
  );
}
