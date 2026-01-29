"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Link2, ImageIcon } from "lucide-react";
import { useProgressUpdates } from "@/components/admin/projects/hooks/detail/use-progress-updates";
import { PROJECT_PHASES } from "@/lib/project-phase";
import type { ProjectPhase } from "@/lib/types/project";

type LinkRow = { label: string; url: string };

export function ProgressUpdatesTab({ projectId }: { projectId: string }) {
  const { updates, isLoading, error, createUpdate, deleteUpdate } =
    useProgressUpdates(projectId);

  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<ProjectPhase | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => description.trim().length > 0, [description]);

  function addLinkRow() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLinkRow(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const form = new FormData();
      form.set("description", description.trim());
      if (phase) form.set("phase", phase);

      const sanitizedLinks = links
        .map((l) => ({ label: l.label.trim() || "Link", url: l.url.trim() }))
        .filter((l) => /^https?:\/\//i.test(l.url));
      form.set("links", JSON.stringify(sanitizedLinks));

      for (const img of images) {
        form.append("images", img);
      }

      await createUpdate(form);
      toast.success("Update berhasil dipost");

      setDescription("");
      setPhase("");
      setImages([]);
      setLinks([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat update");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(updateId: string) {
    try {
      await deleteUpdate(updateId);
      toast.success("Update dihapus");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1 px-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Visual Progress Updates
        </h2>
        <p className="text-xs text-muted-foreground">
          Post update dengan screenshot dan link preview/staging/Figma.
        </p>
      </div>

      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Post Update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Deskripsi *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Contoh: Implementasi halaman login + integrasi API"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Phase</Label>
                <Select
                  value={phase || "NO_PHASE"}
                  onValueChange={(v) =>
                    setPhase(v === "NO_PHASE" ? "" : (v as ProjectPhase))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="(Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO_PHASE">(None)</SelectItem>
                    {PROJECT_PHASES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setImages(Array.from(e.target.files || []))
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Screenshot disimpan di database.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Links</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLinkRow}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Link
                </Button>
              </div>

              {links.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Tambahkan link ke preview (ngrok), staging, atau Figma.
                </p>
              ) : (
                <div className="space-y-2">
                  {links.map((l, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                    >
                      <Input
                        className="sm:col-span-2"
                        placeholder="Label (e.g., Staging)"
                        value={l.label}
                        onChange={(e) =>
                          setLinks((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, label: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <div className="sm:col-span-3 flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            className="pl-10"
                            placeholder="https://..."
                            value={l.url}
                            onChange={(e) =>
                              setLinks((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, url: e.target.value } : x,
                                ),
                              )
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLinkRow(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full"
              >
                {submitting ? "Posting..." : "Post Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[95%]" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-24 w-32 rounded-lg" />
                    <Skeleton className="h-24 w-32 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : updates.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Belum ada update.
            </CardContent>
          </Card>
        ) : (
          updates.map((u) => (
            <Card key={u.id} className="border border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base">
                      {u.phase || "UPDATE"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(u.createdAt), "PPpp")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(u.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{u.description}</p>

                {u.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {u.images.map((img) => (
                      <a
                        key={img.id}
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                          <Image
                            src={img.url}
                            alt={img.fileName || "Progress image"}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover group-hover:scale-[1.02] transition-transform"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {u.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {u.links.map((l) => (
                      <Button
                        key={l.id}
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <a href={l.url} target="_blank" rel="noreferrer">
                          <ImageIcon className="w-4 h-4" /> {l.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
