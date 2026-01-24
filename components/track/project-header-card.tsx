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

interface ProjectHeaderCardProps {
  project: Project;
  latestProgress: number;
}

export function ProjectHeaderCard({
  project,
  latestProgress,
}: ProjectHeaderCardProps) {
  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const isDone = project.status === "Done";

  return (
    <Card className="border border-border/50 shadow-sm bg-card overflow-hidden">
      <div className="h-2 bg-black w-full" />
      <CardHeader className="pb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={cn(
                "mb-2 w-fit flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
                isDone
                  ? "bg-foreground text-background border-foreground/20"
                  : "bg-muted text-foreground border-border",
              )}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <CircleDashed className="w-3.5 h-3.5" />
              )}
              {project.status}
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {project.projectName}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground pt-1">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{project.clientName}</span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center bg-muted px-5 py-3 rounded-xl border border-border/50 min-w-[140px]">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Total Progress
            </span>
            <span className="text-3xl font-black text-foreground">
              {latestProgress}%
            </span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Target Deadline
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {daysUntilDeadline > 0 && !isDone && (
              <Badge
                variant="secondary"
                className="bg-foreground text-background hover:bg-black/90 px-3 py-1.5 h-fit self-start sm:self-center"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {daysUntilDeadline} Hari Lagi
              </Badge>
            )}
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out bg-foreground"
                style={{ width: `${latestProgress}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
