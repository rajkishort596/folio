import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { DocumentList } from "@/components/documents/DocumentList";
import { Files } from "lucide-react";

export const metadata = {
  title: "My Documents | Folio",
  description: "Manage and chat with all your uploaded documents.",
};

export default async function DocumentsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const files = await prisma.userFile.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto no-scrollbar scroll-smooth">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pb-20">
        <DashboardHeader />

        <main className="mt-12 space-y-12">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                  My Documents
                </h1>
                <p className="text-muted-foreground text-lg font-medium max-w-xl">
                  Easily manage all your uploaded files, start new conversations, 
                  or remove documents you no longer need.
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-muted/40 p-2 rounded-2xl border border-border/20">
                <div className="px-4 py-2 bg-background rounded-xl border border-border/40 shadow-sm flex items-center gap-2">
                  <Files size={18} className="text-primary" />
                  <span className="font-bold">{files.length}</span>
                  <span className="text-muted-foreground font-semibold">Files</span>
                </div>
              </div>
            </div>

            <DocumentList files={files} />
          </section>
        </main>
      </div>
    </div>
  );
}
