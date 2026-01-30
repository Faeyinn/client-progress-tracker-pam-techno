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

import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";

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
    <CursorCardsContainer className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <CursorCard
            key={card.title}
            surfaceClassName="bg-card dark:bg-card"
            className={cn(
              "relative overflow-hidden group transition-all duration-700",
              "bg-transparent border-none shadow-[0_4px_20px_oklch(0_0_0_/_0.03)] dark:shadow-none hover:shadow-[0_8px_30px_oklch(0.52_0.17_160_/_0.15)]",
              "rounded-[1rem] hover:-translate-y-0.5",
              // Hide "Selesai" on mobile
              !card.showOnMobile && "hidden sm:block",
            )}
            style={{
              animationDelay: `${index * 150}ms`,
            }}
            primaryHue="oklch(0.58 0.16 158)" // Medium emerald
            secondaryHue="oklch(0.52 0.17 160)" // Rich emerald  
            borderColor="oklch(0.88 0.015 155)" // Sage border
            illuminationColor="oklch(0.52 0.17 160 / 0.2)" // Emerald glow
          >
            {/* Dynamic Background Accent - Inside CursorCard children */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-foreground/5 to-transparent rounded-bl-full group-hover:scale-110 transition-transform duration-700 blur-2xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-foreground/5 to-transparent rounded-tr-full group-hover:scale-110 transition-transform duration-700 blur-2xl opacity-30" />

            <CardContent className="p-3 sm:p-4 relative z-10 flex flex-col justify-between h-full min-h-[90px]">
              <div className="flex items-start justify-between gap-3">
                <div className="p-1.5 rounded-lg bg-muted text-foreground/80 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Status Indicator */}
                <div className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_oklch(0.52_0.17_160_/_0.5)] animate-pulse" />
              </div>

              <div className="space-y-0.5 mt-2">
                {isLoading ? (
                  <div className="h-6 w-12 rounded-md bg-muted/20 animate-pulse" />
                ) : (
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-foreground tabular-nums leading-none">
                    <AnimatedCounter value={card.value} />
                  </h3>
                )}
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-0.5">
                  {card.title}
                </p>
              </div>
            </CardContent>
          </CursorCard>
        );
      })}
    </CursorCardsContainer>
  );
}

// Skeleton loader component for stats
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            // Hide third skeleton on mobile to match actual stats cards
            index === 2 && "hidden sm:block",
          )}
        >
          <div className="h-40 rounded-[2rem] bg-muted/20 animate-pulse border border-border/10" />
        </div>
      ))}
    </div>
  );
}
