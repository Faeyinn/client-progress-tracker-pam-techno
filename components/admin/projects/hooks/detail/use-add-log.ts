"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useAddLog(projectId: string, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logForm, setLogForm] = useState({
    title: "",
    description: "",
    percentage: "",
    sendNotification: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: logForm.title,
          description: logForm.description,
          percentage: parseInt(logForm.percentage),
          sendNotification: logForm.sendNotification,
        }),
      });

      if (response.ok) {
        setLogForm({
          title: "",
          description: "",
          percentage: "",
          sendNotification: true,
        });
        onSuccess();
        toast.success("Log progress berhasil ditambahkan!");
      } else {
        toast.error("Gagal menambahkan log");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    logForm,
    setLogForm,
    handleSubmit,
  };
}
