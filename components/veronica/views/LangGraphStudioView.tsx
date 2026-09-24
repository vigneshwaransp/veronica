"use client";

import React, { useState } from "react";
import {
  GitFork,
  Play,
  RotateCw,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Send,
  Compass,
  FileCode,
  Terminal,
  Share2,
  Lock,
  History,
  Binary,
  Scale,
  Sparkles,
  Zap,
  Activity,
  Code
} from "lucide-react";
import { BUILT_IN_GRAPH_TOPOLOGIES } from "@/lib/langgraph/workflow-templates";
import {
  GraphTopologyDefinition,
  GraphExecutionResult,
  AgentState,
  LangGraphStepTrace
} from "@/lib/langgraph/graph-types";

interface LangGraphStudioViewProps {
  onNavigateView?: (view: string) => void;
}

export function LangGraphStudioView({ onNavigateView }: LangGraphStudioViewProps) {
  const [topologies] = useState<GraphTopologyDefinition[]>(BUILT_IN_GRAPH_TOPOLOGIES);
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>("supervisor_worker_critic");
  const [objective, setObjective] = useState<string>(
    BUILT_IN_GRAPH_TOPOLOGIES[0].defaultObjective
  );
  const [maxLoops, setMaxLoops] = useState<number>(2);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<GraphExecutionResult | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [studioTab, setStudioTab] = useState<"visual" | "traces" | "state" | "topologies">("visual");

  const selectedTopology =
    topologies.find((t) => t.id === selectedTopologyId) || topologies[0];

  const handleSelectTopology = (topo: GraphTopologyDefinition) => {
    setSelectedTopologyId(topo.id);
    setObjective(topo.defaultObjective);
    setExecutionResult(null);
  };

  const handleRunGraph = async () => {
    if (!objective.trim()) return;
    setIsRunning(true);
    setExecutionResult(null);
    setActiveStepIndex(null);

    try {
      const res = await fetch("/api/langgraph/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          graphId: selectedTopology.id,
          objective,
          maxLoops,
          senderName: "Vigneshwaran S P",
        }),
      });
      const data = await res.json();
      if (data.result) {
        setExecutionResult(data.result);
        if (data.result.executionTrace?.length > 0) {
          setActiveStepIndex(data.result.executionTrace.length);
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsRunning(false);
    }
  };

  // Node Icon Mapping helper
  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case "Play": return <Play className="w-4 h-4" />;
      case "Compass": return <Compass className="w-4 h-4" />;
      case "Search": return <Search className="w-4 h-4" />;
      case "Cpu": return <Cpu className="w-4 h-4" />;
      case "ShieldAlert": return <ShieldAlert className="w-4 h-4" />;
      case "Send": return <Send className="w-4 h-4" />;
      case "CheckCircle2": return <CheckCircle2 className="w-4 h-4" />;
      case "FileCode": return <FileCode className="w-4 h-4" />;
      case "Layers": return <Layers className="w-4 h-4" />;
      case "Terminal": return <Terminal className="w-4 h-4" />;
      case "Share2": return <Share2 className="w-4 h-4" />;
      case "Binary": return <Binary className="w-4 h-4" />;
      case "History": return <History className="w-4 h-4" />;
      case "Lock": return <Lock className="w-4 h-4" />;
      case "Scale": return <Scale className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const activeTraceStep = executionResult?.executionTrace.find(
    (s) => s.stepIndex === activeStepIndex
  ) || executionResult?.executionTrace[executionResult.executionTrace.length - 1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8C9A84]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31]">
              <GitFork className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>LangChain & LangGraph State Machine Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-700 font-mono">Cyclical DAGs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D3A31]">
              Multi-Agent StateGraph Engine
            </h1>
            <p className="text-sm text-[#2D3A31]/70 max-w-2xl">
              Construct, visualize, and execute graph-based autonomous multi-agent pipelines with conditional edges, adversarial self-correction loops, and MCP tool bindings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
              <Layers className="w-4 h-4 text-[#8C9A84]" />
              <div className="text-left">
                <div className="text-[10px] font-medium text-[#2D3A31]/60 uppercase">Active Topologies</div>
                <div className="text-xs font-bold text-[#2D3A31]">{topologies.length} Graph Blueprints</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
              <RotateCw className="w-4 h-4 text-[#8C9A84]" />
              <div className="text-left">
                <div className="text-[10px] font-medium text-[#2D3A31]/60 uppercase">Max Self-Correction</div>
                <div className="text-xs font-bold text-[#2D3A31]">{maxLoops} Iterations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Header Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#E6E2DA]">
          <div className="flex items-center gap-1.5 bg-[#F9F8F4] p-1 rounded-2xl border border-[#E6E2DA]">
            <button
              onClick={() => setStudioTab("visual")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studioTab === "visual"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Interactive Graph</span>
            </button>
            <button
              onClick={() => setStudioTab("traces")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studioTab === "traces"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Step Traces ({executionResult?.stepsCount || 0})</span>
            </button>
            <button
              onClick={() => setStudioTab("state")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studioTab === "state"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>AgentState Inspector</span>
            </button>
            <button
              onClick={() => setStudioTab("topologies")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                studioTab === "topologies"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Topology Library</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2D3A31]/60 font-semibold">Graph Blueprint:</span>
            <select
              value={selectedTopologyId}
              onChange={(e) => {
                const topo = topologies.find((t) => t.id === e.target.value);
                if (topo) handleSelectTopology(topo);
              }}
              className="px-3 py-1.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs font-bold text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none"
            >
              {topologies.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Control Panel: Prompt & Execution Trigger */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#2D3A31]/60 tracking-wider">
              Objective Formulation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2F0EB] text-[#2D3A31] font-mono">
              {selectedTopology.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#2D3A31]/70">
              <span>Max Loops:</span>
              <select
                value={maxLoops}
                onChange={(e) => setMaxLoops(parseInt(e.target.value))}
                className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-lg px-2 py-1 text-xs font-mono font-bold"
              >
                <option value={1}>1 Loop</option>
                <option value={2}>2 Loops (Recommended)</option>
                <option value={3}>3 Loops (Maximum Rigor)</option>
              </select>
            </div>

            <button
              onClick={handleRunGraph}
              disabled={isRunning || !objective.trim()}
              className="px-6 py-2.5 bg-[#2D3A31] hover:bg-[#1E2620] disabled:opacity-50 text-[#FFFFFF] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Executing StateGraph...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Graph Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Enter multi-agent objective prompt..."
          className="w-full p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none resize-none font-sans"
        />
      </div>

      {/* Main Workspace Tab Content */}
      {studioTab === "visual" && (
        <div className="space-y-6">
          {/* Visual DAG Nodes Map */}
          <div className="bg-[#1B241E] border border-[#2D3A31] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D3A31]/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold font-mono text-emerald-400">
                  {selectedTopology.name.toUpperCase()} (DAG TOPOLOGY)
                </span>
              </div>
              <span className="text-[10px] text-white/50 font-mono">
                {selectedTopology.nodes.length} Nodes • {selectedTopology.edges.length} Edges
              </span>
            </div>

            {/* Nodes Chain Flow */}
            <div className="py-8 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[800px] gap-4 relative">
                {selectedTopology.nodes.map((node, idx) => {
                  const isNodeExecuted = executionResult?.executionTrace.some(
                    (t) => t.nodeId === node.id || (node.type === "synthesizer" && t.nodeType === "synthesizer")
                  );
                  const isCriticNode = node.type === "critic";
                  const isSupervisor = node.type === "supervisor";

                  return (
                    <React.Fragment key={node.id}>
                      <div className="flex flex-col items-center gap-2 relative group cursor-pointer">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                            isNodeExecuted
                              ? "bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/50"
                              : isCriticNode
                              ? "bg-amber-950/40 border-amber-500/60 text-amber-300"
                              : isSupervisor
                              ? "bg-blue-950/40 border-blue-500/60 text-blue-300"
                              : "bg-[#2D3A31] border-[#3D4D43] text-white/70 hover:border-white/50"
                          }`}
                        >
                          {getNodeIcon(node.iconName)}
                        </div>

                        <div className="text-center max-w-[120px]">
                          <div className="text-xs font-bold text-white font-mono">{node.name}</div>
                          <div className="text-[10px] text-white/50 uppercase">{node.type}</div>
                        </div>

                        {/* Node Tooltip */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#0F1411] border border-[#2D3A31] text-[10px] text-white/80 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          {node.description}
                        </div>
                      </div>

                      {/* Edge Connector */}
                      {idx < selectedTopology.nodes.length - 1 && (
                        <div className="flex-1 flex flex-col items-center justify-center min-w-[40px] px-1">
                          <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500/40 to-emerald-500/80 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-emerald-400" />
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400/80 mt-1">
                            {selectedTopology.edges[idx]?.label?.slice(0, 15)}
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Loopback indicator */}
            {selectedTopology.id === "supervisor_worker_critic" && (
              <div className="pt-3 border-t border-[#2D3A31]/70 flex items-center justify-between text-xs font-mono text-amber-400/90">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Adversarial Self-Correction Loopback: If Rigor Score &lt; 85%, state routes back to Synthesizer with constructive guidance.</span>
                </div>
                <span className="text-[10px] text-white/50">Strict Enterprise Validation</span>
              </div>
            )}
          </div>

          {/* Execution Trace Cards */}
          {executionResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Timeline Steps */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#2D3A31]/60 tracking-wider">
                    DAG Step Timeline ({executionResult.executionTrace.length} Steps)
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    Total: {executionResult.totalLatencyMs}ms
                  </span>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {executionResult.executionTrace.map((step) => {
                    const isSelected = (activeStepIndex || executionResult.executionTrace.length) === step.stepIndex;
                    return (
                      <button
                        key={step.stepIndex}
                        onClick={() => setActiveStepIndex(step.stepIndex)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                          isSelected
                            ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-md"
                            : "bg-[#FFFFFF] border-[#E6E2DA] text-[#2D3A31] hover:bg-[#F9F8F4]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isSelected ? "bg-[#FFFFFF]/20 text-white" : "bg-[#E6E2DA] text-[#2D3A31]"
                              }`}
                            >
                              {step.stepIndex}
                            </span>
                            <span className="text-xs font-bold font-mono">{step.nodeName}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {step.critiqueScore && (
                              <span
                                className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                                  step.critiqueScore >= 85
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {step.critiqueScore}%
                              </span>
                            )}
                            <span className="text-[10px] font-mono opacity-60">{step.latencyMs}ms</span>
                          </div>
                        </div>

                        <p className={`text-[11px] line-clamp-2 ${isSelected ? "text-white/80" : "text-[#2D3A31]/70"}`}>
                          {step.outputSummary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Deep Inspector */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#8C9A84] font-mono">
                          STEP #{activeTraceStep?.stepIndex || 1}:
                        </span>
                        <h3 className="text-sm font-bold text-[#2D3A31] font-mono">
                          {activeTraceStep?.nodeName}
                        </h3>
                      </div>
                      <p className="text-xs text-[#2D3A31]/60">{activeTraceStep?.routingDecision}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-semibold">
                        {activeTraceStep?.modelUsed}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase text-[#2D3A31]/70">Input Context:</span>
                      <p className="text-xs text-[#2D3A31] bg-[#F9F8F4] p-3 rounded-xl border border-[#E6E2DA] mt-1 font-mono">
                        {activeTraceStep?.inputSummary}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase text-[#2D3A31]/70">Output Payload:</span>
                      <div className="bg-[#1B241E] p-4 rounded-xl text-emerald-400 text-xs font-mono max-h-64 overflow-y-auto whitespace-pre-wrap mt-1">
                        {activeTraceStep?.nodeType === "synthesizer" && executionResult.finalState.draftSolution
                          ? executionResult.finalState.draftSolution
                          : activeTraceStep?.outputSummary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Output Summary Card */}
                {executionResult.finalState.finalOutput && (
                  <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#2D3A31]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Sealed Final Solution (LangGraph State Sealed)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                        Score: {executionResult.finalState.critiqueScore}%
                      </span>
                    </div>

                    <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-4 text-xs text-[#2D3A31] max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed font-mono">
                      {executionResult.finalState.finalOutput}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* State Inspector Tab */}
      {studioTab === "state" && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3A31]">
              Live AgentState Memory & Checkpoint
            </h3>
            <span className="text-xs text-[#8C9A84] font-mono">StateGraph Checkpointer</span>
          </div>

          <div className="bg-[#1B241E] rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px]">
            <pre>
              {JSON.stringify(
                executionResult?.finalState || {
                  objective,
                  status: "Ready to initialize graph",
                  topology: selectedTopology.id,
                  nodesCount: selectedTopology.nodes.length,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Step Traces Tab */}
      {studioTab === "traces" && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3A31]">
              Raw Step Traces & Telemetry Log
            </h3>
            <span className="text-xs text-[#8C9A84] font-mono">LangChain Callback Handler</span>
          </div>

          <div className="bg-[#1B241E] rounded-2xl p-4 text-blue-400 font-mono text-xs overflow-x-auto max-h-[500px]">
            <pre>
              {JSON.stringify(executionResult?.executionTrace || [], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Topology Library Tab */}
      {studioTab === "topologies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topologies.map((t) => (
            <div
              key={t.id}
              className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#F2F0EB] text-[#2D3A31] font-bold uppercase">
                  {t.category}
                </span>
                <h3 className="text-base font-bold text-[#2D3A31]">{t.name}</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">{t.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E6E2DA]">
                <div className="flex items-center justify-between text-xs text-[#2D3A31]/70 font-mono">
                  <span>Nodes:</span>
                  <span className="font-bold text-[#2D3A31]">{t.nodes.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#2D3A31]/70 font-mono">
                  <span>Edges:</span>
                  <span className="font-bold text-[#2D3A31]">{t.edges.length}</span>
                </div>

                <button
                  onClick={() => {
                    handleSelectTopology(t);
                    setStudioTab("visual");
                  }}
                  className="w-full py-2 bg-[#F2F0EB] hover:bg-[#E6E2DA] text-[#2D3A31] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Graph Topology</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
