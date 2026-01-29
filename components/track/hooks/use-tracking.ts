"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DiscussionArtifact,
  ProgressUpdate,
  Project,
  ProjectLog,
} from "@/lib/types/project";

export function useTracking(token: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [artifacts, setArtifacts] = useState<DiscussionArtifact[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjectData = useCallback(async () => {
    try {
      const response = await fetch(`/api/track/${token}`);

      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setLogs(data.logs);
        setArtifacts(Array.isArray(data.artifacts) ? data.artifacts : []);
        setUpdates(Array.isArray(data.updates) ? data.updates : []);
      } else {
        setError("Data tidak ditemukan. Token mungkin salah atau tidak valid.");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProjectData();
    }
  }, [token, fetchProjectData]);

  const latestProgress = logs.length > 0 ? logs[0].percentage : 0;

  return {
    project,
    logs,
    artifacts,
    updates,
    isLoading,
    error,
    latestProgress,
  };
}
