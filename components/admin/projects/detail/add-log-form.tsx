"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { useAddLog } from "@/components/admin/projects/hooks/detail/use-add-log";

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
    <Card className="border border-gray-200 shadow-lg bg-white animate-in slide-in-from-top-2">
      <CardHeader>
        <CardTitle>Tambah Log Progress Baru</CardTitle>
        <CardDescription>Catat perkembangan terbaru proyek</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tahapan *</Label>
            <Input
              id="title"
              placeholder="Contoh: UI Design Selesai"
              value={logForm.title}
              onChange={(e) =>
                setLogForm({ ...logForm, title: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">Persentase Progress (0-100) *</Label>
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
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendNotification"
              checked={logForm.sendNotification}
              onChange={(e) =>
                setLogForm({ ...logForm, sendNotification: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <Label htmlFor="sendNotification" className="cursor-pointer">
              Kirim notifikasi WhatsApp ke klien
            </Label>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
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

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
