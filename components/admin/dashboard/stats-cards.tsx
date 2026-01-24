"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    total: number;
    onProgress: number;
    done: number;
  };
  isLoading?: boolean;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 1000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) {
      const frame = requestAnimationFrame(() => setCount(0));
      return () => cancelAnimationFrame(frame);
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading?: boolean;
  index: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
  index,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden group transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "border-border/50 bg-card",
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-foreground/2 rounded-bl-[100px] group-hover:bg-foreground/4 transition-colors" />

      <CardContent className="p-5 sm:p-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground tracking-wide">
              {title}
            </p>
            {isLoading ? (
              <div className="h-9 w-16 rounded-lg skeleton" />
            ) : (
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                <AnimatedCounter value={value} />
              </h3>
            )}
          </div>

          <div className="p-3 rounded-xl bg-foreground/5 group-hover:bg-foreground/10 transition-all duration-300 group-hover:scale-110">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/70" />
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-4 h-0.5 rounded-full bg-foreground/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground/20 transition-all duration-700 ease-out"
            style={{
              width: isLoading ? "0%" : "100%",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Proyek",
      value: stats.total,
      icon: FolderKanban,
      showOnMobile: true,
    },
    {
      title: "Dalam Progress",
      value: stats.onProgress,
      icon: Clock,
      showOnMobile: true,
    },
    {
      title: "Selesai",
      value: stats.done,
      icon: CheckCircle2,
      showOnMobile: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={cn(
            // Hide "Selesai" on mobile
            !card.showOnMobile && "hidden sm:block",
          )}
        >
          <StatCard {...card} isLoading={isLoading} index={index} />
        </div>
      ))}
    </div>
  );
}

// Skeleton loader component for stats
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            // Hide third skeleton on mobile to match actual stats cards
            index === 2 && "hidden sm:block",
          )}
        >
          <Card className="border-border/50 bg-card">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-4 w-24 rounded skeleton" />
                  <div className="h-9 w-16 rounded-lg skeleton" />
                </div>
                <div className="h-12 w-12 rounded-xl skeleton" />
              </div>
              <div className="mt-4 h-0.5 rounded-full skeleton" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
