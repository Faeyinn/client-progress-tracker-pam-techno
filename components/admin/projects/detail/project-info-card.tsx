"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  CheckCircle,
  User,
  Phone,
  Briefcase,
  Calendar,
  Hash,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface ProjectInfoCardProps {
  project: Project;
  latestProgress: number;
  copied: boolean;
  onCopyLink: () => void;
}

// Circular progress component
function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
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
          className="text-foreground transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight tabular-nums">
          {progress}%
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Selesai
        </span>
      </div>
    </div>
  );
}

// ... imports
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ... circular progress component

export function ProjectInfoCard({
  project,
  latestProgress,
  copied,
  onCopyLink,
}: ProjectInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const magicLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/track/${project.uniqueToken}`;

  return (
    <Card className="border-border/50 shadow-sm bg-card transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-foreground" />
            </div>
            Informasi Proyek
          </CardTitle>

          {/* Mobile Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-xs h-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Tutup" : "Detail"}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Critical Info - Always Visible */}
        <div className="flex justify-center py-2">
          <CircularProgress progress={latestProgress} />
        </div>

        {/* Collapsible Section on Mobile / Always Visible on Desktop */}
        <div
          className={cn(
            "space-y-6 lg:block transition-all duration-300 ease-in-out overflow-hidden",
            isExpanded
              ? "max-h-[800px] opacity-100"
              : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100",
          )}
        >
          <Separator className="bg-border/50" />

          {/* Client Info Section */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50">
            <div>
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Klien
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center border border-border/50">
                  <User className="w-4 h-4 text-foreground/70" />
                </div>
                <p className="font-medium text-foreground">
                  {project.clientName}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                WhatsApp
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center border border-border/50">
                  <Phone className="w-4 h-4 text-foreground/70" />
                </div>
                <a
                  href={`https://wa.me/${project.clientPhone.replace(/^0/, "62")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:underline transition-colors flex items-center gap-1"
                >
                  {project.clientPhone}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Project Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Deadline</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1.5">
                <Badge
                  variant={project.status === "Done" ? "default" : "outline"}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium",
                    project.status === "Done"
                      ? "bg-foreground text-background"
                      : "border-foreground/30 text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-2",
                      project.status === "Done"
                        ? "bg-background"
                        : "bg-foreground/50 animate-pulse",
                    )}
                  />
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Token & Links */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Hash className="w-3 h-3" /> Token Unik
              </Label>
              <p className="font-mono text-xs font-medium mt-1.5 bg-muted px-3 py-2.5 rounded-lg border border-border/50 text-foreground tracking-wide">
                {project.uniqueToken}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <LinkIcon className="w-3 h-3" /> Magic Link
              </Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  value={magicLink}
                  readOnly
                  className="text-xs font-mono bg-muted/50 h-10 border-border/50"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={onCopyLink}
                  className={cn(
                    "flex-shrink-0 h-10 w-10 transition-all active:scale-95",
                    copied && "border-foreground bg-foreground/10",
                  )}
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-foreground" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  copied ? "max-h-6 opacity-100 mt-1.5" : "max-h-0 opacity-0",
                )}
              >
                <p className="text-[10px] text-foreground/70 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Link berhasil disalin!
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
