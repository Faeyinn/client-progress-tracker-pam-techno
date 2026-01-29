"use client";

import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  status: "On Progress" | "Done";
  progress: number;
  deadline: string;
}

interface RecentProjectsWidgetProps {
  projects: Project[];
  isLoading: boolean;
}

export function RecentProjectsWidget({
  projects,
  isLoading,
}: RecentProjectsWidgetProps) {
  // Take only the 5 most recent projects
  // Assuming 'projects' is already sorted by date from the API, otherwise we might need sorting
  const recentProjects = projects.slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      "bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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
        <CardHeader className="pt-6 pb-4 border-b border-border/40 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
              Proyek Terbaru
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            <Link href="/admin/projects">
              Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
                      <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                Belum ada proyek
              </div>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-border/20",
                      getAvatarColor(project.clientName),
                    )}
                  >
                    {getInitials(project.clientName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {project.projectName}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md",
                        project.status === "Done"
                          ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      )}
                    >
                      {project.status === "Done"
                        ? "Selesai"
                        : `${project.progress}%`}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
