/**
 * Veronica Autonomous Agents Architecture - Type Definitions & Interfaces
 * Simple, extensible, and controlled execution loop with safety limits.
 */

export type AgentState = "IDLE" | "PLANNING" | "RUNNING" | "WAITING" | "COMPLETED" | "FAILED";

export type AgentCategory = "research" | "coding" | "analysis" | "general" | "custom";

export interface AgentPlanStep {
  id: string;
  stepIndex: number;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  toolName?: string;
  toolArgs?: Record<string, any>;
  output?: string;
  error?: string;
  durationMs?: number;
}

export interface AgentExecutionEvent {
  id: string;
  timestamp: string; // e.g. "09:12:04"
  stepIndex?: number;
  message: string;
  type: "info" | "plan" | "tool" | "result" | "retry" | "error" | "complete";
  detail?: any;
}

export interface AgentTaskMemory {
  taskId: string;
  agentId: string;
  objective: string;
  plan: AgentPlanStep[];
  currentStepIndex: number;
  previousActions: string[];
  toolResults: Record<string, any>;
  intermediateResults: string[];
  retryCount: number;
  maxRetries: number;
  customContext?: Record<string, any>;
}

export interface AgentDefinition {
  id: string;
  category: AgentCategory;
  name: string;
  tagline: string;
  description: string;
  iconName: "Search" | "Code" | "BarChart3" | "Bot" | "Sparkles" | "Cpu" | "Layers";
  capabilities: string[];
  defaultObjective: string;
  sampleObjectives: string[];
  systemPrompt: string;
  supportedTools: string[];
}

export interface AgentTaskResult {
  taskId: string;
  agentId: string;
  agentName: string;
  category: AgentCategory;
  objective: string;
  state: AgentState;
  plan: AgentPlanStep[];
  finalOutput: string;
  durationSeconds: number;
  stepsCount: number;
  sourcesCount: number;
  toolsUsed: string[];
  timeline: AgentExecutionEvent[];
  errorExplanation?: string;
  timestamp: string;
  modelUsed?: string;
}

export interface IAgent {
  definition: AgentDefinition;
  createPlan(objective: string, context?: any): Promise<AgentPlanStep[]>;
  executeStep(step: AgentPlanStep, memory: AgentTaskMemory): Promise<{ output: string; success: boolean; retryable?: boolean; error?: string }>;
  evaluateAndSynthesize(memory: AgentTaskMemory): Promise<{ finalOutput: string; sourcesCount: number; toolsUsed: string[] }>;
}
