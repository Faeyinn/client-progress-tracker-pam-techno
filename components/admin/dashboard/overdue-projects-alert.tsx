"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { Project } from "@/lib/types/project";
import { format, isPast } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface OverdueProjectsAlertProps {
  projects: Project[];
}

export function OverdueProjectsAlert({
  projects,
}: OverdueProjectsAlertProps) {
  const overdueProjects = useMemo(() => {
    return projects.filter((project) => {
      if (project.status === "Done") return false;
      const deadlineDate = new Date(project.deadline);
      return isPast(deadlineDate);
    });
  }, [projects]);

  if (overdueProjects.length === 0) {
    return null; // Don't show if no overdue projects
  }

  const getDaysOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = now.getTime() - deadlineDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline: string) => {
    return format(new Date(deadline), "dd MMM yyyy", { locale: id });
  };

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
        className="rounded-[1.25rem] shadow-lg shadow-red-200/30 dark:shadow-none border border-red-200/50 dark:border-red-900/30 animate-in fade-in slide-in-from-bottom-4 duration-700"
        primaryHue="#FCA5A5" // Red 300
        secondaryHue="#DC2626" // Red 600
        borderColor="#FECACA" // Red 200
        illuminationColor="#FF000020"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-black tracking-tight text-red-700 dark:text-red-400 uppercase">
                  Proyek Terlewat
                </CardTitle>
                <p className="text-xs font-medium text-red-600/70 dark:text-red-400/70 uppercase tracking-widest mt-0.5">
                  {overdueProjects.length} proyek melewati deadline
                </p>
              </div>
            </div>
            <Badge
              variant="destructive"
              className="whitespace-nowrap ml-auto flex-shrink-0"
            >
              {overdueProjects.length} Urgent
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {overdueProjects.slice(0, 3).map((project) => {
              const daysOverdue = getDaysOverdue(project.deadline);
              return (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="block p-3 rounded-lg bg-white/40 dark:bg-zinc-900/20 hover:bg-white/60 dark:hover:bg-zinc-900/40 transition-colors group border border-red-200/30 dark:border-red-900/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate group-hover:underline">
                        {project.projectName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.clientName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {daysOverdue} hari ({formatDeadline(project.deadline)})
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="whitespace-nowrap flex-shrink-0 border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400"
                    >
                      {project.progress}%
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>

          {overdueProjects.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Link href="/admin/projects?status=On Progress">
                Lihat semua ({overdueProjects.length - 3} lebih)
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          )}
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
