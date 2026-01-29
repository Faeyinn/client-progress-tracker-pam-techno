import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, History } from "lucide-react";
import { TimelineItem } from "../admin/projects/detail/timeline-item";
import { ProjectLog } from "@/lib/types/project";

import { Skeleton } from "@/components/ui/skeleton";

interface TimelineSectionProps {
  logs: ProjectLog[];
  isLoading?: boolean;
}

export function TimelineSection({ logs, isLoading = false }: TimelineSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background shadow-md">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Timeline Progress
          </h2>
          <p className="text-sm text-muted-foreground">
            Riwayat pekerjaan dan update terbaru
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="relative pl-4 sm:pl-8">
           <div className="absolute left-[31px] sm:left-[47px] top-4 bottom-10 w-0.5 bg-border hidden md:block" />
           <div className="space-y-10">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="relative z-10">
                     <div className="flex gap-4">
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="space-y-2 w-full">
                           <Skeleton className="h-6 w-32" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-16 w-full rounded-md" />
                        </div>
                     </div>
                 </div>
              ))}
           </div>
        </div>
      ) : logs.length === 0 ? (
        <Card className="border border-dashed border-border/60 bg-muted/5">
          <CardContent className="py-16">
            <div className="text-center">
              <FolderKanban className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium text-lg">
                Belum ada progress yang dicatat
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Tim kami akan segera memulai proyek Anda
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative pl-4 sm:pl-8">
          {/* Main Connector Line - Changed to Black/Zinc */}
          <div className="absolute left-[31px] sm:left-[47px] top-4 bottom-10 w-0.5 bg-border hidden md:block" />

          <div className="space-y-10">
            {logs.map((log, index) => (
              <div
                key={log.id}
                className="relative z-10 transition-all duration-500 animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TimelineItem log={log} isLatest={index === 0} index={0} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
