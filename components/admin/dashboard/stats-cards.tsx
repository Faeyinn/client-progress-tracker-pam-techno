import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    onProgress: number;
    done: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Proyek Card */}
      <Card className="border-border/60 shadow-sm bg-card relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Proyek
              </p>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {stats.total}
              </h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* On Progress Card */}
      <Card className="border-border/60 shadow-sm bg-card relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                On Progress
              </p>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {stats.onProgress}
              </h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {/* Removed dummy stats */}
        </CardContent>
      </Card>

      {/* Selesai Card */}
      <Card className="border-border/60 shadow-sm bg-card relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Selesai
              </p>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {stats.done}
              </h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          {/* Removed dummy stats */}
        </CardContent>
      </Card>
    </div>
  );
}
