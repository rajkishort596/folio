"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { UTApi } from "uploadthing/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { revalidatePath } from "next/cache";

const utapi = new UTApi();

const getPineconeIndex = () => {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return client.index(process.env.PINECONE_INDEX!);
};

export async function deleteFile({ id }: { id: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const file = await prisma.userFile.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  try {
    // 1. Delete from Uploadthing
    await utapi.deleteFiles(file.key);

    // 2. Delete from Pinecone (namespace is the fileId)
    const index = getPineconeIndex();
    await index.namespace(file.id).deleteAll();

    // 3. Delete from Prisma (cascades or manual depending on schema)
    // Assuming Prisma schema might not have cascade, we delete manually if needed
    // But usually UserFile deletion should be enough if Message has onDelete: Cascade
    await prisma.userFile.delete({
      where: {
        id: file.id,
      },
    });

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Deletion error:", error);
    return { success: false, error: "Failed to delete file" };
  }
}
