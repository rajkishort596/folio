import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Workspace } from "@/components/dashboard/Workspace";

interface PageProps {
  params: Promise<{
    fileId: string;
  }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { userId } = await auth();
  const { fileId } = await params;

  if (!userId) redirect("/sign-in");

  const file = await prisma.userFile.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) notFound();

  // Convert Prisma model to a plain object for the client component
  const fileData = {
    id: file.id,
    name: file.name,
    url: file.url,
  };

  return <Workspace file={fileData} />;
}
