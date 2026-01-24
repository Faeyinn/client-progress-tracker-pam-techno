"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { ProjectLog } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  log: ProjectLog;
  isLatest: boolean;
  index: number;
}

export function TimelineItem({ log, isLatest, index }: TimelineItemProps) {
  return (
    <div
      className="relative flex gap-4 sm:gap-6 group animate-in fade-in-50 slide-in-from-left-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      {/* Percentage Indicator */}
      <div className="relative flex-shrink-0 z-10">
        <div
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center",
            "shadow-sm border-2 transition-all duration-300",
            "group-hover:scale-105 group-hover:shadow-md",
            isLatest
              ? "bg-foreground border-foreground text-background"
              : "bg-card border-border text-muted-foreground",
          )}
        >
          <span className="font-bold text-base sm:text-lg tabular-nums">
            {log.percentage}%
          </span>
        </div>

        {isLatest && (
          <div className="absolute -top-1.5 -right-1.5">
            <div className="w-5 h-5 rounded-full bg-background border-2 border-foreground shadow-sm flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-2 min-w-0">
        <div
          className={cn(
            "rounded-xl p-4 sm:p-5 transition-all duration-300",
            "border border-border/50 hover:border-foreground/20",
            "shadow-sm hover:shadow-md",
            isLatest ? "bg-foreground/[0.02]" : "bg-card",
          )}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2">
              {log.title}
            </h3>
            <Badge
              variant={isLatest ? "default" : "secondary"}
              className={cn(
                "w-fit text-[10px] sm:text-xs shrink-0",
                isLatest
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {new Date(log.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              })}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed whitespace-pre-wrap">
            {log.description}
          </p>

          {/* Footer */}
          <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground/60 pt-3 border-t border-border/50">
            <Calendar className="w-3 h-3 mr-1.5 shrink-0" />
            <span className="truncate">
              {new Date(log.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
