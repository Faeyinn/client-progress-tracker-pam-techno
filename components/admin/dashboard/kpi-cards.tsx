"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Award, Calendar } from "lucide-react";
import { Project } from "@/lib/types/project";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";

interface KPICardsProps {
  projects: Project[];
  isLoading?: boolean;
}

export function KPICards({ projects, isLoading }: KPICardsProps) {
  const kpis = useMemo(() => {
    if (projects.length === 0) {
      return {
        completionRate: 0,
        onTimeDeliveryRate: 0,
        avgProgress: 0,
      };
    }

    const totalProjects = projects.length;
    const completedProjects = projects.filter((p) => p.status === "Done").length;
    const completionRate =
      totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // On-time delivery: projects completed before or on deadline
    const onTimeProjects = projects.filter((p) => {
      if (p.status !== "Done") return false;
      const deadline = new Date(p.deadline);
      const now = new Date();
      return deadline >= now;
    }).length;

    const onTimeDeliveryRate =
      completedProjects > 0 ? Math.round((onTimeProjects / completedProjects) * 100) : 0;

    // Average progress of all projects
    const avgProgress =
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
        : 0;

    return {
      completionRate,
      onTimeDeliveryRate,
      avgProgress,
    };
  }, [projects]);

  const cards = [
    {
      title: "Persentase Proyek Selesai",
      value: kpis.completionRate,
      unit: "%",
      icon: Award,
    },
    {
      title: "Ketepatan Deadline",
      value: kpis.onTimeDeliveryRate,
      unit: "%",
      icon: Calendar,
    },
    {
      title: "Progress Keseluruhan",
      value: kpis.avgProgress,
      unit: "%",
      icon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <CursorCardsContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {cards.map((card, index) => (
          <CursorCard
            key={card.title}
            surfaceClassName="bg-card dark:bg-card"
            className="relative overflow-hidden group transition-all duration-700"
          >
            <div className="p-6 space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
              </div>
            </div>
          </CursorCard>
        ))}
      </CursorCardsContainer>
    );
  }

  return (
    <CursorCardsContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <CursorCard
            key={card.title}
            surfaceClassName="bg-card dark:bg-card"
            className="relative overflow-hidden group transition-all duration-700 shadow-md hover:shadow-lg"
            primaryHue="oklch(0.58 0.16 158)" // Medium emerald
            secondaryHue="oklch(0.52 0.17 160)" // Rich emerald
            borderColor="oklch(0.88 0.015 155)" // Sage border
            illuminationColor="oklch(0.52 0.17 160 / 0.25)" // Emerald glow
          >
            <div className="p-6 space-y-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground">
                    {kpis[Object.keys(kpis)[index] as keyof typeof kpis]}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground/60">
                    {card.unit}
                  </span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 ease-out rounded-full bg-accent"
                    style={{
                      width: `${kpis[Object.keys(kpis)[index] as keyof typeof kpis]}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CursorCard>
        );
      })}
    </CursorCardsContainer>
  );
}

export function KPICardsSkeleton() {
  return (
    <CursorCardsContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      {[...Array(3)].map((_, i) => (
        <CursorCard
          key={i}
          surfaceClassName="bg-card"
          className="relative overflow-hidden"
        >
          <div className="p-6 space-y-4 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-8 w-1/2 rounded bg-muted" />
            </div>
            <div className="h-1.5 rounded-full bg-muted w-full" />
          </div>
        </CursorCard>
      ))}
    </CursorCardsContainer>
  );
}
