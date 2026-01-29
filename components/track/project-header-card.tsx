import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  User,
  Clock,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectHeaderCardProps {
  project?: Project | null;
  latestProgress?: number;
  isLoading?: boolean;
}

export function ProjectHeaderCard({
  project,
  latestProgress = 0,
  isLoading = false,
}: ProjectHeaderCardProps) {
  if (isLoading || !project) {
    return (
      <Card className="border border-border/50 shadow-sm bg-card overflow-hidden">
        <div className="h-2 bg-muted w-full animate-pulse" />
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="space-y-2 w-full max-w-lg">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="flex flex-col items-end justify-center bg-muted px-5 py-3 rounded-xl border border-border/50 min-w-[140px]">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const isDone = project.status === "Done";

  return (
    <Card className="glass-card overflow-hidden hover-lift border-none shadow-2xl">
      <div className="h-1.5 bg-foreground w-full opacity-90" />
      <CardHeader className="pb-8 pt-6 px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-all",
                  isDone
                    ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/20"
                    : "bg-background text-foreground border-border",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <CircleDashed className="w-3 h-3 animate-spin-slow" />
                )}
                {project.status}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-muted/50 text-muted-foreground border-none text-[10px] font-bold uppercase tracking-wider"
              >
                Project ID: {project.id.slice(0, 8)}
              </Badge>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
                {project.projectName}
              </CardTitle>
              <div className="flex items-center gap-2.5 text-muted-foreground pt-1">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  {project.clientName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center bg-foreground text-background p-6 rounded-2xl shadow-xl min-w-[160px] group transition-transform hover:scale-[1.02]">
            <span className="text-[10px] font-bold text-background/60 uppercase tracking-[0.2em] mb-1">
              Overall Progress
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter">
                {latestProgress}
              </span>
              <span className="text-xl font-bold opacity-60">%</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/20 backdrop-blur-sm rounded-2xl p-6 border border-border/40 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <Calendar className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] mb-0.5">
                  Target Deadline
                </p>
                <p className="text-base font-bold text-foreground">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {daysUntilDeadline > 0 && !isDone && (
              <div className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full font-bold text-xs shadow-lg animate-pulse-subtle">
                <Clock className="w-4 h-4" />
                {daysUntilDeadline} HARI LAGI
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
              <span>Initialization</span>
              <span>Launch</span>
            </div>
            <div className="relative w-full bg-muted/50 rounded-full h-4 overflow-hidden border border-border/20 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out bg-foreground shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                style={{ width: `${latestProgress}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
