"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLog {
  id: string;
  projectId: string;
  title: string;
  description: string;
  percentage: number;
  createdAt: string;
  project: {
    projectName: string;
    clientName: string;
    status: string;
  };
}

export function RecentActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activities");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-white dark:bg-zinc-900"
        className="rounded-[1.5rem] shadow-lg shadow-zinc-200/50 dark:shadow-none h-full"
        primaryHue="#E4E4E7"
        secondaryHue="#52525B"
        borderColor="#F4F4F5"
        illuminationColor="#FFFFFF20"
      >
        <CardHeader className="pt-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
              Aktivitas
            </CardTitle>
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
            Log Terbaru
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="max-h-[350px] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
                      <div className="h-2 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-2">
                  <AlertCircle className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">Tidak ada aktivitas</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {logs.map((log) => {
                  const isDone = log.percentage === 100;
                  const Icon = isDone ? CheckCircle2 : TrendingUp;

                  return (
                    <div
                      key={log.id}
                      className="py-4 first:pt-0 last:pb-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 -mx-2 px-2 rounded transition-colors"
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                            isDone
                              ? "bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                              : "bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400",
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <p className="text-sm font-medium leading-none text-foreground truncate">
                            <span className="font-bold">
                              {log.project.projectName}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {log.description || log.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                              {log.percentage}%
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 tabular-nums whitespace-nowrap">
                              {formatDistanceToNow(new Date(log.createdAt), {
                                addSuffix: true,
                                locale: id,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
