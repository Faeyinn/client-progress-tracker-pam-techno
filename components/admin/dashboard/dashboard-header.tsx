"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105">
            <div className="absolute inset-0 bg-foreground/5 rounded-xl" />
            <Image
              src="/logo-pure.png"
              alt="PAM Techno Logo"
              fill
              sizes="40px"
              className="object-contain p-1.5"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight tracking-tight">
              Progress Tracker
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium hidden sm:block">
              PAM Techno Admin
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted h-9 w-9 ml-1"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-foreground/5 border border-border",
                    "transition-all duration-200 hover:bg-foreground/10",
                  )}
                >
                  <User className="w-4 h-4 text-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-1"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs text-muted-foreground">
                    admin@pamtechno.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/profile"
                  className="cursor-pointer flex items-center"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Lihat Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
