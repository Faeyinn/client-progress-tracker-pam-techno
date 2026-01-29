import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Halaman administrasi PAM Techno Progress Tracker",
  robots: {
    index: false,
    follow: false,
  },
};

import { Sidebar } from "@/components/admin/shared/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
