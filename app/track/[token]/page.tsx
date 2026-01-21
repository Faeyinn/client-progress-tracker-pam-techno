"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { TrackHeader } from "@/components/track/track-header";
import { ProjectHeaderCard } from "@/components/track/project-header-card";
import { TimelineSection } from "@/components/track/timeline-section";
import { FeedbackForm } from "@/components/track/feedback-form";
import { ContactFooter } from "@/components/track/contact-footer";
import { useTracking } from "@/components/track/hooks/use-tracking";
import { cn } from "@/lib/utils";

export default function TrackPage() {
  const params = useParams();
  const token = params.token as string;

  const { project, logs, isLoading, error, latestProgress } =
    useTracking(token);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <Loader2 className="w-full h-full animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground font-medium animate-pulse">
            Memuat data proyek...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border border-border/60 shadow-lg bg-card text-card-foreground">
          <CardContent className="pt-8 pb-8 px-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Data Tidak Ditemukan
                </h2>
                <p className="text-muted-foreground">
                  {error || "Proyek yang Anda cari tidak tersedia."}
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-black hover:bg-zinc-800 text-white shadow-sm transition-all"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <TrackHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProjectHeaderCard
            project={project}
            latestProgress={latestProgress}
          />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <TimelineSection logs={logs} />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <FeedbackForm token={token} />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {/* Assume clientPhone is valid. Type check if optional? Project interface has it as string */}
          <ContactFooter clientPhone={project.clientPhone} />
        </div>
      </main>
    </div>
  );
}
