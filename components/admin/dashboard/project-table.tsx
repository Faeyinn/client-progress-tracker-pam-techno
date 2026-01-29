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
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
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

  /* Pagination State */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
      "bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
      "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      "bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-400",
      "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
      "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

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
      <div className="text-center py-20 px-4 rounded-[1.5rem] border border-dashed border-border/40 bg-muted/5 mt-4">
        <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <FolderKanban className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Belum ada proyek
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Mulai tambahkan proyek baru untuk memantau progress dan kolaborasi
          dengan klien.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Mobile: Enhanced Card list */}
      <div className="grid gap-4 md:hidden">
        {currentProjects.map((project, index) => (
          <Card
            key={project.id}
            className={cn(
              "border-none bg-zinc-50 dark:bg-zinc-900 shadow-sm cursor-pointer relative overflow-hidden",
              "transition-all duration-300 hover:shadow-lg active:scale-[0.98]",
              "rounded-[1.5rem]",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => router.push(`/admin/projects/${project.id}`)}
          >
            {/* Status Indicator Stripe */}
            <div
              className={cn(
                "absolute top-0 bottom-0 left-0 w-1.5",
                project.status === "Done"
                  ? "bg-zinc-800 dark:bg-zinc-200"
                  : "bg-green-500",
              )}
            />

            <CardContent className="p-5 pl-7">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[9px] font-black uppercase tracking-wider h-5 px-2 rounded-md",
                        project.status === "Done"
                          ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
                      )}
                    >
                      {project.status === "Done" ? "Selesai" : "On Progress"}
                    </Badge>
                    {isDeadlineUrgent(project.deadline) &&
                      project.status !== "Done" && (
                        <Badge
                          variant="destructive"
                          className="h-5 px-2 text-[9px] uppercase tracking-wider rounded-md"
                        >
                          Urgent
                        </Badge>
                      )}
                  </div>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="text-lg font-bold text-foreground hover:underline transition-colors line-clamp-1 block mb-1"
                  >
                    {project.projectName}
                  </Link>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold shadow-sm",
                        getAvatarColor(project.clientName),
                      )}
                    >
                      {getInitials(project.clientName)}
                    </div>
                    <span className="truncate">{project.clientName}</span>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 -mr-2 text-muted-foreground hover:text-foreground rounded-full"
                      >
                        <MoreVertical className="w-5 h-5" />
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

              {/* Stats Row */}
              <div className="flex items-center gap-4 py-3 border-t border-dashed border-border/60">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    Deadline
                  </span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="w-px h-8 bg-border/60" />

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                      Progress
                    </span>
                    <span className="text-[10px] font-bold text-foreground">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress
                    value={project.progress}
                    className="h-1.5 bg-zinc-100 dark:bg-zinc-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Enhanced Table */}
      <CursorCardsContainer className="hidden md:block">
        <CursorCard
          surfaceClassName="bg-white dark:bg-zinc-950/50"
          className="overflow-hidden rounded-[1.5rem] shadow-sm"
          primaryHue="#E4E4E7" // Zinc 200
          secondaryHue="#52525B" // Zinc 600
          borderColor="#F4F4F5" // Zinc 100
          illuminationColor="#FFFFFF20"
        >
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/80 border-b border-border/40">
              <TableHead className="py-5 pl-8 font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
                Client
              </TableHead>
              <TableHead className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
                Project Name
              </TableHead>
              <TableHead className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
                Deadline
              </TableHead>
              <TableHead className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
                Status
              </TableHead>
              <TableHead className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70 w-48">
                Progress
              </TableHead>
              <TableHead className="font-black text-right pr-8 text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.map((project, index) => (
              <TableRow
                key={project.id}
                className="hover:bg-muted/30 transition-all duration-200 group border-b border-border/30 last:border-0 cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => router.push(`/admin/projects/${project.id}`)}
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-zinc-950",
                        getAvatarColor(project.clientName),
                      )}
                    >
                      {getInitials(project.clientName)}
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                      {project.clientName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.projectName}
                  </Link>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      isDeadlineUrgent(project.deadline) &&
                        project.status !== "Done"
                        ? "text-red-500 font-bold"
                        : "text-muted-foreground font-medium",
                    )}
                  >
                    {isDeadlineUrgent(project.deadline) &&
                    project.status !== "Done" ? (
                      <Clock className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Calendar className="w-4 h-4 opacity-50" />
                    )}
                    <span>
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
                    variant="outline"
                    className={cn(
                      "text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg border-none shadow-sm",
                      project.status === "Done"
                        ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    )}
                  >
                    {project.status === "Done" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                    )}
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 w-full pr-8">
                    <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          project.progress === 100
                            ? "bg-zinc-900 dark:bg-zinc-100"
                            : "bg-green-500",
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground tabular-nums min-w-[2rem] text-right">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-right pr-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="cursor-pointer font-medium"
                          >
                            <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="cursor-pointer font-medium"
                          >
                            <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                            Edit Proyek
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setProjectToDelete(project.id)}
                          className="text-destructive focus:text-destructive cursor-pointer font-medium bg-destructive/5 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus Proyek
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-zinc-50/30 dark:bg-zinc-900/30">
            <p className="text-xs text-muted-foreground font-medium">
              Menampilkan{" "}
              <strong>
                {startIndex + 1}-{Math.min(endIndex, projects.length)}
              </strong>{" "}
              dari <strong>{projects.length}</strong> proyek
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs font-bold rounded-lg"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-6 h-6 rounded-md text-[10px] font-bold transition-all",
                      currentPage === i + 1
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-8 text-xs font-bold rounded-lg"
              >
                Next
              </Button>
            </div>
          </div>
        )}
        </CursorCard>
      </CursorCardsContainer>

      {/* Mobile Pagination (Simplified) */}
      <div className="md:hidden flex justify-center mt-6">
        {totalPages > 1 && (
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-full shadow-lg shadow-zinc-200/50 dark:shadow-none border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-full"
            >
              <ArrowUpRight className="w-4 h-4 rotate-[-135deg]" />
            </Button>
            <span className="text-xs font-bold tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-full"
            >
              <ArrowUpRight className="w-4 h-4 rotate-45" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="sm:max-w-[360px] p-6 rounded-[2rem] gap-6">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mx-auto ring-8 ring-red-50/50 dark:ring-red-900/5">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-black tracking-tight">
                Hapus Proyek?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center max-w-[280px] mx-auto text-muted-foreground font-medium">
                Tindakan ini permanen. Semua data proyek termasuk log akan
                hilang.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 grid grid-cols-2">
            <AlertDialogCancel className="w-full rounded-xl h-12 border-none bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (projectToDelete) {
                  onDelete(projectToDelete);
                  setProjectToDelete(null);
                }
              }}
              className="w-full rounded-xl h-12 bg-red-500 hover:bg-red-600 font-bold text-white shadow-lg shadow-red-500/20"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
