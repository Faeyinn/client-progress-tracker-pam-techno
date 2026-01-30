"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Proyek",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r border-border/40 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-950 flex items-center justify-center border border-border/40 overflow-hidden">
            <Image
              src="/logo-pure.png"
              alt="ProgressTracker logo"
              width={24}
              height={24}
              className="h-6 w-6"
              priority
            />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Progress<span className="text-muted-foreground">Tracker</span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3">
        <p className="px-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/80 uppercase mb-3">
          Menu
        </p>
        <div className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60",
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-900 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-opacity",
                  isActive ? "opacity-100 bg-zinc-900 dark:bg-zinc-100" : "opacity-0",
                )}
              />
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {link.title}
            </Link>
          );
        })}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border/40">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </div>
    </aside>
  );
}
