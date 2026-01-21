"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NewProjectModal } from "@/components/admin/dashboard/new-project-modal";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import { ProjectFilters } from "@/components/admin/dashboard/project-filters";
import { ProjectTable } from "@/components/admin/dashboard/project-table";
import { useDashboardLogic } from "@/components/admin/dashboard/hooks/use-dashboard";

export default function AdminDashboardPage() {
  const {
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
    <div className="min-h-screen bg-muted/10">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards stats={stats} />

        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Daftar Proyek
              </h2>
              <p className="text-muted-foreground">
                Kelola dan pantau semua proyek yang berjalan
              </p>
            </div>
            <NewProjectModal onSuccess={fetchProjects} />
          </div>

          <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <ProjectFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              <ProjectTable
                projects={filteredProjects}
                isLoading={isLoading}
                error={error}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
