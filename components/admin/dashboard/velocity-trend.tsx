"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
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

interface VelocityTrendProps {
  projects: Project[];
}

export function VelocityTrend({ projects }: VelocityTrendProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 5);

    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(today),
    });

    return months.map((month) => {
      const monthProjects = projects.filter((project) => {
        const projectDate = new Date(project.createdAt);
        return isSameMonth(projectDate, month);
      });

      // Velocity: projects completed in this month
      const velocity = monthProjects.filter((p) => p.status === "Done").length;

      // Average progress of projects created this month
      const avgProgress = monthProjects.length > 0
        ? Math.round(monthProjects.reduce((sum, p) => sum + p.progress, 0) / monthProjects.length)
        : 0;

      return {
        name: format(month, "MMM", { locale: id }),
        fullName: format(month, "MMMM yyyy", { locale: id }),
        velocity,
        avgProgress,
      };
    });
  }, [projects]);

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-white dark:bg-zinc-900"
        className="rounded-[1.5rem] shadow-lg shadow-zinc-200/50 dark:shadow-none"
        primaryHue="#E4E4E7"
        secondaryHue="#52525B"
        borderColor="#F4F4F5"
        illuminationColor="#FFFFFF20"
      >
        <CardHeader className="pt-4 pb-4">
          <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
            Tren Produktivitas
          </CardTitle>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
            Kecepatan Penyelesaian vs Rata-rata Progress
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
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
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataItem = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border bg-background/80 backdrop-blur-sm p-3 shadow-xl">
                          <p className="text-xs font-bold text-foreground mb-2 opacity-70">
                            {dataItem.fullName}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-cyan-600/70 dark:text-cyan-400/70 font-bold">
                                Velocity
                              </span>
                              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                                {payload[0].value} proj
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-purple-600/70 dark:text-purple-400/70 font-bold">
                                Avg Progress
                              </span>
                              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {payload[1].value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="velocity"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Kecepatan Penyelesaian"
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="avgProgress"
                  stroke="#A855F7"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Rata-rata Progress (%)"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
