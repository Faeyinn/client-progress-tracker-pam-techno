"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "On Progress" | "Done">("all");

  const filteredProjects = useMemo(() => {
    let result = projects.slice(0, 5);

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.projectName.toLowerCase().includes(lowerQuery) ||
          project.clientName.toLowerCase().includes(lowerQuery),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }

    return result;
  }, [projects, searchQuery, statusFilter]);

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
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
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
        <CardHeader className="pt-6 pb-4 border-b border-border/40">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
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
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari proyek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="On Progress">Dalam Progress</SelectItem>
                  <SelectItem value="Done">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-muted">
                    <FolderKanban className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Tidak ada proyek ditemukan
                </p>
                <p className="text-xs text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Coba sesuaikan filter Anda"
                    : "Belum ada proyek dibuat"}
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
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
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
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
