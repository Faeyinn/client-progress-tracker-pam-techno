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
  CreditCard,
  Hash,
  Link as LinkIcon,
} from "lucide-react";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface ProjectInfoCardProps {
  project: Project;
  latestProgress: number;
  copied: boolean;
  onCopyLink: () => void;
}

export function ProjectInfoCard({
  project,
  latestProgress,
  copied,
  onCopyLink,
}: ProjectInfoCardProps) {
  const magicLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/track/${project.uniqueToken}`;

  return (
    <Card className="border border-border/60 shadow-sm bg-card h-full transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Informasi Proyek
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client Info Section */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/30">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Klien
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium text-foreground">{project.clientName}</p>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              WhatsApp
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <p className="font-medium text-foreground">{project.clientPhone}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Details */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Deadline</Label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
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
            <div className="mt-1">
              <Badge
                variant={project.status === "Done" ? "default" : "outline"}
                className={cn(
                  "px-3 py-1",
                  project.status === "Done"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "border-amber-500 text-amber-600 bg-amber-50"
                )}
              >
                {project.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Token & Links */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-2">
              <Hash className="w-3 h-3" /> Unique Token
            </Label>
            <p className="font-mono text-sm font-medium mt-1 bg-muted px-3 py-2 rounded border border-border/50 text-foreground">
              {project.uniqueToken}
            </p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Magic Link
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={magicLink}
                readOnly
                className="text-sm font-mono bg-muted/50"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={onCopyLink}
                className="flex-shrink-0 transition-all active:scale-95"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-[10px] text-emerald-600 mt-1 font-medium animate-in slide-in-from-top-1">
                Link berhasil disalin!
              </p>
            )}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="pt-2">
          <Label className="text-xs text-muted-foreground">Progress Keseluruhan</Label>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-primary">
                {latestProgress}%
              </span>
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${latestProgress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
