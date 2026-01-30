"use client";

import { useMemo } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle } from "lucide-react";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface TeamCapacityWidgetProps {
  projects: Project[];
}

export function TeamCapacityWidget({ projects }: TeamCapacityWidgetProps) {
  const capacityMetrics = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "On Progress");
    const totalCapacity = 100; // Assume team has 100% capacity
    const usedCapacity = activeProjects.length * (totalCapacity / Math.max(projects.length, 1));
    const utilizationRate = projects.length > 0 ? (activeProjects.length / projects.length) * 100 : 0;

    // Estimate based on average progress
    const avgProgressOfActive = activeProjects.length > 0
      ? activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length
      : 0;

    const workloadLevel =
      utilizationRate > 80 ? "critical" : utilizationRate > 60 ? "high" : "normal";

    return {
      activeProjects: activeProjects.length,
      totalProjects: projects.length,
      utilizationRate: Math.round(utilizationRate),
      avgProgressOfActive: Math.round(avgProgressOfActive),
      workloadLevel,
    };
  }, [projects]);

  const getWorkloadColor = (level: string) => {
    return "bg-white dark:bg-zinc-900";
  };

  const getWorkloadIcon = (level: string) => {
    return "text-zinc-600 dark:text-zinc-400";
  };

  const getWorkloadLabel = (level: string) => {
    switch (level) {
      case "critical":
        return "Sangat Tinggi";
      case "high":
        return "Tinggi";
      default:
        return "Normal";
    }
  };

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-white dark:bg-zinc-900"
        className="rounded-[1.5rem] shadow-lg shadow-zinc-200/50 dark:shadow-none h-full"
        primaryHue="#E4E4E7"
        secondaryHue="#52525B"
        borderColor="#F4F4F5"
        illuminationColor="#FFFFFF20"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
                  Kapasitas Tim
                </CardTitle>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
                  {getWorkloadLabel(capacityMetrics.workloadLevel)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Utilization Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Utilisasi Kapasitas
              </label>
              <span className="text-2xl font-black text-foreground">
                {capacityMetrics.utilizationRate}%
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
                className="h-full transition-all duration-700 ease-out rounded-full"
                style={{
                  background: capacityMetrics.workloadLevel === "critical"
                    ? "#000"
                    : capacityMetrics.workloadLevel === "high"
                      ? "#52525B"
                      : "#A1A1AA",
                  width: `${capacityMetrics.utilizationRate}%`,
                }}
              />
            </div>
          </div>

          {/* Project Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Proyek Aktif
              </p>
              <p className="text-2xl font-black text-foreground">
                {capacityMetrics.activeProjects}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                dari {capacityMetrics.totalProjects}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Progress Rata-rata
              </p>
              <p className="text-2xl font-black text-foreground">
                {capacityMetrics.avgProgressOfActive}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                proyek aktif
              </p>
            </div>
          </div>

          {/* Workload Recommendation */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-zinc-600 dark:text-zinc-400" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground mb-1">
                  {capacityMetrics.workloadLevel === "critical"
                    ? "Status: Kapasitas Penuh"
                    : capacityMetrics.workloadLevel === "high"
                      ? "Status: Kapasitas Tinggi"
                      : "Status: Kapasitas Optimal"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {capacityMetrics.workloadLevel === "critical"
                    ? "Tim sedang menangani proyek mendekati kapasitas maksimal. Sebaiknya tunda proyek baru atau tambahkan tim."
                    : capacityMetrics.workloadLevel === "high"
                      ? "Tim sedang sibuk dengan proyek aktif. Pantau progress dengan lebih ketat."
                      : "Tim memiliki kapasitas yang cukup. Dapat menerima proyek baru."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
