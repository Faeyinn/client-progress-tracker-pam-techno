"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboardLogic } from "@/components/admin/dashboard/hooks/use-dashboard";
import { ProjectTable } from "@/components/admin/dashboard/project-table";
import { ProjectFilters } from "@/components/admin/dashboard/project-filters";
import { NewProjectModal } from "@/components/admin/dashboard/new-project-modal";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { BottomNav } from "@/components/admin/shared/bottom-nav";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(
    searchParams.get("newProject") === "true"
  );
  const {
    projects,
    filteredProjects,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fetchProjects,
    handleDelete,
  } = useDashboardLogic();

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Watch for newProject query parameter changes
  useEffect(() => {
    setIsNewProjectModalOpen(searchParams.get("newProject") === "true");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12 space-y-8">
        {/* Page Header */}
        <CursorCardsContainer>
          <CursorCard
            surfaceClassName="bg-card dark:bg-card"
            className="rounded-[1.25rem] shadow-lg shadow-accent/10 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-700"
            primaryHue="oklch(0.58 0.16 158)" // Medium emerald
            secondaryHue="oklch(0.52 0.17 160)" // Rich emerald
            borderColor="oklch(0.88 0.015 155)" // Sage border
            illuminationColor="oklch(0.52 0.17 160 / 0.2)" // Emerald glow
          >
            <div className="flex flex-col gap-1 relative overflow-hidden p-3 sm:p-4">
              <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-[0.03]">
                <FolderKanban className="w-24 h-24 text-foreground" />
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="hidden sm:flex h-10 w-10 rounded-lg bg-primary text-primary-foreground items-center justify-center shadow-md shadow-accent/20">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                    Admin Console
                  </p>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
                    PROYEK
                    <span className="text-primary/40">.</span>
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/80 font-medium tracking-wide mt-0.5 max-w-xl leading-relaxed">
                    Kelola semua proyek klien Anda di sini.
                  </p>
                </div>
              </div>
            </div>
          </CursorCard>
        </CursorCardsContainer>

        {/* Projects Section */}
        <div className="rounded-[2.5rem] shadow-2xl shadow-accent/10 dark:shadow-none animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 bg-card/50 backdrop-blur-xl border border-border/50 relative">
          <section className="overflow-hidden">
            {/* Header with filters integrated */}
            <div className="px-6 py-6 sm:px-10 border-b border-border/40 bg-transparent">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Title */}
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                      Daftar Proyek
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] text-muted-foreground">
                        {projects.length}
                      </span>
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1.5">
                      Management Overview
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-full border-border/50 hover:bg-foreground hover:text-background transition-all hover:scale-105 active:scale-95"
                      onClick={fetchProjects}
                      disabled={isLoading}
                    >
                      <RefreshCcw
                        className={cn(
                          "w-3.5 h-3.5 mr-2",
                          isLoading && "animate-spin",
                        )}
                      />
                      Refresh
                    </Button>
                    <div className="hidden md:block">
                      <NewProjectModal
                        onSuccess={fetchProjects}
                        open={isNewProjectModalOpen}
                        onOpenChange={setIsNewProjectModalOpen}
                      />
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <Tabs
                    defaultValue="all"
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                    className="w-full md:w-auto"
                  >
                    <TabsList className="bg-muted/50 p-1 rounded-xl h-auto">
                      <TabsTrigger
                        value="all"
                        className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-card data-[state=active]:text-accent data-[state=active]:shadow-sm px-4 py-2 transition-all"
                      >
                        Semua
                      </TabsTrigger>
                      <TabsTrigger
                        value="On Progress"
                        className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-card data-[state=active]:text-accent data-[state=active]:shadow-sm px-4 py-2 transition-all"
                      >
                        Berjalan
                      </TabsTrigger>
                      <TabsTrigger
                        value="Done"
                        className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-card data-[state=active]:text-accent data-[state=active]:shadow-sm px-4 py-2 transition-all"
                      >
                        Selesai
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Search Filter */}
                  <div className="w-full md:w-72">
                    <ProjectFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      resultCount={filteredProjects.length}
                      totalCount={projects.length}
                      onReset={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      hideStatusDropdown={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="px-2 sm:px-4 pb-6 mt-2">
              <ProjectTable
                projects={filteredProjects}
                isLoading={isLoading}
                error={error}
                onDelete={handleDelete}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Actions */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          "fixed bottom-24 right-6 z-40 md:hidden",
          "h-14 w-14 rounded-2xl shadow-2xl shadow-primary/30",
          "hover:scale-110 active:scale-90 transition-all duration-300",
        )}
        onClick={fetchProjects}
        disabled={isLoading}
        aria-label="Refresh data"
      >
        <RefreshCcw className={cn("w-6 h-6", isLoading && "animate-spin")} />
      </Button>

      <BottomNav onProjectCreated={fetchProjects} />
    </div>
  );
}
