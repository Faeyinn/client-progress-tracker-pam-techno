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

          {/* Overall Progress Card - Dark with premium bling effects */}
          <div className="relative flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center p-6 rounded-2xl min-w-[160px] group transition-all hover:scale-[1.02] overflow-hidden bg-linear-to-br from-foreground via-foreground to-foreground/95">
            {/* Animated linear border glow - always visible */}
            <div className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-r from-accent/0 via-accent/50 to-chart-5/50 blur-xl animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-foreground via-foreground to-foreground/95" />
            
            {/* Decorative shine circles - bling bling effect with continuous animation */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-linear-to-br from-accent/25 to-transparent blur-3xl group-hover:from-accent/35 transition-all duration-700 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-linear-to-tr from-chart-5/20 to-transparent blur-2xl group-hover:from-chart-5/30 transition-all duration-700" style={{
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/8 blur-2xl" style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            
            {/* Shimmer sweep effect - continuous animation */}
            <div
              className="absolute inset-0 bg-linear-to-tr from-transparent via-white/8 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"
              style={{
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            />
            {/* Shiny parallelogram sliding effect - continuous left to right */}
            <div
              className="absolute inset-y-0 w-32 bg-linear-to-r from-transparent via-white/20 to-transparent"
              style={{
                animation: 'slide-shine 4s ease-in-out infinite',
                transform: 'skewX(-20deg)',
                filter: 'blur(8px)'
              }}
            />
            <div
              className="absolute inset-y-0 w-24 bg-linear-to-r from-transparent via-accent/15 to-transparent"
              style={{
                animation: 'slide-shine 4s ease-in-out infinite',
                animationDelay: '2s',
                transform: 'skewX(-20deg)',
                filter: 'blur(6px)'
              }}
            />
            
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
            
            {/* Sparkle dots */}
            <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-accent/60" style={{
              animation: 'twinkle 2s ease-in-out infinite',
              animationDelay: '0s'
            }} />
            <div className="absolute top-5 right-8 w-1 h-1 rounded-full bg-chart-5/50" style={{
              animation: 'twinkle 2s ease-in-out infinite',
              animationDelay: '0.7s'
            }} />
            <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-white/40" style={{
              animation: 'twinkle 2s ease-in-out infinite',
              animationDelay: '1.4s'
            }} />
            
            {/* Content */}
            <div className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full">
              <span className="text-[10px] font-bold text-background/60 uppercase tracking-[0.2em] mb-1 drop-shadow-sm">
                Overall Progress
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-background drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                  {latestProgress}
                </span>
                <span className="text-xl font-bold opacity-60 text-background drop-shadow-sm">%</span>
              </div>
            </div>
            
            {/* Bottom accent line - always visible with subtle animation */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent/60 to-chart-5/60 group-hover:via-accent/80 group-hover:to-chart-5/80 transition-all duration-500" style={{
              animation: 'glow-pulse 2s ease-in-out infinite'
            }} />
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
