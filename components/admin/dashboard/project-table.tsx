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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

// Check if deadline is approaching (within 7 days)
function isDeadlineUrgent(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
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

  /* Sort State */
  const [sortField, setSortField] = useState<'clientName' | 'projectName' | 'deadline' | 'progress' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  /* Pagination State */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (field: 'clientName' | 'projectName' | 'deadline' | 'progress') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-3.5 h-3.5" /> : 
      <ArrowDown className="w-3.5 h-3.5" />;
  };

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    
    if (sortField === 'deadline') {
      aVal = new Date(a.deadline).getTime();
      bVal = new Date(b.deadline).getTime();
    } else if (sortField === 'progress') {
      aVal = a.progress;
      bVal = b.progress;
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = sortedProjects.slice(startIndex, endIndex);

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
      <div className="text-center py-20 px-4 rounded-[1.5rem] border-2 border-dashed border-border/40 bg-muted/5 mt-4">
        <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6 shadow-inner">
          <FolderKanban className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Belum ada proyek
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
          Mulai tambahkan proyek baru untuk memantau progress dan kolaborasi dengan klien.
        </p>
        <Button
          onClick={() => {
            const newProjectBtn = document.querySelector('[data-new-project-trigger]') as HTMLElement;
            newProjectBtn?.click();
          }}
          className="rounded-full font-bold"
        >
          Buat Proyek Pertama
        </Button>
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
              "border-none bg-card shadow-sm cursor-pointer relative overflow-hidden",
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
                  ? "bg-accent"
                  : "bg-chart-4",
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
                          ? "bg-accent/10 text-accent"
                          : "bg-chart-4/10 text-chart-4",
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
                    className="h-1.5 bg-muted"
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
          surfaceClassName="bg-card dark:bg-card"
          className="overflow-hidden rounded-[1.5rem] shadow-sm"
          primaryHue="oklch(0.58 0.16 158)" // Medium emerald
          secondaryHue="oklch(0.52 0.17 160)" // Rich emerald
          borderColor="oklch(0.88 0.015 155)" // Sage border
          illuminationColor="oklch(0.52 0.17 160 / 0.2)" // Emerald glow
        >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/50 border-b border-border/40">
              <TableHead 
                className="py-5 pl-8 font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('clientName')}
              >
                <div className="flex items-center gap-2">
                  Client
                  {getSortIcon('clientName')}
                </div>
              </TableHead>
              <TableHead 
                className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('projectName')}
              >
                <div className="flex items-center gap-2">
                  Project Name
                  {getSortIcon('projectName')}
                </div>
              </TableHead>
              <TableHead 
                className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('deadline')}
              >
                <div className="flex items-center gap-2">
                  Deadline
                  {getSortIcon('deadline')}
                </div>
              </TableHead>
              <TableHead className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
                Status
              </TableHead>
              <TableHead 
                className="font-black text-xs uppercase tracking-[0.15em] text-muted-foreground/70 w-48 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center gap-2">
                  Progress
                  {getSortIcon('progress')}
                </div>
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
                        ? "text-destructive font-bold"
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
                        ? "bg-accent text-accent-foreground"
                        : "bg-chart-4/10 text-chart-4",
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
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          project.progress === 100
                            ? "bg-accent"
                            : "bg-chart-4",
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
                          className="h-8 w-8 p-0 rounded-full hover:bg-muted"
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/30">
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
                        : "text-muted-foreground hover:bg-muted",
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
          <div className="flex items-center gap-3 bg-card p-2 rounded-full shadow-lg shadow-accent/10 border border-border/50">
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
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto ring-8 ring-destructive/5">
              <Trash2 className="w-8 h-8 text-destructive" />
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
            <AlertDialogCancel className="w-full rounded-xl h-12 border-none bg-muted font-bold hover:bg-muted/80 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (projectToDelete) {
                  onDelete(projectToDelete);
                  setProjectToDelete(null);
                }
              }}
              className="w-full rounded-xl h-12 bg-destructive hover:bg-destructive/90 font-bold text-destructive-foreground shadow-lg shadow-destructive/20"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
