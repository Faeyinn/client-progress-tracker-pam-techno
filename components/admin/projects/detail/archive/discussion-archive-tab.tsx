"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus2, Link2, Trash2, ExternalLink, Download } from "lucide-react";
import { useArtifacts } from "@/components/admin/projects/hooks/detail/use-artifacts";
import { ARTIFACT_TYPES, PROJECT_PHASES } from "@/lib/project-phase";
import type { ArtifactType, ProjectPhase } from "@/lib/types/project";

type UploadMode = "file" | "link";

export function DiscussionArchiveTab({ projectId }: { projectId: string }) {
  const { artifacts, isLoading, error, createArtifact, deleteArtifact } =
    useArtifacts(projectId);

  const [open, setOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<ProjectPhase>("DISCOVERY");
  const [type, setType] = useState<ArtifactType>("WIREFRAME");
  const [sourceLinkUrl, setSourceLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (uploadMode === "file") return Boolean(file);
    return /^https?:\/\//i.test(sourceLinkUrl.trim());
  }, [title, uploadMode, file, sourceLinkUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const form = new FormData();
      form.set("title", title);
      form.set("description", description);
      form.set("phase", phase);
      form.set("type", type);

      if (uploadMode === "file" && file) {
        form.set("file", file);
      } else {
        form.set("sourceLinkUrl", sourceLinkUrl.trim());
      }

      await createArtifact(form);
      toast.success("Artifact berhasil disimpan");

      setOpen(false);
      setTitle("");
      setDescription("");
      setSourceLinkUrl("");
      setFile(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan artifact",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteArtifact(id);
      toast.success("Artifact dihapus");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Discussion Archive
          </h2>
          <p className="text-xs text-muted-foreground">
            Simpan wireframe, flow, dan notes meeting agar klien bisa melihat.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-foreground/10 bg-foreground hover:bg-foreground/90 text-background gap-2">
              <FilePlus2 className="w-4 h-4" />
              <span>Tambah Artifact</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Artifact</DialogTitle>
              <DialogDescription>
                Upload file atau simpan link (Figma, docs, dsb.).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Judul *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Phase *</Label>
                  <Select
                    value={phase}
                    onValueChange={(v) => setPhase(v as ProjectPhase)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_PHASES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as ArtifactType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTIFACT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Upload Mode</Label>
                  <Select
                    value={uploadMode}
                    onValueChange={(v) => setUploadMode(v as UploadMode)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file">Upload file</SelectItem>
                      <SelectItem value="link">Add link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {uploadMode === "file" ? (
                <div className="space-y-2">
                  <Label>File *</Label>
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    File disimpan di database (cocok untuk file kecil-menengah).
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Link URL *</Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="https://..."
                      value={sourceLinkUrl}
                      onChange={(e) => setSourceLinkUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!canSubmit || submitting}
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Card className="border-dashed border-2">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="border border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-5 w-1/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : artifacts.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Belum ada artifact.
            </CardContent>
          </Card>
        ) : (
          artifacts.map((a) => (
            <Card key={a.id} className="border border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">
                      {a.title}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-muted">
                        {a.phase}
                      </span>
                      {a.type && (
                        <span className="px-2 py-0.5 rounded-full bg-muted">
                          {a.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(a.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {a.description && (
                  <p className="text-sm text-muted-foreground">
                    {a.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {a.fileUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <a href={a.fileUrl} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </Button>
                  )}
                  {a.sourceLinkUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <a
                        href={a.sourceLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" /> Open Link
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
