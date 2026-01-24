"use client";

import Link from "next/link";
import { User, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";

export default function AdminProfilePage() {
  // In a real app, you would fetch the user session here.
  // For now, we display the seeded admin user.
  const user = {
    username: "jaeyi",
    role: "Super Admin",
    joinDate: "Januari 2026",
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/admin/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Profil Admin
        </h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-card/50">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user.username}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal Bergabung
                  </label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user.joinDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
