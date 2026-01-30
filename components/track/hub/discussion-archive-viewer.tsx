"use client";
import Image from "next/image";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ExternalLink } from "lucide-react";
import type { DiscussionArtifact, ProjectPhase } from "@/lib/types/project";
import { PROJECT_PHASES } from "@/lib/project-phase";

import { Skeleton } from "@/components/ui/skeleton";

export function DiscussionArchiveViewer({
  artifacts,
  isLoading = false,
}: {
  artifacts: DiscussionArtifact[];
  isLoading?: boolean;
}) {
  const [phase, setPhase] = useState<ProjectPhase | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (phase === "ALL") return artifacts;
    return artifacts.filter((a) => a.phase === phase);
  }, [artifacts, phase]);

  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Discussion Archive</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Wireframe, user flow, meeting notes, dan artifact penting lainnya.
            </p>
          </div>

          <div className="w-44">
            <Select
              value={phase}
              onValueChange={(v) =>
                setPhase(v === "ALL" ? "ALL" : (v as ProjectPhase))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All phases</SelectItem>
                {PROJECT_PHASES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border/60 bg-card p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Belum ada artifact.
          </div>
        ) : (
          filtered.map((a) => {
            // Check if it's an image
            const isImage =
              a.mimeType?.startsWith("image/") ||
              a.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

            return (
              <div
                key={a.id}
                className="rounded-lg border border-border/60 bg-card p-4 hover:border-foreground/20 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {isImage && a.fileUrl && (
                    <div className="shrink-0 w-24 h-24 relative rounded-md overflow-hidden bg-muted border border-border/50">
                      <Image
                        src={a.fileUrl}
                        alt={a.fileName || "Document thumbnail"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 96px, 96px"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate text-foreground">
                          {a.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex gap-2 flex-wrap items-center">
                          <span className="px-2 py-0.5 rounded-full bg-muted font-medium text-[10px] uppercase tracking-wider">
                            {a.phase}
                          </span>
                          {a.type && (
                            <span className="px-2 py-0.5 rounded-full bg-muted font-medium text-[10px] uppercase tracking-wider">
                              {a.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {a.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {a.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {a.fileUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2 h-8 text-xs"
                        >
                          <a href={a.fileUrl} target="_blank" rel="noreferrer">
                            <Download className="w-3.5 h-3.5" />
                            {isImage ? "View Full Image" : "Download File"}
                          </a>
                        </Button>
                      )}
                      {a.sourceLinkUrl && !a.fileName && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2 h-8 text-xs"
                        >
                          <a
                            href={a.sourceLinkUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open Link
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
