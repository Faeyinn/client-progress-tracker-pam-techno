"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Send,
  FileText,
  Percent,
  MessageSquare,
  Bell,
  ImageIcon,
  Link2,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useAddLog } from "@/components/admin/projects/hooks/detail/use-add-log";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_PHASES } from "@/lib/project-phase";
import { useState } from "react";

interface AddLogFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function AddLogForm({
  projectId,
  onSuccess,
  onCancel,
}: AddLogFormProps) {
  const { isSubmitting, logForm, setLogForm, handleSubmit } = useAddLog(
    projectId,
    onSuccess,
  );
  const [showVisuals, setShowVisuals] = useState(false);

  const addLink = () => {
    setLogForm({
      ...logForm,
      links: [...logForm.links, { label: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    setLogForm({
      ...logForm,
      links: logForm.links.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    setLogForm({
      ...logForm,
      links: logForm.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar"
    >
      {/* Basic Log Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-xs font-black uppercase tracking-widest text-muted-foreground"
          >
            Judul Progress <span className="text-destructive">*</span>
          </Label>
          <div className="relative group">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              id="title"
              placeholder="Contoh: Milestone 1 Selesai"
              value={logForm.title}
              onChange={(e) =>
                setLogForm({ ...logForm, title: e.target.value })
              }
              required
              disabled={isSubmitting}
              className="pl-10 h-11 bg-background border-border/50 focus:border-foreground/30 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-xs font-black uppercase tracking-widest text-muted-foreground"
          >
            Detail Pekerjaan <span className="text-destructive">*</span>
          </Label>
          <div className="relative group">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Textarea
              id="description"
              placeholder="Jelaskan apa saja yang sudah dikerjakan..."
              value={logForm.description}
              onChange={(e) =>
                setLogForm({ ...logForm, description: e.target.value })
              }
              rows={3}
              required
              disabled={isSubmitting}
              className="pl-10 pt-2.5 resize-none bg-background border-border/50 focus:border-foreground/30 transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="percentage"
              className="text-xs font-black uppercase tracking-widest text-muted-foreground"
            >
              Progress (%) <span className="text-destructive">*</span>
            </Label>
            <div className="relative group">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                placeholder="75"
                value={logForm.percentage}
                onChange={(e) =>
                  setLogForm({ ...logForm, percentage: e.target.value })
                }
                required
                disabled={isSubmitting}
                className="pl-10 h-11 bg-background border-border/50 focus:border-foreground/30 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Preview
            </Label>
            <div className="h-11 flex items-center px-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-500"
                  style={{
                    width: `${Math.min(Number(logForm.percentage || 0), 100)}%`,
                  }}
                />
              </div>
              <span className="ml-3 text-xs font-black tabular-nums">
                {logForm.percentage || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Visual Update Section */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowVisuals(!showVisuals)}
          className="flex items-center justify-between w-full h-11 px-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/50 transition-all group"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-foreground/70" />
            <span className="text-xs font-black uppercase tracking-widest">
              Lampiran Visual (Opsional)
            </span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300",
              showVisuals && "rotate-180",
            )}
          />
        </button>

        {showVisuals && (
          <div className="space-y-4 p-4 rounded-2xl bg-muted/20 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Project Phase
              </Label>
              <Select
                value={logForm.phase}
                onValueChange={(v) => setLogForm({ ...logForm, phase: v })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Pilih fase proyek..." />
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
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Screenshot / Hasil Visual
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setLogForm({
                        ...logForm,
                        images: Array.from(e.target.files || []),
                      })
                    }
                    disabled={isSubmitting}
                    className="bg-background/50 border-border/50 h-auto py-1.5 px-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-foreground file:text-background hover:file:bg-foreground/90 cursor-pointer border-dashed transition-all hover:bg-muted/20"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Max 5 file. Format: JPG, PNG.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Link Eksternal (Figma/Staging)
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={addLink}
                  className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-foreground/5"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Link
                </Button>
              </div>

              <div className="space-y-2">
                {logForm.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 animate-in fade-in slide-in-from-right-2"
                  >
                    <Input
                      placeholder="Label (Staging)"
                      value={link.label}
                      onChange={(e) => updateLink(idx, "label", e.target.value)}
                      className="flex-1 h-9 text-xs"
                    />
                    <div className="relative flex-[2]">
                      <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateLink(idx, "url", e.target.value)}
                        className="pl-8 h-9 text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(idx)}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Checkbox */}
      <div className="flex items-center gap-3 p-4 bg-foreground/[0.03] rounded-2xl border border-border/50 group hover:border-foreground/20 transition-all">
        <div className="relative">
          <input
            type="checkbox"
            id="sendNotification"
            checked={logForm.sendNotification}
            onChange={(e) =>
              setLogForm({ ...logForm, sendNotification: e.target.checked })
            }
            className={cn(
              "w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer",
              "appearance-none bg-background border-border",
              "checked:bg-foreground checked:border-foreground",
              "focus:ring-2 focus:ring-foreground/10 focus:ring-offset-2",
            )}
            disabled={isSubmitting}
          />
          {logForm.sendNotification && (
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 text-background pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div
          className="flex flex-col flex-1 cursor-pointer"
          onClick={() =>
            !isSubmitting &&
            setLogForm({
              ...logForm,
              sendNotification: !logForm.sendNotification,
            })
          }
        >
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-foreground/50" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Kirim Notifikasi WhatsApp
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Klien akan mendapatkan ringkasan progress secara otomatis.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest border-border/50 hover:bg-muted"
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-foreground hover:bg-foreground/90 text-background text-xs font-bold uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Posting Progress
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
