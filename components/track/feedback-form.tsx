"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
  token: string;
}

export function FeedbackForm({ token }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    if (feedback.length > 500) {
      toast.error("Feedback maksimal 500 karakter");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`/api/track/${token}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedback }),
      });

      if (response.ok) {
        toast.success(
          "Feedback Anda berhasil dikirim! Kami akan segera menghubungi Anda.",
        );
        setFeedback("");
      } else {
        toast.error("Gagal mengirim feedback. Silakan coba lagi.");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2 px-2">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
        </div>
        <h3 className="text-xl font-bold">Feedback & Request</h3>
      </div>

      <Card className="border border-border/50 shadow-sm bg-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-muted to-foreground w-full" />
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Punya Masukan untuk Kami?</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sampaikan kritik, saran, atau request fitur langsung kepada tim
            kami.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Ketikan pesan Anda di sini..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="resize-none text-base bg-muted/20 focus:bg-card transition-colors border-border/60"
                disabled={isSending}
                maxLength={500}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Maksimal 500 karakter</span>
                <span
                  className={cn(
                    feedback.length > 450 && "text-amber-600 font-bold",
                  )}
                >
                  {feedback.length}/500
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-foreground hover:bg-foreground/90 text-background shadow-sm transition-all"
              disabled={isSending || !feedback.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
