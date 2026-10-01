/**
 * Veronica Agent Manager
 * Orchestrates autonomous task execution, safety boundaries, retries, and timeline logging.
 */

import {
  AgentState,
  AgentPlanStep,
  AgentExecutionEvent,
  AgentTaskMemory,
  AgentTaskResult,
  IAgent
} from "./agent-interface";
import { agentRegistry } from "./agent-registry";

export class AgentManager {
  private static formatTime(date: Date = new Date()): string {
    return date.toTimeString().split(" ")[0]; // "09:12:04"
  }

  /**
   * Execute an autonomous task end-to-end with safety limits and retries
   */
  public static async runAutonomousTask(
    agentId: string,
    objective: string,
    options: { maxRetries?: number; timeoutMs?: number; onEvent?: (event: AgentExecutionEvent) => void } = {}
  ): Promise<AgentTaskResult> {
    const startTime = Date.now();
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeline: AgentExecutionEvent[] = [];
    const maxRetries = options.maxRetries || 3;
    const timeoutMs = options.timeoutMs || 60000; // 60s safety timeout

    const logEvent = (
      type: AgentExecutionEvent["type"],
      message: string,
      stepIndex?: number,
      detail?: any
    ) => {
      const event: AgentExecutionEvent = {
        id: `evt_${timeline.length + 1}`,
        timestamp: AgentManager.formatTime(),
        stepIndex,
        message,
        type,
        detail,
      };
      timeline.push(event);
      if (options.onEvent) {
        options.onEvent(event);
      }
    };

    // 1. SELECT AGENT
    const agent: IAgent | undefined = agentRegistry.getAgent(agentId) || agentRegistry.getAgent("general");
    if (!agent) {
      logEvent("error", `Agent with ID '${agentId}' not found.`);
      return {
        taskId,
        agentId,
        agentName: "Unknown Agent",
        category: "general",
        objective,
        state: "FAILED",
        plan: [],
        finalOutput: `Execution failed: Agent '${agentId}' is not registered in the system.`,
        durationSeconds: 0,
        stepsCount: 0,
        sourcesCount: 0,
        toolsUsed: [],
        timeline,
        errorExplanation: `Agent '${agentId}' is not registered.`,
        timestamp: new Date().toISOString(),
      };
    }

    logEvent("info", `Task created for ${agent.definition.name}`);
    logEvent("info", `Agent started with objective: "${objective.slice(0, 80)}..."`);

    // 2. INITIALIZE TASK MEMORY & PLANNING
    logEvent("plan", "Formulating autonomous execution plan...");
    let plan: AgentPlanStep[] = [];

    try {
      plan = await agent.createPlan(objective);
      logEvent("plan", `Plan constructed with ${plan.length} structured milestones.`);
    } catch (err: any) {
      logEvent("error", `Failed during planning phase: ${err.message || "Unknown planning error"}`);
      return {
        taskId,
        agentId: agent.definition.id,
        agentName: agent.definition.name,
        category: agent.definition.category,
        objective,
        state: "FAILED",
        plan: [],
        finalOutput: `Planning failed: ${err.message || "Unable to formulate task plan."}`,
        durationSeconds: (Date.now() - startTime) / 1000,
        stepsCount: 0,
        sourcesCount: 0,
        toolsUsed: [],
        timeline,
        errorExplanation: err.message,
        timestamp: new Date().toISOString(),
      };
    }

    const taskMemory: AgentTaskMemory = {
      taskId,
      agentId: agent.definition.id,
      objective,
      plan,
      currentStepIndex: 1,
      previousActions: [],
      toolResults: {},
      intermediateResults: [],
      retryCount: 0,
      maxRetries,
    };

    // 3. CONTROLLED AUTONOMOUS EXECUTION LOOP
    let currentStepIdx = 0;
    let isTaskSuccess = true;
    let failureReason: string | undefined = undefined;

    while (currentStepIdx < plan.length) {
      const step = plan[currentStepIdx];
      taskMemory.currentStepIndex = step.stepIndex;

      // Timeout safety check
      if (Date.now() - startTime > timeoutMs) {
        logEvent("error", `Safety limit exceeded: Execution timed out after ${timeoutMs / 1000}s`);
        step.status = "failed";
        step.error = "Operation timed out";
        isTaskSuccess = false;
        failureReason = `Safety timeout of ${timeoutMs / 1000}s reached.`;
        break;
      }

      step.status = "running";
      logEvent("info", `Executing step ${step.stepIndex}/${plan.length}: ${step.title}`, step.stepIndex);

      let stepSuccess = false;
      let stepRetries = 0;
      const stepStart = Date.now();

      // Retry Loop for this step
      while (!stepSuccess && stepRetries < maxRetries) {
        if (stepRetries > 0) {
          logEvent("retry", `Retrying step ${step.stepIndex} (attempt ${stepRetries + 1}/${maxRetries})...`, step.stepIndex);
        }

        const stepResult = await agent.executeStep(step, taskMemory);

        if (stepResult.success) {
          stepSuccess = true;
          step.status = "completed";
          step.output = stepResult.output;
          step.durationMs = Date.now() - stepStart;
          taskMemory.intermediateResults.push(stepResult.output);
          taskMemory.previousActions.push(`Step ${step.stepIndex} (${step.title}): ${stepResult.output.slice(0, 100)}`);
          logEvent("result", `Step ${step.stepIndex} completed: ${step.title}`, step.stepIndex);
        } else {
          stepRetries++;
          taskMemory.retryCount++;
          if (stepRetries >= maxRetries) {
            step.status = "failed";
            step.error = stepResult.error || "Step execution failed after maximum retries.";
            logEvent("error", `Step ${step.stepIndex} permanently failed: ${step.error}`, step.stepIndex);
            isTaskSuccess = false;
            failureReason = step.error;
          }
        }
      }

      if (!stepSuccess) {
        break;
      }

      currentStepIdx++;
    }

    // 4. VERIFICATION & FINAL SYNTHESIS
    const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    if (isTaskSuccess) {
      logEvent("info", "All plan steps completed. Synthesizing final structured result...");
      try {
        const synthesis = await agent.evaluateAndSynthesize(taskMemory);
        logEvent("complete", `Task completed successfully in ${durationSeconds}s.`);

        return {
          taskId,
          agentId: agent.definition.id,
          agentName: agent.definition.name,
          category: agent.definition.category,
          objective,
          state: "COMPLETED",
          plan,
          finalOutput: synthesis.finalOutput,
          durationSeconds,
          stepsCount: plan.length,
          sourcesCount: synthesis.sourcesCount,
          toolsUsed: synthesis.toolsUsed,
          timeline,
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        logEvent("error", `Final synthesis failed: ${err.message}`);
        return {
          taskId,
          agentId: agent.definition.id,
          agentName: agent.definition.name,
          category: agent.definition.category,
          objective,
          state: "FAILED",
          plan,
          finalOutput: `Completed all steps but synthesis failed: ${err.message}`,
          durationSeconds,
          stepsCount: plan.length,
          sourcesCount: 0,
          toolsUsed: Object.keys(taskMemory.toolResults),
          timeline,
          errorExplanation: err.message,
          timestamp: new Date().toISOString(),
        };
      }
    } else {
      logEvent("error", `Task execution halted due to step failure: ${failureReason}`);
      return {
        taskId,
        agentId: agent.definition.id,
        agentName: agent.definition.name,
        category: agent.definition.category,
        objective,
        state: "FAILED",
        plan,
        finalOutput: `Task failed during execution.\nError Detail: ${failureReason || "Step execution could not be completed."}`,
        durationSeconds,
        stepsCount: plan.filter((s) => s.status === "completed").length,
        sourcesCount: 0,
        toolsUsed: Object.keys(taskMemory.toolResults),
        timeline,
        errorExplanation: failureReason,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
