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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, FolderKanban, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectInfoCard } from "@/components/admin/projects/detail/project-info-card";
import { ProjectActions } from "@/components/admin/projects/detail/project-actions";
import { AddLogForm } from "@/components/admin/projects/detail/add-log-form";
import { TimelineView } from "@/components/admin/projects/detail/timeline-view";
import { useProjectDetail } from "@/components/admin/projects/hooks/use-project-detail";

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
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error || "Proyek tidak ditemukan"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50/50">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="transition-transform hover:-translate-x-1"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-white border border-border/50 p-1">
                  <Image
                    src="/logo-pure.png"
                    alt="Project Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight">
                    {project.projectName}
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Project Details
                  </p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-1">
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
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="timeline">History Progress</TabsTrigger>
                <TabsTrigger value="feedback">Feedback & Request</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-6">
                {/* Add Log Button */}
                <Card className="border border-input shadow-sm bg-background">
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Update Progress
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Tambahkan log baru untuk update progress
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowLogForm(!showLogForm)}
                        size="sm"
                        className="bg-black hover:bg-zinc-800 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Log
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Add Log Form */}
                {showLogForm && (
                  <AddLogForm
                    projectId={projectId}
                    onSuccess={handleLogSuccess}
                    onCancel={() => setShowLogForm(false)}
                  />
                )}

                {/* Timeline */}
                <TimelineView logs={logs} />
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                {feedbacks.length === 0 ? (
                  <Card className="border-dashed border-2 border-muted bg-muted/5">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <FolderKanban className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-semibold">
                        Belum ada feedback
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        Klien belum mengirimkan feedback atau request apapun
                        untuk proyek ini.
                      </p>
                    </div>
                  </Card>
                ) : (
                  feedbacks.map((item) => (
                    <Card
                      key={item.id}
                      className="border-border/60 shadow-sm overflow-hidden transition-all hover:border-black/20"
                    >
                      <CardHeader className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-medium text-muted-foreground">
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
                        <div className="p-3 bg-muted/30 rounded-lg text-sm text-foreground leading-relaxed border border-border/40">
                          "{item.message}"
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
