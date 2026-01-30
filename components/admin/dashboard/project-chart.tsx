"use client";

import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
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
  subYears,
} from "date-fns";
import { id } from "date-fns/locale";

interface ProjectChartProps {
  projects: Project[];
}

export function ProjectChart({ projects }: ProjectChartProps) {
  const [monthRange, setMonthRange] = useState(6);

  // Aggregate data by month for the selected range
  const chartData = useMemo(() => {
    const today = new Date();
    const rangeStartDate = subMonths(today, monthRange - 1);

    const months = eachMonthOfInterval({
      start: startOfMonth(rangeStartDate),
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
  }, [projects, monthRange]);

  const rangeOptions = [
    { label: "3 Bulan", value: 3 },
    { label: "6 Bulan", value: 6 },
    { label: "1 Tahun", value: 12 },
  ];

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-card dark:bg-card"
        className="rounded-[1.5rem] shadow-lg shadow-accent/10 dark:shadow-none mb-8"
        primaryHue="oklch(0.58 0.16 158)" // Medium emerald
        secondaryHue="oklch(0.52 0.17 160)" // Rich emerald
        borderColor="oklch(0.88 0.015 155)" // Sage border
        illuminationColor="oklch(0.52 0.17 160 / 0.2)" // Emerald glow
      >
        <CardHeader className="pt-4 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
              Overview Aktivitas
            </CardTitle>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
              Proyek Dibuat vs Selesai
            </p>
          </div>

          {/* Date Range Buttons */}
          <div className="flex gap-2 flex-wrap">
            {rangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={monthRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setMonthRange(option.value)}
                className="text-xs font-bold"
              >
                {option.label}
              </Button>
            ))}
          </div>
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
                  {/* Emerald gradient for total projects */}
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.52 0.17 160)" stopOpacity={0.7} />
                    <stop offset="50%" stopColor="oklch(0.58 0.16 158)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.14 155)" stopOpacity={0} />
                  </linearGradient>
                  {/* Gold gradient for completed projects */}
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="oklch(0.72 0.15 85)" stopOpacity={0.7} />
                    <stop offset="50%" stopColor="oklch(0.75 0.14 85)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.78 0.10 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(0.45 0.02 155)"
                  opacity={0.15}
                />
                <XAxis
                  dataKey="name"
                  stroke="oklch(0.45 0.02 155)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke="oklch(0.45 0.02 155)"
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
                        <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl">
                          <p className="text-xs font-bold text-foreground mb-3 opacity-70">
                            {dataItem.fullName}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wide">
                                Total Dibuat
                              </span>
                              <span className="text-xl font-black text-accent">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-chart-5/80 font-bold tracking-wide">
                                Selesai
                              </span>
                              <span className="text-xl font-black text-chart-5">
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
                  stroke="oklch(0.52 0.17 160)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="oklch(0.72 0.15 85)"
                  strokeWidth={2.5}
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
