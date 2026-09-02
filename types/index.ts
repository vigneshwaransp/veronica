export type JarvisState =
  | "idle"
  | "listening"
  | "thinking"
  | "planning"
  | "confirming"
  | "executing"
  | "observing"
  | "success"
  | "error"
  | "stopped";

export interface SystemMetrics {
  cpu: number;
  gpu: number;
  ram: number;
  disk: number;
  network: number;
  temperature: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  status: "pending" | "running" | "completed" | "warning" | "error";
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "jarvis";
  text: string;
  timestamp: string;
  plan?: string[];
  actions?: { type: string; params: Record<string, unknown> }[];
  risk?: "LOW" | "MEDIUM" | "HIGH";
  stepsCount?: number;
  state?: "pending" | "approved" | "cancelled" | "executing" | "completed" | "failed";
}
