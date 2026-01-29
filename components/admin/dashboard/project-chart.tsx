"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { Project } from "@/lib/types/project";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  isSameMonth,
} from "date-fns";
import { id } from "date-fns/locale";

interface ProjectChartProps {
  projects: Project[];
}

export function ProjectChart({ projects }: ProjectChartProps) {
  // Aggregate data by month for the last 6 months
  const chartData = useMemo(() => {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 5); // Interval of 6 months

    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(today),
    });

    return months.map((month) => {
      const monthProjects = projects.filter((project) => {
        const projectDate = new Date(project.createdAt);
        return isSameMonth(projectDate, month);
      });

      const total = monthProjects.length;
      const completed = monthProjects.filter((p) => p.status === "Done").length;

      return {
        name: format(month, "MMM", { locale: id }), // Jan, Feb, Mar (Indonesian)
        fullName: format(month, "MMMM yyyy", { locale: id }),
        total,
        completed,
      };
    });
  }, [projects]);

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-white dark:bg-zinc-900"
        className="rounded-[1.5rem] shadow-lg shadow-zinc-200/50 dark:shadow-none mb-8"
        primaryHue="#E4E4E7" // Zinc 200
        secondaryHue="#52525B" // Zinc 600
        borderColor="#F4F4F5" // Zinc 100
        illuminationColor="#FFFFFF20"
      >
        <CardHeader className="pt-4 pb-4">
          <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
            Overview Aktivitas
          </CardTitle>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Proyek Dibuat vs Selesai (6 Bulan Terakhir)
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52525B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#52525B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#A1A1AA" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#A1A1AA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#27272a"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataItem = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border bg-background/80 backdrop-blur-sm p-3 shadow-xl">
                          <p className="text-xs font-bold text-foreground mb-2 opacity-70">
                            {dataItem.fullName}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-muted-foreground font-bold">
                                Total Dibuat
                              </span>
                              <span className="text-lg font-bold text-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-green-600/70 dark:text-green-400/70 font-bold">
                                Selesai
                              </span>
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#52525B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#A1A1AA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
