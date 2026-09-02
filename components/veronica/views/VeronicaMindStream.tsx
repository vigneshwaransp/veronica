"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, Persona, MemoryNode } from "@/types/veronica";
import { cn } from "@/lib/utils";
import {
  Brain,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Activity
} from "lucide-react";

interface VeronicaMindStreamProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
  onNavigateView: (view: string) => void;
}

interface ProbeScenario {
  id: string;
  label: string;
  situation: string;
  predictedAction: string;
  confidence: number;
  evidence: string;
  keyAxiom: string;
}

const PROBE_SCENARIOS: ProbeScenario[] = [
  {
    id: "sc_01",
    label: "Real-Time Concurrency Spike",
    situation: "Streaming throughput surges by 10x with low-latency WebSocket connections.",
    predictedAction: "Deploy distributed background workers using Redis streams rather than heavy external microservices.",
    confidence: 94.2,
    evidence: "Memory #003: Prefers streamlined Docker Compose pipelines over complex multi-cluster overhead.",
    keyAxiom: "Minimalist Architecture",
  },
  {
    id: "sc_02",
    label: "Full-Stack Database Selection",
    situation: "Choosing the primary datastore for multi-modal vector search and relational graph entities.",
    predictedAction: "Select PostgreSQL with pgvector & Apache AGE to maintain single-engine ACID guarantees and zero split-brain.",
    confidence: 96.8,
    evidence: "Memory #004: Strongly favors unified SQL schemas over multiple heterogeneous databases.",
    keyAxiom: "Deterministic ACID Consistency",
  },
  {
    id: "sc_03",
    label: "Third-Party Library Integration",
    situation: "A team member suggests installing 14 npm micro-packages for simple UI animation and math helpers.",
    predictedAction: "Reject extraneous packages; implement native CSS transitions and pure TypeScript utility helpers.",
    confidence: 92.5,
    evidence: "Memory #006: Rejects bloated node_modules; mandates lightweight standard library primitives.",
    keyAxiom: "Zero-Dependency Velocity",
  },
  {
    id: "sc_04",
    label: "Data Sovereignty & Model Access",
    situation: "An external cloud API offers cheaper inference but requires storing raw user prompts unencrypted.",
    predictedAction: "Strictly reject; retain sovereign local Mistral / Ollama inference or end-to-end encrypted tunnels.",
    confidence: 98.4,
    evidence: "Memory #001: Strict data sovereignty gate with zero unconfirmed external data leakage.",
    keyAxiom: "Constitutional Sovereignty",
  },
];

const STREAMING_THOUGHTS = [
  "Harmonizing active persona parameters with 1,248 indexed vector memories...",
  "Synthesizing TypeScript strict return types across core autonomous modules...",
  "Evaluating Speed-RAG sub-millisecond recall against recent architectural decisions...",
  "Reinforcing first-principles reasoning prior; pruning stale procedural traces...",
  "Calibrating decision confidence: 89.4% Bayesian empirical alignment active...",
];

export const VeronicaMindStream: React.FC<VeronicaMindStreamProps> = ({
  user,
  activePersona,
  memories,
  onNavigateView,
}) => {
  const [activeScenario, setActiveScenario] = useState<ProbeScenario>(PROBE_SCENARIOS[0]);
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % STREAMING_THOUGHTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 font-sans text-[#2D3A31]">
      {/* 1. Live Consciousness Stream (Open Editorial Ribbon) */}
      <div className="border-b border-[#E6E2DA] pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#8C9A84] rounded-full animate-ping" />
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
              Live Stream of Consciousness
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#2D3A31] px-3 py-1 bg-[#F2F0EB] rounded-full border border-[#E6E2DA]">
              Resonance: 96%
            </span>
            <span className="text-xs text-[#2D3A31]/60 font-mono">0.8ms Speed-RAG</span>
          </div>
        </div>

        <p className="text-base sm:text-lg font-serif italic text-[#2D3A31] leading-relaxed">
          &ldquo;{STREAMING_THOUGHTS[thoughtIndex]}&rdquo;
        </p>
      </div>

      {/* 2. Interactive Digital Twin Reaction Probe (Clean Open Layout) */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
            Probe Instinctive Reactions
          </span>
          <h4 className="text-xl font-serif font-bold text-[#2D3A31]">
            How Veronica predicts your architectural decisions:
          </h4>
        </div>

        {/* Scenario Selection Pills */}
        <div className="flex flex-wrap gap-2.5">
          {PROBE_SCENARIOS.map((sc) => {
            const isSelected = activeScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-xs font-semibold transition-all border",
                  isSelected
                    ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-sm"
                    : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
                )}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        {/* Predicted Decision Response */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
              Situation Context:
            </span>
            <span className="text-xs font-bold text-[#8C9A84]">
              {activeScenario.confidence}% Bayesian Alignment
            </span>
          </div>

          <p className="text-sm text-[#2D3A31]/80 leading-relaxed">
            {activeScenario.situation}
          </p>

          <div className="pl-4 border-l-2 border-[#8C9A84] py-1 space-y-1">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase block">
              Predicted Decision Directive
            </span>
            <p className="text-base font-serif font-bold text-[#2D3A31] leading-relaxed">
              &ldquo;{activeScenario.predictedAction}&rdquo;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#2D3A31]/60 pt-3 border-t border-[#E6E2DA] gap-2">
            <span>{activeScenario.evidence}</span>
            <button
              onClick={() => onNavigateView("SIMULATION")}
              className="text-[#8C9A84] hover:text-[#2D3A31] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Run Full Decision Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
