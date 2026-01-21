import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import { ProjectLog } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  log: ProjectLog;
  isLatest: boolean;
}

export function TimelineItem({ log, isLatest }: TimelineItemProps) {
  return (
    <div className="relative flex gap-6 group">
      {/* Timeline Dot & Line Connector context handled by parent usually, but here we style the item */}

      {/* Percentage Indicator */}
      <div className="relative flex-shrink-0 z-10">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md",
            isLatest
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-background border-muted-foreground/30 text-muted-foreground",
          )}
        >
          <span className="font-bold text-lg">{log.percentage}%</span>
        </div>

        {isLatest && (
          <div className="absolute -top-2 -right-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-sm flex items-center justify-center animate-bounce">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-2">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h3 className="text-base font-bold text-foreground line-clamp-1">
              {log.title}
            </h3>
            <Badge
              variant={isLatest ? "default" : "secondary"}
              className="w-fit text-xs"
            >
              {new Date(log.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              })}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">
            {log.description}
          </p>

          <div className="flex items-center text-xs text-muted-foreground/70 pt-3 border-t border-border/30">
            <Calendar className="w-3 h-3 mr-1.5" />
            {new Date(log.createdAt).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
