export interface Project {
  id: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  deadline: string;
  status: "On Progress" | "Done";
  progress: number;
  uniqueToken: string;
  createdAt: string;
}

export interface ProjectLog {
  id: string;
  projectId: string;
  title: string;
  description: string;
  percentage: number;
  createdAt: string;
}

export interface ClientFeedback {
  id: string;
  projectId: string;
  message: string;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  onProgress: number;
  done: number;
}
