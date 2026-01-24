"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FolderKanban,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  deadline: string;
  status: "On Progress" | "Done";
  progress: number;
  uniqueToken: string;
  createdAt: string;
}

interface ProjectTableProps {
  projects: Project[];
  isLoading: boolean;
  error: string;
  onDelete: (id: string) => void;
}

// Progress ring component for mobile cards
function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-foreground transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}

// Check if deadline is approaching (within 3 days)
function isDeadlineUrgent(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
}

// Skeleton loading component
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg border border-border/40"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-10 w-10 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded skeleton" />
            <div className="h-3 w-1/2 rounded skeleton" />
          </div>
          <div className="h-6 w-20 rounded-full skeleton" />
        </div>
      ))}
    </div>
  );
}

export function ProjectTable({
  projects,
  isLoading,
  error,
  onDelete,
}: ProjectTableProps) {
  const router = useRouter();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="py-6">
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <FolderKanban className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tidak ada proyek ditemukan
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Coba ubah filter pencarian atau buat proyek baru untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {/* Mobile: Enhanced Card list */}
      <div className="grid gap-2.5 md:hidden">
        {projects.map((project, index) => (
          <Card
            key={project.id}
            className={cn(
              "border-border/50 bg-card shadow-sm cursor-pointer",
              "transition-all duration-300 hover:shadow-md hover:border-border",
              "active:scale-[0.99]",
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => router.push(`/admin/projects/${project.id}`)}
          >
            <CardContent className="p-4">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <ProgressRing progress={project.progress} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-sm font-semibold text-foreground hover:underline transition-colors line-clamp-1"
                    >
                      {project.projectName}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <User className="w-3 h-3 shrink-0" />
                      <span className="truncate">{project.clientName}</span>
                    </div>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Proyek
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setProjectToDelete(project.id)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Status & Deadline Row */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50">
                <Badge
                  variant={project.status === "Done" ? "default" : "outline"}
                  className={cn(
                    "text-xs font-medium",
                    project.status === "Done"
                      ? "bg-foreground text-background"
                      : "border-foreground/30 text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-1.5",
                      project.status === "Done"
                        ? "bg-background"
                        : "bg-foreground/50 animate-pulse",
                    )}
                  />
                  {project.status}
                </Badge>

                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    isDeadlineUrgent(project.deadline) &&
                      project.status !== "Done"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {isDeadlineUrgent(project.deadline) &&
                  project.status !== "Done" ? (
                    <Clock className="w-3 h-3" />
                  ) : (
                    <Calendar className="w-3 h-3" />
                  )}
                  <span>
                    {new Date(project.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Tap hint - subtle indicator that card is clickable */}
              <div className="mt-3 text-center">
                <span className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Ketuk untuk detail
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Enhanced Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Klien
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Proyek
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Deadline
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Progress
              </TableHead>
              <TableHead className="font-semibold text-right text-foreground text-xs uppercase tracking-wider">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project.id}
                className="hover:bg-muted/20 transition-colors group border-b border-border/30 last:border-0 cursor-pointer"
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => router.push(`/admin/projects/${project.id}`)}
              >
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center border border-border/50">
                      <User className="w-4 h-4 text-foreground/60" />
                    </div>
                    <span className="font-medium text-foreground">
                      {project.clientName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-medium text-foreground hover:underline transition-colors inline-flex items-center gap-1 group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.projectName}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      isDeadlineUrgent(project.deadline) &&
                        project.status !== "Done" &&
                        "font-medium",
                    )}
                  >
                    {isDeadlineUrgent(project.deadline) &&
                    project.status !== "Done" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        !(
                          isDeadlineUrgent(project.deadline) &&
                          project.status !== "Done"
                        ) && "text-muted-foreground",
                      )}
                    >
                      {new Date(project.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={project.status === "Done" ? "default" : "outline"}
                    className={cn(
                      "font-medium",
                      project.status === "Done"
                        ? "bg-foreground text-background"
                        : "border-foreground/30 text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1.5",
                        project.status === "Done"
                          ? "bg-background"
                          : "bg-foreground/50 animate-pulse",
                      )}
                    />
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 min-w-40">
                    <div className="flex-1">
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground tabular-nums min-w-10 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Proyek
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setProjectToDelete(project.id)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Proyek
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="sm:max-w-106.25">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-foreground" />
            </div>
            <AlertDialogTitle className="text-center">
              Hapus Proyek?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Tindakan ini tidak dapat dibatalkan. Proyek beserta semua log dan
              feedback akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2">
            <AlertDialogCancel className="sm:w-32">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (projectToDelete) {
                  onDelete(projectToDelete);
                  setProjectToDelete(null);
                }
              }}
              className="sm:w-32 bg-foreground hover:bg-foreground/90 text-background"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
