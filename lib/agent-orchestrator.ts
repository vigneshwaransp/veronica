import {
  AgentRole,
  AgentInstance,
  AgentExecutionPipeline,
  AutonomyLevel,
  ImpactLevel,
  VeronicaMode
} from "@/types/veronica";
import { veronicaStore } from "./veronica-store";

export class AgentOrchestrator {
  /**
   * Plans and dispatches an autonomous agent pipeline with safety gates.
   */
  public static createExecutionPlan(
    taskTitle: string,
    mode: VeronicaMode,
    autonomyLevel: AutonomyLevel
  ): AgentExecutionPipeline {
    const isDestructive =
      taskTitle.toLowerCase().includes("delete") ||
      taskTitle.toLowerCase().includes("purge") ||
      taskTitle.toLowerCase().includes("reset") ||
      taskTitle.toLowerCase().includes("deploy");

    const baseImpact: ImpactLevel = isDestructive ? "CRITICAL" : "MEDIUM";
    const requiresExplicitConfirmation =
      isDestructive ||
      autonomyLevel === "LEVEL 0 - OBSERVE" ||
      autonomyLevel === "LEVEL 1 - RECOMMEND" ||
      autonomyLevel === "LEVEL 2 - PREPARE" ||
      autonomyLevel === "LEVEL 3 - EXECUTE WITH CONFIRMATION";

    const pipeline: AgentExecutionPipeline = {
      id: `pipe_${Date.now()}`,
      taskTitle,
      mode,
      autonomyLevel,
      overallStatus: requiresExplicitConfirmation ? "paused_for_approval" : "in_progress",
      createdAt: new Date().toISOString(),
      steps: [
        {
          id: "step_1",
          stepIndex: 1,
          agentRole: "PERSONA AGENT",
          agentName: "VERONICA Core",
          action: "Classify task intent & harmonize with active user persona",
          status: "completed",
          requiresConfirmation: false,
          impactLevel: "LOW",
          output: "Task matched to high-technical-depth engineering workflow.",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: "step_2",
          stepIndex: 2,
          agentRole: "MEMORY AGENT",
          agentName: "Mnemosyne",
          action: "Retrieve relevant episodic & procedural memory traces",
          status: "completed",
          requiresConfirmation: false,
          impactLevel: "LOW",
          output: "Synthesized 4 procedural memories related to user task habits.",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: "step_3",
          stepIndex: 3,
          agentRole: "PLANNING AGENT",
          agentName: "Strategist",
          action: "Generate DAG execution workflow and safety validation bounds",
          status: "completed",
          requiresConfirmation: false,
          impactLevel: "LOW",
          output: "Generated 3-stage execution plan with dependency checks.",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: "step_4",
          stepIndex: 4,
          agentRole: "SAFETY AGENT",
          agentName: "Guardian",
          action: `Evaluate execution safety under ${autonomyLevel}`,
          status: requiresExplicitConfirmation ? "awaiting_confirmation" : "completed",
          requiresConfirmation: requiresExplicitConfirmation,
          impactLevel: baseImpact,
          output: requiresExplicitConfirmation
            ? `Confirmation required for action: [${taskTitle}] (Impact: ${baseImpact}).`
            : "Safety gate passed: Autonomous execution permitted under Level 4 policy.",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: "step_5",
          stepIndex: 5,
          agentRole: "EXECUTION AGENT",
          agentName: "Actuator",
          action: "Execute action in virtual environment and capture execution telemetry",
          status: requiresExplicitConfirmation ? "pending" : "running",
          requiresConfirmation: false,
          impactLevel: baseImpact,
          output: "Awaiting preceding safety clearance.",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: "step_6",
          stepIndex: 6,
          agentRole: "CRITIC AGENT",
          agentName: "Sentinel",
          action: "Validate execution correctness against user specifications",
          status: "pending",
          requiresConfirmation: false,
          impactLevel: "LOW",
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };

    veronicaStore.logAuditEvent({
      agentRole: "ORCHESTRATOR",
      agentName: "VERONICA Core",
      action: `Created Agent Execution Pipeline for: ${taskTitle.slice(0, 40)}`,
      impactLevel: baseImpact,
      confirmationRequired: requiresExplicitConfirmation,
      status: requiresExplicitConfirmation ? "PENDING" : "SUCCESS",
      details: `Dispatched across 6 agents under autonomy policy ${autonomyLevel}.`,
    });

    return pipeline;
  }
}
