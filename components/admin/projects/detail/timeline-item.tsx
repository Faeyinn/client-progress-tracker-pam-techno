"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, ImageIcon, Link2 } from "lucide-react";
import Image from "next/image";
import { ProjectLog } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
            <h3 className="text-sm sm:text-base font-black tracking-tight text-foreground line-clamp-2 uppercase">
              {log.title}
            </h3>
            <Badge
              variant={isLatest ? "default" : "secondary"}
              className={cn(
                "w-fit text-[10px] sm:text-xs shrink-0 font-bold tracking-widest uppercase",
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

          {/* Visual Update (Images & Links) */}
          {log.progressUpdate && (
            <div className="space-y-4 mb-5 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/50">
              {/* Images Grid */}
              {log.progressUpdate.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {log.progressUpdate.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/img block"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted shadow-sm">
                        <Image
                          src={img.url}
                          alt={img.fileName || "Progress screenshot"}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover/img:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white shadow-sm" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Links Buttons */}
              {log.progressUpdate.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {log.progressUpdate.links.map((l) => (
                    <Button
                      key={l.id}
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-[10px] sm:text-xs font-bold gap-2 rounded-full border-border/50 hover:bg-foreground hover:text-background transition-all"
                    >
                      <a href={l.url} target="_blank" rel="noreferrer">
                        <Link2 className="w-3 h-3" />
                        {l.label}
                      </a>
                    </Button>
                  ))}
                </div>
              )}

              {log.progressUpdate.phase && (
                <div className="flex items-center gap-1.5 opacity-60">
                  <div className="w-1 h-1 rounded-full bg-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {log.progressUpdate.phase}
                  </span>
                </div>
              )}
            </div>
          )}

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
