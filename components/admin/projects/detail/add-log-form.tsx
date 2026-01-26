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
} from "lucide-react";
import { useAddLog } from "@/components/admin/projects/hooks/detail/use-add-log";
import { cn } from "@/lib/utils";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Judul Tahapan <span className="text-destructive">*</span>
        </Label>
        <div className="relative group">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            id="title"
            placeholder="Contoh: UI Design Selesai"
            value={logForm.title}
            onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
            required
            disabled={isSubmitting}
            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-foreground/20 text-base md:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Deskripsi <span className="text-destructive">*</span>
        </Label>
        <div className="relative group">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Textarea
            id="description"
            placeholder="Jelaskan detail perkembangan..."
            value={logForm.description}
            onChange={(e) =>
              setLogForm({ ...logForm, description: e.target.value })
            }
            rows={4}
            required
            disabled={isSubmitting}
            className="pl-10 pt-2.5 resize-none transition-all duration-200 focus:ring-2 focus:ring-foreground/20 text-base md:text-sm"
          />
        </div>
      </div>

      {/* Percentage Input */}
      <div className="space-y-2">
        <Label htmlFor="percentage" className="text-sm font-medium">
          Persentase Progress (0-100){" "}
          <span className="text-destructive">*</span>
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
            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-foreground/20 text-base md:text-sm"
          />
        </div>

        {/* Progress Preview */}
        {logForm.percentage && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{
                  width: `${Math.min(Number(logForm.percentage), 100)}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums min-w-9">
              {logForm.percentage}%
            </span>
          </div>
        )}
      </div>

      {/* Notification Checkbox */}
      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
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
              "focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2",
            )}
            disabled={isSubmitting}
          />
          {logForm.sendNotification && (
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 text-background pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <Label htmlFor="sendNotification" className="cursor-pointer text-sm">
            Kirim notifikasi WhatsApp ke klien
          </Label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11"
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1 h-11 bg-foreground hover:bg-foreground/90 text-background transition-all duration-200 active:scale-[0.98]"
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
              Simpan Log
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
