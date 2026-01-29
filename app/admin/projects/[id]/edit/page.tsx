"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenLine } from "lucide-react";
import { EditProjectForm } from "@/components/admin/projects/edit/edit-project-form";
import { Project } from "@/lib/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        setError("Gagal memuat data proyek");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/10">
        <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-6">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border border-border/60 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full rounded-lg" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error || "Proyek tidak ditemukan"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href={`/admin/projects/${projectId}`}
                className="transition-transform hover:-translate-x-1"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-white border border-border/50 p-1">
                  <Image
                    src="/logo-pure.png"
                    alt="Project Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    Edit Proyek
                    <PenLine className="w-4 h-4 text-muted-foreground" />
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {project.projectName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditProjectForm project={project} />
      </main>
    </div>
  );
}
