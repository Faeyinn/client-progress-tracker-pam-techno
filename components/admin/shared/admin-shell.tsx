"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/shared/sidebar";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/login";

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {!hideSidebar && <Sidebar />}
      <div className={hideSidebar ? "flex-1" : "flex-1 md:ml-64 transition-all duration-300"}>
        {children}
      </div>
    </div>
  );
}
