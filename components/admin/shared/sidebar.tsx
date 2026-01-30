"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [projectQuery, setProjectQuery] = React.useState("");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProjectSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const query = projectQuery.trim();

    if (query.length === 0) {
      router.push("/admin/projects");
      return;
    }

    router.push(`/admin/projects?search=${encodeURIComponent(query)}`);
  };

  return (
    <aside className="hidden md:flex h-screen w-72 flex-col fixed left-0 top-0 border-r border-border/60 bg-gradient-to-b from-card/80 via-card/70 to-card/60 backdrop-blur-xl z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-card/80 flex items-center justify-center border border-border/50 overflow-hidden shadow-sm">
            <Image
              src="/logo-pure.png"
              alt="ProgressTracker logo"
              width={24}
              height={24}
              className="h-6 w-6"
              priority
            />
          </div>
          <div className="leading-tight">
            <span className="block font-bold text-base tracking-tight">
              Progress<span className="text-muted-foreground">Tracker</span>
            </span>
            <span className="text-[11px] text-muted-foreground/80 font-medium">
              Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4">
        <p className="px-2 text-[10px] font-semibold tracking-[0.25em] text-muted-foreground/80 uppercase mb-3">
          Navigasi
        </p>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={projectQuery}
            onChange={(event) => setProjectQuery(event.target.value)}
            onKeyDown={handleProjectSearch}
            placeholder="Cari proyek..."
            className="h-9 rounded-xl pl-9 bg-card/80 border-border/50 focus-visible:ring-accent/40"
            aria-label="Cari proyek"
          />
        </div>

        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                  isActive
                    ? "bg-accent/12 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.25)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span title={link.title} className="inline-flex">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                </span>
                {link.title}
              </Link>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 px-2 text-[10px] font-semibold tracking-[0.25em] text-muted-foreground/70 uppercase">
            <span className="flex-1 border-t border-border/40" />
            Workspace
            <span className="flex-1 border-t border-border/40" />
          </div>

          <div className="mt-3 space-y-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-full justify-start rounded-xl bg-muted/40 hover:bg-muted/60"
              onClick={() => router.push("/admin/projects?newProject=true")}
              title="Tambah Proyek"
            >
              <Plus className="w-4 h-4" />
              Tambah Proyek
            </Button>
          </div>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border/50 bg-card/40 space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/70 px-3 py-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 via-muted/40 to-card text-xs font-semibold text-foreground">
            AD
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Admin</p>
            <p className="text-xs text-muted-foreground truncate">Administrator</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </Button>
      </div>
    </aside>
  );
}
