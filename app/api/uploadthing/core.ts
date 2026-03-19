import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { prisma } from "@/lib/db";
import { ingestPdf } from "@/lib/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    text: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      if (!user?.id) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL", file.ufsUrl);

      // 1. Save file record to Postgres
      const createdFile = await prisma.userFile.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.ufsUrl,
          size: file.size,
        },
      });

      // 2. Trigger PDF ingestion (parse → chunk → embed → store)
      await ingestPdf({ fileId: createdFile.id, fileUrl: file.ufsUrl });

      return { uploadedBy: metadata.userId, fileId: createdFile.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
