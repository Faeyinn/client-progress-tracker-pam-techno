import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban } from "lucide-react";
import { TimelineItem } from "./timeline-item";

import { ProjectLog } from "@/lib/types/project";

interface TimelineViewProps {
  logs: ProjectLog[];
}

export function TimelineView({ logs }: TimelineViewProps) {
  if (logs.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-lg bg-white">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada log progress</p>
            <p className="text-sm text-gray-400 mt-1">
              Klik "Tambah Log" untuk menambahkan progress pertama
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sky-500" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {logs.map((log, index) => (
              <TimelineItem key={log.id} log={log} isLatest={index === 0} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
