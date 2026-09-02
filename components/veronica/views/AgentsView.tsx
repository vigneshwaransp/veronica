"use client";

import React, { useState } from "react";
import { AgentInstance, AgentExecutionPipeline, AutonomyLevel, VeronicaMode, UserProfile } from "@/types/veronica";
import { AgentOrchestrator } from "@/lib/agent-orchestrator";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Shield,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Leaf
} from "lucide-react";

interface AgentsViewProps {
  agents: AgentInstance[];
  user: UserProfile;
  currentMode: VeronicaMode;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  user,
  currentMode,
}) => {
  const [taskInput, setTaskInput] = useState("Architect a high-throughput memory cache for the digital twin");
  const [activePipeline, setActivePipeline] = useState<AgentExecutionPipeline | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setIsDispatching(true);
    setTimeout(() => {
      const pipeline = AgentOrchestrator.createExecutionPlan(
        taskInput,
        currentMode,
        user.autonomyLevel
      );
      setActivePipeline(pipeline);
      setIsDispatching(false);
    }, 400);
  };

  const handleConfirmStep = (stepId: string) => {
    if (!activePipeline) return;
    const nextSteps = activePipeline.steps.map((s) => {
      if (s.id === stepId) {
        return { ...s, status: "completed" as const, requiresConfirmation: false, output: "Approved by user. Execution completed." };
      }
      if (s.stepIndex === 5) {
        return { ...s, status: "completed" as const, output: "Execution finished successfully." };
      }
      return s;
    });
    setActivePipeline({
      ...activePipeline,
      steps: nextSteps,
      overallStatus: nextSteps.every((st) => st.status === "completed") ? "completed" : activePipeline.overallStatus,
    });
  };

  const AUTONOMY_TIERS: AutonomyLevel[] = [
    "LEVEL 0 - OBSERVE",
    "LEVEL 1 - RECOMMEND",
    "LEVEL 2 - PREPARE",
    "LEVEL 3 - EXECUTE WITH CONFIRMATION",
    "LEVEL 4 - AUTONOMOUS",
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Agent <span className="italic text-[#8C9A84]">Swarm</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            8 specialized domain agents orchestrating multi-step tasks under calibrated safety boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D3A31]/70">Autonomy Gate:</span>
          <span className="px-3 py-1 bg-[#2D3A31] text-[#FFFFFF] rounded-full text-xs font-semibold">
            {user.autonomyLevel}
          </span>
        </div>
      </div>

      {/* Autonomy Safety Tier Selector */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
            Safety Autonomy Tier
          </span>
          <span className="text-xs text-[#2D3A31]/70">
            Current: <strong className="text-[#2D3A31]">{user.autonomyLevel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {AUTONOMY_TIERS.map((tier, idx) => {
            const isSelected = user.autonomyLevel === tier;
            return (
              <button
                key={tier}
                onClick={() => veronicaStore.setAutonomyLevel(tier)}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all",
                  isSelected
                    ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-md"
                    : "bg-[#F9F8F4] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
                )}
              >
                <span className="text-[10px] font-bold block mb-1 opacity-80">
                  LEVEL 0{idx}
                </span>
                <span className="text-xs font-semibold block leading-tight">
                  {tier.replace(/^LEVEL \d - /, "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dispatch Pipeline Form */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84]">
          <Zap className="w-4 h-4 text-[#8C9A84]" />
          <span>Dispatch Coordinated Task</span>
        </div>

        <form onSubmit={handleDispatch} className="space-y-4">
          <textarea
            rows={2}
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Describe the multi-step goal for the agent swarm..."
            className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-4 text-xs sm:text-sm text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none focus:border-[#8C9A84]"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#2D3A31]/70">
              Mode: <strong className="text-[#8C9A84]">{currentMode}</strong> • Verification Required for external actions
            </span>

            <button
              type="submit"
              disabled={isDispatching}
              className="botanical-btn-primary py-3 px-8 text-xs font-semibold"
            >
              {isDispatching ? "Synthesizing DAG..." : "Dispatch Swarm Pipeline"}
            </button>
          </div>
        </form>
      </div>

      {/* Active Pipeline View */}
      {activePipeline && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-4">
            <div>
              <span className="text-xs font-semibold text-[#8C9A84] uppercase">
                Active Execution DAG
              </span>
              <h3 className="text-lg font-serif font-bold text-[#2D3A31]">
                {activePipeline.taskTitle}
              </h3>
            </div>
            <span className="px-3 py-1 bg-[#F2F0EB] text-[#2D3A31] rounded-full text-xs font-semibold border border-[#E6E2DA]">
              {activePipeline.overallStatus.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            {activePipeline.steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                  step.status === "completed"
                    ? "bg-[#F9F8F4] border-[#E6E2DA]"
                    : step.requiresConfirmation
                    ? "bg-[#FFFFFF] border-[#C27B66] shadow-sm"
                    : "bg-[#FFFFFF] border-[#E6E2DA]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F2F0EB] flex items-center justify-center text-xs font-bold text-[#8C9A84]">
                    0{step.stepIndex}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#2D3A31]">{step.agentName}</span>
                      <span className="text-[10px] text-[#8C9A84] uppercase font-semibold">({step.agentRole})</span>
                    </div>
                    <p className="text-xs text-[#2D3A31]/80 mt-0.5">{step.action}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {step.requiresConfirmation ? (
                    <button
                      onClick={() => handleConfirmStep(step.id)}
                      className="px-4 py-1.5 bg-[#C27B66] hover:bg-[#2D3A31] text-[#FFFFFF] text-xs font-semibold rounded-full shadow-sm transition-all"
                    >
                      Approve Action
                    </button>
                  ) : step.status === "completed" ? (
                    <span className="text-xs font-semibold text-[#8C9A84] flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs text-[#2D3A31]/50 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((ag) => (
          <div
            key={ag.id}
            className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase">
                {ag.role}
              </span>
              <span className="w-2 h-2 bg-[#8C9A84] rounded-full animate-pulse" />
            </div>

            <div>
              <h4 className="text-base font-serif font-bold text-[#2D3A31]">{ag.name}</h4>
              <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">{ag.description}</p>
            </div>

            <div className="pt-2 border-t border-[#E6E2DA] flex justify-between items-center text-[11px] text-[#2D3A31]/60">
              <span>Success: {ag.successRate}%</span>
              <span>{ag.tasksCompleted} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
