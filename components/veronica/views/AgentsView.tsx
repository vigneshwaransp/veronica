"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Search,
  Code,
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  RotateCw,
  Copy,
  Check,
  ArrowRight,
  Layers,
  History,
  Shield,
  Zap,
  Terminal,
  Activity,
  FileText,
  RefreshCw,
  ExternalLink,
  Cpu
} from "lucide-react";
import {
  AgentDefinition,
  AgentPlanStep,
  AgentExecutionEvent,
  AgentState,
  AgentTaskResult
} from "@/lib/agents/agent-interface";
import { agentRegistry } from "@/lib/agents/agent-registry";
import { veronicaStore } from "@/lib/veronica-store";

interface AgentsViewProps {
  onNavigateView?: (view: string) => void;
}

export function AgentsView({ onNavigateView }: AgentsViewProps) {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("research");
  const [objective, setObjective] = useState<string>("");
  const [agentState, setAgentState] = useState<AgentState>("IDLE");
  const [currentPlan, setCurrentPlan] = useState<AgentPlanStep[]>([]);
  const [currentActionText, setCurrentActionText] = useState<string>("");
  const [timelineEvents, setTimelineEvents] = useState<AgentExecutionEvent[]>([]);
  const [taskResult, setTaskResult] = useState<AgentTaskResult | null>(null);
  const [taskHistory, setTaskHistory] = useState<AgentTaskResult[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "monitor" | "history">("directory");
  const [copied, setCopied] = useState<boolean>(false);
  const [maxRetries, setMaxRetries] = useState<number>(3);
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(60);

  useEffect(() => {
    const loadedAgents = agentRegistry.getAllDefinitions();
    setAgents(loadedAgents);
    if (loadedAgents.length > 0) {
      const initial = loadedAgents[0];
      setSelectedAgentId(initial.id);
      setObjective(initial.defaultObjective);
    }
    setTaskHistory(veronicaStore.getAgentTaskHistory());

    const unsubscribe = veronicaStore.subscribe(() => {
      setTaskHistory(veronicaStore.getAgentTaskHistory());
    });
    return () => unsubscribe();
  }, []);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleSelectAgent = (agent: AgentDefinition) => {
    setSelectedAgentId(agent.id);
    setObjective(agent.defaultObjective);
    setActiveTab("directory");
  };

  const handleStartTask = async () => {
    if (!objective.trim() || !selectedAgent) return;

    setAgentState("PLANNING");
    setActiveTab("monitor");
    setTaskResult(null);

    const formatNow = () => new Date().toTimeString().split(" ")[0];

    // Optimistic initial plan preview
    const initialPlanSteps: AgentPlanStep[] =
      selectedAgent.id === "research"
        ? [
            { id: "p1", stepIndex: 1, title: "Understand task & formulate research queries", description: `Deconstruct objective: "${objective.slice(0, 50)}..."`, status: "running" },
            { id: "p2", stepIndex: 2, title: "Collect information from authoritative sources", description: "Execute web search tool for live facts", status: "pending", toolName: "web_search" },
            { id: "p3", stepIndex: 3, title: "Verify findings against internal knowledge index", description: "Cross-check facts against system memory", status: "pending", toolName: "speed_rag_memory" },
            { id: "p4", stepIndex: 4, title: "Synthesize structured research briefing", description: "Generate executive summary and recommendations", status: "pending" },
          ]
        : selectedAgent.id === "coding"
        ? [
            { id: "p1", stepIndex: 1, title: "Deconstruct requirements & define type contracts", description: `Strict type definitions for "${objective.slice(0, 50)}..."`, status: "running" },
            { id: "p2", stepIndex: 2, title: "Execute sandbox code generation & test harness", description: "Run sandbox test execution", status: "pending", toolName: "code_sandbox" },
            { id: "p3", stepIndex: 3, title: "Produce complete tested implementation", description: "Generate implementation code and unit tests", status: "pending" },
          ]
        : selectedAgent.id === "analysis"
        ? [
            { id: "p1", stepIndex: 1, title: "Ingest dataset & compute statistical distributions", description: "Numerical analysis and anomaly calculation", status: "running", toolName: "data_analyzer" },
            { id: "p2", stepIndex: 2, title: "Synthesize findings & strategic takeaways", description: "Deconstruct anomaly patterns and optimizations", status: "pending" },
          ]
        : [
            { id: "p1", stepIndex: 1, title: "Deconstruct objective & map dependencies", description: `Milestone planning for: "${objective.slice(0, 50)}..."`, status: "running" },
            { id: "p2", stepIndex: 2, title: "Query memory index & gather operational context", description: "Contextual lookup via Speed-RAG", status: "pending", toolName: "speed_rag_memory" },
            { id: "p3", stepIndex: 3, title: "Assemble comprehensive strategic deliverable", description: "Multi-domain roadmap synthesis", status: "pending" },
          ];

    setCurrentPlan(initialPlanSteps);

    const initialEvents: AgentExecutionEvent[] = [
      { id: "e1", timestamp: formatNow(), message: `Task created for ${selectedAgent.name}`, type: "info" },
      { id: "e2", timestamp: formatNow(), message: `Agent started: "${objective.slice(0, 70)}..."`, type: "info" },
      { id: "e3", timestamp: formatNow(), message: `Plan formulated with ${initialPlanSteps.length} milestones. Executing...`, type: "plan" },
    ];
    setTimelineEvents(initialEvents);
    setCurrentActionText(`Executing autonomous plan for ${selectedAgent.name}...`);
    setAgentState("RUNNING");

    // Dynamic step progress animation while waiting for server response
    let stepTimer: any = null;
    let stepCount = 0;
    stepTimer = setInterval(() => {
      stepCount++;
      setCurrentPlan((prev) =>
        prev.map((s, idx) => {
          if (idx < stepCount) return { ...s, status: "completed" };
          if (idx === stepCount) return { ...s, status: "running" };
          return { ...s, status: "pending" };
        })
      );
    }, 1200);

    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          objective,
          maxRetries,
          timeoutMs: timeoutSeconds * 1000,
        }),
      });

      if (stepTimer) clearInterval(stepTimer);

      const data = await res.json();

      if (data.result) {
        const result: AgentTaskResult = data.result;
        setTaskResult(result);
        setAgentState(result.state);
        setCurrentPlan(result.plan);
        setTimelineEvents(result.timeline);
        setCurrentActionText(
          result.state === "COMPLETED"
            ? `Task completed successfully in ${result.durationSeconds}s with ${result.stepsCount} steps.`
            : `Task halted: ${result.errorExplanation || "Execution failed."}`
        );
        veronicaStore.addAgentTaskResult(result);
      } else {
        throw new Error(data.error || "Execution failed without result.");
      }
    } catch (err: any) {
      if (stepTimer) clearInterval(stepTimer);
      setAgentState("FAILED");
      setCurrentActionText(`Task execution error: ${err.message || "Unknown execution failure"}`);
      const failedResult: AgentTaskResult = {
        taskId: `err_${Date.now()}`,
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        category: selectedAgent.category,
        objective,
        state: "FAILED",
        plan: currentPlan,
        finalOutput: `Execution Error: ${err.message || "The autonomous agent encountered an unrecoverable failure."}`,
        durationSeconds: 2,
        stepsCount: currentPlan.filter((s) => s.status === "completed").length,
        sourcesCount: 0,
        toolsUsed: [],
        timeline: [
          ...timelineEvents,
          { id: `err_${Date.now()}`, timestamp: formatNow(), message: `Error: ${err.message}`, type: "error" },
        ],
        errorExplanation: err.message,
        timestamp: new Date().toISOString(),
      };
      setTaskResult(failedResult);
      veronicaStore.addAgentTaskResult(failedResult);
    }
  };

  const handleCopyResult = () => {
    if (!taskResult?.finalOutput) return;
    navigator.clipboard.writeText(taskResult.finalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case "Search": return <Search className="w-5 h-5 text-blue-600" />;
      case "Code": return <Code className="w-5 h-5 text-emerald-600" />;
      case "BarChart3": return <BarChart3 className="w-5 h-5 text-purple-600" />;
      case "Bot": return <Bot className="w-5 h-5 text-amber-600" />;
      default: return <Sparkles className="w-5 h-5 text-[#8C9A84]" />;
    }
  };

  const getStateBadge = (state: AgentState) => {
    switch (state) {
      case "RUNNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            RUNNING
          </span>
        );
      case "PLANNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            PLANNING
          </span>
        );
      case "WAITING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            WAITING
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            COMPLETED
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F0EB] text-[#2D3A31] text-xs font-bold font-mono">
            IDLE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 font-sans text-[#2D3A31]">
      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8C9A84]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31]">
              <Bot className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>VERONICA AGENTS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-700 font-mono">Autonomous Execution Loop</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D3A31]">
              Autonomous AI Workers
            </h1>
            <p className="text-sm text-[#2D3A31]/70 max-w-2xl">
              Specialized autonomous agents that understand your objective, formulate multi-step execution plans, execute tools, verify results, and retry on errors without manual micro-management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
              <Bot className="w-4 h-4 text-[#8C9A84]" />
              <div className="text-left">
                <div className="text-[10px] font-medium text-[#2D3A31]/60 uppercase">Available Agents</div>
                <div className="text-xs font-bold text-[#2D3A31]">{agents.length} Specialized Workers</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
              <History className="w-4 h-4 text-[#8C9A84]" />
              <div className="text-left">
                <div className="text-[10px] font-medium text-[#2D3A31]/60 uppercase">Executed Tasks</div>
                <div className="text-xs font-bold text-[#2D3A31]">{taskHistory.length} History Logs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#E6E2DA]">
          <div className="flex items-center gap-1.5 bg-[#F9F8F4] p-1 rounded-2xl border border-[#E6E2DA]">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "directory"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Agent Directory</span>
            </button>

            <button
              onClick={() => setActiveTab("monitor")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "monitor"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Task Execution &amp; Monitor</span>
              {agentState === "RUNNING" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Execution History ({taskHistory.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#2D3A31]/70">
            <span className="font-semibold">Safety Limits:</span>
            <span className="font-mono bg-[#F9F8F4] px-2 py-0.5 rounded-md border border-[#E6E2DA]">
              Max Retries: {maxRetries}
            </span>
            <span className="font-mono bg-[#F9F8F4] px-2 py-0.5 rounded-md border border-[#E6E2DA]">
              Timeout: {timeoutSeconds}s
            </span>
          </div>
        </div>
      </div>

      {/* 1. AGENT DIRECTORY TAB */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <div
                  key={agent.id}
                  className={`bg-[#FFFFFF] border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                    isSelected ? "border-[#2D3A31] ring-1 ring-[#2D3A31] shadow-md" : "border-[#E6E2DA] hover:border-[#8C9A84]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#F9F8F4] border border-[#E6E2DA] flex items-center justify-center">
                        {getAgentIcon(agent.iconName)}
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#F2F0EB] text-[#2D3A31] uppercase">
                        {agent.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#2D3A31]">{agent.name}</h3>
                      <p className="text-xs text-[#8C9A84] font-medium">{agent.tagline}</p>
                    </div>

                    <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold uppercase text-[#2D3A31]/50 tracking-wider">
                        Core Capabilities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="text-[10px] px-2 py-0.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-md text-[#2D3A31]/80"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E6E2DA]">
                    <button
                      onClick={() => handleSelectAgent(agent)}
                      className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-[#2D3A31] text-white shadow-sm"
                          : "bg-[#F2F0EB] hover:bg-[#E6E2DA] text-[#2D3A31]"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isSelected ? "Selected (Configure Below)" : "Select & Launch"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Objective Formulation & Launch Card */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E2DA]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8C9A84] font-mono">SELECTED AGENT:</span>
                  <h3 className="text-lg font-bold text-[#2D3A31]">{selectedAgent?.name}</h3>
                </div>
                <p className="text-xs text-[#2D3A31]/70 mt-0.5">{selectedAgent?.tagline}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartTask}
                  disabled={agentState === "RUNNING" || !objective.trim()}
                  className="px-6 py-2.5 bg-[#2D3A31] hover:bg-[#1E2620] disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Start Autonomous Task</span>
                </button>
              </div>
            </div>

            {/* Objective Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#2D3A31]/70 tracking-wider flex items-center justify-between">
                <span>Task Objective</span>
                <span className="text-[10px] text-[#2D3A31]/50 font-normal">
                  Give the agent a complex objective; it will plan, execute, and verify autonomously.
                </span>
              </label>

              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder={`Describe what you want ${selectedAgent?.name} to accomplish...`}
                className="w-full p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none resize-none"
              />
            </div>

            {/* Suggested Sample Objectives */}
            {selectedAgent?.sampleObjectives && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#2D3A31]/50 tracking-wider">
                  Quick Sample Objectives for {selectedAgent.name}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.sampleObjectives.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setObjective(sample)}
                      className="text-xs px-3 py-1.5 bg-[#F9F8F4] hover:bg-[#E6E2DA] border border-[#E6E2DA] rounded-xl text-[#2D3A31]/80 transition-all text-left"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TASK EXECUTION & MONITOR TAB */}
      {activeTab === "monitor" && (
        <div className="space-y-6">
          {/* Active Status Bar */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2DA]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F9F8F4] border border-[#E6E2DA] flex items-center justify-center">
                    {getAgentIcon(selectedAgent?.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2D3A31]">{selectedAgent?.name}</h3>
                    <div className="text-xs text-[#8C9A84] font-medium">{selectedAgent?.tagline}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStateBadge(agentState)}

                {agentState !== "RUNNING" && (
                  <button
                    onClick={handleStartTask}
                    className="px-4 py-2 bg-[#2D3A31] hover:bg-[#1E2620] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Run Again</span>
                  </button>
                )}
              </div>
            </div>

            {/* Task Objective Display */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-4 text-xs font-mono space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#2D3A31]/50">ACTIVE TASK OBJECTIVE:</span>
              <p className="text-[#2D3A31] font-sans text-sm font-semibold">{objective}</p>
            </div>

            {/* Current Action Highlight */}
            {currentActionText && (
              <div className="flex items-center gap-3 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 font-mono">
                {agentState === "RUNNING" ? (
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                ) : agentState === "COMPLETED" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <span className="font-bold uppercase text-[10px] text-blue-700 block">CURRENT ACTION:</span>
                  <span>{currentActionText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Plan Checklist & Execution Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: PLAN Checklist */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#2D3A31]/70 tracking-wider">
                    Autonomous Execution Plan
                  </span>
                  <span className="text-xs font-mono text-[#8C9A84]">
                    {currentPlan.filter((s) => s.status === "completed").length} / {currentPlan.length} Done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentPlan.length === 0 ? (
                    <div className="p-4 bg-[#F9F8F4] rounded-2xl text-xs text-[#2D3A31]/60 text-center font-mono">
                      {agentState === "RUNNING" || agentState === "PLANNING"
                        ? "Formulating plan steps..."
                        : "No active plan. Click 'Start Autonomous Task' to begin."}
                    </div>
                  ) : (
                    currentPlan.map((step) => {
                      const isCompleted = step.status === "completed";
                      const isRunning = step.status === "running";
                      const isFailed = step.status === "failed";

                      return (
                        <div
                          key={step.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCompleted
                              ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-900"
                              : isRunning
                              ? "bg-blue-50/50 border-blue-300 text-blue-900 shadow-sm ring-1 ring-blue-300"
                              : isFailed
                              ? "bg-red-50/50 border-red-200 text-red-900"
                              : "bg-[#F9F8F4]/80 border-[#E6E2DA] text-[#2D3A31]/70"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : isRunning ? (
                                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                                ) : isFailed ? (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                ) : (
                                  <span className="w-4 h-4 rounded-full border-2 border-[#8C9A84]/40 flex items-center justify-center text-[10px] font-mono">
                                    {step.stepIndex}
                                  </span>
                                )}
                              </span>

                              <div>
                                <h4 className="text-xs font-bold leading-tight font-sans">
                                  {step.title}
                                </h4>
                                <p className="text-[11px] opacity-75 mt-0.5 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>

                            {step.toolName && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E6E2DA] font-mono font-bold uppercase">
                                {step.toolName}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right: Execution Timeline */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#2D3A31]/70 tracking-wider">
                    Execution Timeline
                  </span>
                  <span className="text-xs font-mono text-[#8C9A84]">Real-time Event Stream</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {timelineEvents.length === 0 ? (
                    <div className="p-4 bg-[#F9F8F4] rounded-2xl text-xs text-[#2D3A31]/60 text-center font-mono">
                      Events will stream here once execution begins.
                    </div>
                  ) : (
                    timelineEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs font-mono flex items-start gap-3"
                      >
                        <span className="text-[#8C9A84] font-bold text-[10px] flex-shrink-0">
                          {event.timestamp}
                        </span>
                        <div className="flex-1">
                          <span
                            className={`${
                              event.type === "error"
                                ? "text-red-600 font-bold"
                                : event.type === "complete"
                                ? "text-emerald-700 font-bold"
                                : event.type === "plan"
                                ? "text-blue-700 font-semibold"
                                : "text-[#2D3A31]"
                            }`}
                          >
                            {event.message}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Final Agent Result Section */}
          {taskResult && (
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 sm:p-8 shadow-md space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2DA]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      taskResult.state === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {taskResult.state === "COMPLETED" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2D3A31]">
                      {taskResult.state === "COMPLETED" ? "TASK COMPLETED AUTONOMOUSLY" : "TASK EXECUTION HALTED"}
                    </h3>
                    <div className="text-xs text-[#2D3A31]/70 flex items-center gap-3 font-mono mt-0.5">
                      <span>Agent: {taskResult.agentName}</span>
                      <span>•</span>
                      <span>Duration: {taskResult.durationSeconds}s</span>
                      <span>•</span>
                      <span>Steps: {taskResult.stepsCount}</span>
                      <span>•</span>
                      <span>Sources/Tools: {taskResult.sourcesCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResult}
                    className="px-3.5 py-2 bg-[#F2F0EB] hover:bg-[#E6E2DA] text-[#2D3A31] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Result"}</span>
                  </button>

                  <button
                    onClick={handleStartTask}
                    className="px-4 py-2 bg-[#2D3A31] hover:bg-[#1E2620] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Run Again</span>
                  </button>
                </div>
              </div>

              {/* Formatted Result Payload */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-[#2D3A31]/70 tracking-wider">
                  Structured Result Deliverable
                </span>
                <div className="bg-[#1B241E] border border-[#2D3A31] rounded-2xl p-5 text-emerald-400 text-xs font-mono overflow-x-auto max-h-[480px] whitespace-pre-wrap leading-relaxed">
                  {taskResult.finalOutput}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EXECUTION HISTORY TAB */}
      {activeTab === "history" && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E2DA]">
            <div>
              <h3 className="text-lg font-bold text-[#2D3A31]">Agent Task Execution History</h3>
              <p className="text-xs text-[#2D3A31]/70">
                Permanent log of all autonomous agent tasks and deliverables.
              </p>
            </div>

            {taskHistory.length > 0 && (
              <button
                onClick={() => veronicaStore.clearAgentTaskHistory()}
                className="px-3 py-1.5 bg-[#F9F8F4] hover:bg-[#E6E2DA] text-xs font-semibold text-[#2D3A31]/70 rounded-xl transition-all"
              >
                Clear History
              </button>
            )}
          </div>

          {taskHistory.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#2D3A31]/60 font-mono space-y-2">
              <History className="w-8 h-8 text-[#8C9A84] mx-auto opacity-50" />
              <p>No autonomous agent tasks recorded yet.</p>
              <p className="text-[11px] text-[#8C9A84]">
                Select an agent in the directory and click 'Start Autonomous Task'.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {taskHistory.map((item) => (
                <div
                  key={item.taskId}
                  className="p-5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-3 hover:border-[#8C9A84] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-xs text-[#2D3A31] font-mono">{item.agentName}</span>
                      <span className="text-[10px] text-[#2D3A31]/60 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span>{item.durationSeconds}s</span>
                      <span>•</span>
                      <span>{item.stepsCount} steps</span>
                      <span>•</span>
                      {getStateBadge(item.state)}
                    </div>
                  </div>

                  <p className="text-xs text-[#2D3A31] font-semibold">{item.objective}</p>

                  <div className="bg-[#1B241E] p-3 rounded-xl text-emerald-400 text-[11px] font-mono max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {item.finalOutput.slice(0, 500)}...
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        setTaskResult(item);
                        setObjective(item.objective);
                        setCurrentPlan(item.plan);
                        setTimelineEvents(item.timeline);
                        setAgentState(item.state);
                        setSelectedAgentId(item.agentId);
                        setActiveTab("monitor");
                      }}
                      className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#E6E2DA] border border-[#E6E2DA] rounded-xl text-xs font-bold text-[#2D3A31] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>View Full Deliverable</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
