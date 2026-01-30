"use client";

import { useEffect } from "react";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import {
  StatsCards,
  StatsCardsSkeleton,
} from "@/components/admin/dashboard/stats-cards";
import { useDashboardLogic } from "@/components/admin/dashboard/hooks/use-dashboard";
import { BottomNav } from "@/components/admin/shared/bottom-nav";
import { Button } from "@/components/ui/button";
import { RefreshCcw, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecentProjectsWidget } from "@/components/admin/dashboard/recent-projects-widget";
import { NewProjectModal } from "@/components/admin/dashboard/new-project-modal";
import { OverdueProjectsAlert } from "@/components/admin/dashboard/overdue-projects-alert";
import { KPICards, KPICardsSkeleton } from "@/components/admin/dashboard/kpi-cards";

import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { ProjectChart } from "@/components/admin/dashboard/project-chart";
import { RecentActivity } from "@/components/admin/dashboard/recent-activity";

export default function AdminDashboardPage() {
  const { projects, isLoading, fetchProjects, stats } = useDashboardLogic();

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12 space-y-8">
        {/* Page Header - Ultra Compact */}
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
                <LayoutDashboard className="w-24 h-24 text-foreground" />
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="hidden sm:flex h-10 w-10 rounded-lg bg-primary text-primary-foreground items-center justify-center shadow-md shadow-accent/20">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                    Admin Console
                  </p>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
                    DASHBOARD
                    <span className="text-primary/40">.</span>
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/80 font-medium tracking-wide mt-0.5 max-w-xl leading-relaxed">
                    Ringkasan performa sistem.
                  </p>
                </div>
              </div>
            </div>
          </CursorCard>
        </CursorCardsContainer>

        {/* Stats Cards Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {isLoading ? (
            <StatsCardsSkeleton />
          ) : (
            <StatsCards stats={stats} isLoading={isLoading} />
          )}
        </div>

        {/* Overdue Projects Alert */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <OverdueProjectsAlert projects={projects} />
        </div>

        {/* KPI Cards Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-250">
          {isLoading ? (
            <KPICardsSkeleton />
          ) : (
            <KPICards projects={projects} isLoading={isLoading} />
          )}
        </div>

        {/* Grid Layout for Charts, Activity, and Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Overview and Recent Projects (2 cols) */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-5">
            {/* Chart Section */}
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <ProjectChart projects={projects} />
            </div>

            {/* Recent Projects Section - Same width as chart */}
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <RecentProjectsWidget projects={projects} isLoading={isLoading} />
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400 h-full">
            <RecentActivity />
          </div>
        </div>
      </main>

      {/* Mobile Floating Refresh Button */}
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
