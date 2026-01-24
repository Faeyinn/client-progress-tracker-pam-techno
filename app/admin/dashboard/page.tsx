"use client";

import { useEffect } from "react";
import { NewProjectModal } from "@/components/admin/dashboard/new-project-modal";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import {
  StatsCards,
  StatsCardsSkeleton,
} from "@/components/admin/dashboard/stats-cards";
import { ProjectFilters } from "@/components/admin/dashboard/project-filters";
import { ProjectTable } from "@/components/admin/dashboard/project-table";
import { useDashboardLogic } from "@/components/admin/dashboard/hooks/use-dashboard";
import { BottomNav } from "@/components/admin/shared/bottom-nav";
import { Button } from "@/components/ui/button";
import { RefreshCcw, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
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
    stats,
  } = useDashboardLogic();

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 rounded-xl bg-foreground/5 items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Ringkasan performa dan kontrol proyek.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <StatsCardsSkeleton />
        ) : (
          <StatsCards stats={stats} isLoading={isLoading} />
        )}

        {/* Projects Section - Clean Layout */}
        <section className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden">
          {/* Header with filters integrated */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Daftar Proyek
                  </h2>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Kelola dan pantau semua proyek
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={fetchProjects}
                  disabled={isLoading}
                >
                  <RefreshCcw
                    className={cn(
                      "w-3.5 h-3.5 mr-1.5",
                      isLoading && "animate-spin",
                    )}
                  />
                  Refresh
                </Button>
                <div className="hidden md:block">
                  <NewProjectModal onSuccess={fetchProjects} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters - No extra padding */}
          <div className="px-4 py-2.5 border-b border-border/30 bg-card sticky top-16 z-40 backdrop-blur-md">
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
            />
          </div>

          {/* Table Content */}
          <div className="px-4 pb-4">
            <ProjectTable
              projects={filteredProjects}
              isLoading={isLoading}
              error={error}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </main>

      {/* Mobile Floating Refresh Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed bottom-20 right-4 z-40 md:hidden",
          "h-12 w-12 rounded-full shadow-lg",
          "bg-background/95 backdrop-blur-sm border-border/50",
          "hover:bg-muted active:scale-95 transition-all",
        )}
        onClick={fetchProjects}
        disabled={isLoading}
        aria-label="Refresh data"
      >
        <RefreshCcw className={cn("w-5 h-5", isLoading && "animate-spin")} />
      </Button>

      {/* Mobile Bottom Navigation */}
      <BottomNav onProjectCreated={fetchProjects} />
    </div>
  );
}
