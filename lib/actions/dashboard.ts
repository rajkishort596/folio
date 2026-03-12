"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch recent files
  const recentFiles = await prisma.userFile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Fetch total count
  const totalCount = await prisma.userFile.count({
    where: { userId },
  });

  // Fetch storage usage (sum of all file sizes)
  const result = await prisma.userFile.aggregate({
    where: { userId },
    _sum: {
      size: true,
    },
  });

  const totalSize = result._sum.size || 0;

  return {
    recentFiles,
    totalCount,
    totalSize, // size is in bytes
  };
}
export async function getFileMessages(fileId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.message.findMany({
    where: {
      fileId,
      file: {
        userId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
