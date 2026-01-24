"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { TimelineItem } from "./timeline-item";
import { ProjectLog } from "@/lib/types/project";

interface TimelineViewProps {
  logs: ProjectLog[];
}

export function TimelineView({ logs }: TimelineViewProps) {
  if (logs.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">Belum ada log progress</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Klik &quot;Tambah Log&quot; untuk menambahkan progress pertama
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm bg-card">
      <CardContent className="pt-6 pb-2">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-foreground via-foreground/30 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-6">
            {logs.map((log, index) => (
              <TimelineItem
                key={log.id}
                log={log}
                isLatest={index === 0}
                index={index}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
