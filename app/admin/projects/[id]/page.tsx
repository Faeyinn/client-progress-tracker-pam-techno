"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectInfoCard } from "@/components/admin/projects/detail/project-info-card";
import { ProjectActions } from "@/components/admin/projects/detail/project-actions";
import { AddLogForm } from "@/components/admin/projects/detail/add-log-form";
import { TimelineView } from "@/components/admin/projects/detail/timeline-view";
import { useProjectDetail } from "@/components/admin/projects/hooks/use-project-detail";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const {
    project,
    logs,
    feedbacks,
    isLoading,
    error,
    copied,
    showLogForm,
    setShowLogForm,
    handleCopyLink,
    handleDeleteProject,
    handleLogSuccess,
    latestProgress,
  } = useProjectDetail(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-muted border-t-foreground animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Memuat detail proyek...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Proyek Tidak Ditemukan</CardTitle>
            <CardDescription>
              {error || "Proyek yang Anda cari tidak ada atau telah dihapus."}
            </CardDescription>
            <Link href="/admin/dashboard" className="mt-4 inline-block">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/admin/dashboard"
                className="transition-transform hover:-translate-x-1 shrink-0"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>

              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm bg-card border border-border/50 p-1 shrink-0">
                  <Image
                    src="/logo-pure.png"
                    alt="Project Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
                    {project.projectName}
                  </h1>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        project.status === "Done"
                          ? "bg-foreground"
                          : "bg-foreground/50 animate-pulse",
                      )}
                    />
                    <span className="truncate">Detail Proyek</span>
                  </div>
                </div>
              </div>
            </div>

            <ProjectActions
              projectId={projectId}
              onDelete={handleDeleteProject}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <ProjectInfoCard
              project={project}
              latestProgress={latestProgress}
              copied={copied}
              onCopyLink={handleCopyLink}
            />
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">History Progress</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Feedback & Request</span>
                  <span className="sm:hidden">Feedback</span>
                  {feedbacks.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                      {feedbacks.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4 mt-2">
                <div className="flex items-center justify-between px-1">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                      History Progress
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Kelola pembaruan log dan progress pengerjaan proyek.
                    </p>
                  </div>

                  <Dialog open={showLogForm} onOpenChange={setShowLogForm}>
                    <DialogTrigger asChild>
                      <Button className="rounded-full shadow-lg shadow-foreground/10 bg-foreground hover:bg-foreground/90 text-background gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Tambah Log</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-125">
                      <DialogHeader>
                        <DialogTitle>Update Progress</DialogTitle>
                        <DialogDescription>
                          Berikan informasi terbaru mengenai pengerjaan proyek
                          ini untuk dilihat klien.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <AddLogForm
                          projectId={projectId}
                          onSuccess={handleLogSuccess}
                          onCancel={() => setShowLogForm(false)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <TimelineView logs={logs} />
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4 mt-2">
                <div className="px-0.5 mb-2">
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Feedback & Request
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Kumpulan feedback dan permintaan dari klien.
                    </p>
                  </div>
                </div>

                {feedbacks.length === 0 ? (
                  <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-semibold">
                        Belum ada feedback
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        Klien belum mengirimkan feedback atau request apapun
                        untuk proyek ini.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {feedbacks.map((item, index) => (
                      <Card
                        key={item.id}
                        className={cn(
                          "border-border/50 shadow-sm overflow-hidden",
                          "transition-all duration-300 hover:shadow-md hover:border-border",
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-4 h-4 text-foreground/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Feedback dari Klien
                                </span>
                                <span className="text-[10px] text-muted-foreground/70">
                                  {new Date(item.createdAt).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground leading-relaxed border border-border/50">
                                &ldquo;{item.message}&rdquo;
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
