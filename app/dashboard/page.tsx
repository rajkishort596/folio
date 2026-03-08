import { ClientIcon } from "@/components/dashboard/icons";
import { getDashboardData } from "@/lib/actions/dashboard";
import { formatDistanceToNow } from "date-fns";
import { DashboardHeader } from "@/components/dashboard/header";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";
import Link from "next/link";

export default async function DashboardPage() {
  const { recentFiles } = await getDashboardData();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto no-scrollbar scroll-smooth">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pb-20">
        <DashboardHeader />

        <main className="space-y-24">
          <section className="flex flex-col items-center justify-center pt-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                Analyze your documents
              </h1>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
                Upload your PDF to extract insights, summaries, and have a
                conversation with your data instantly.
              </p>
            </div>

            <div className="w-full max-w-3xl mx-auto">
              <UploadDropzone />
            </div>
          </section>

          {recentFiles.length > 0 && (
            <section className="animate-in fade-in duration-1000 delay-300">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ClientIcon name="Clock" size={20} />
                  </div>
                  Recent Activity
                </h2>
                <Link
                  href="/documents"
                  className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-muted"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentFiles.map((file) => (
                  <Link
                    key={file.id}
                    href={`/dashboard/${file.id}`}
                    className="group relative p-5 rounded-3xl bg-card border border-border/40 hover:border-primary/40 transition-all hover:bg-muted/30 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <ClientIcon name="FileText" size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {formatDistanceToNow(new Date(file.createdAt))} ago
                          </span>
                          <span className="size-1 rounded-full bg-border" />
                          <span className="text-xs text-primary/70 font-bold uppercase tracking-tighter">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ClientIcon
                        name="ChevronRight"
                        size={16}
                        className="text-primary"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
