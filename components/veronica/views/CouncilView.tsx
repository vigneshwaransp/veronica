"use client";

import React, { useState } from "react";
import { CouncilMember, CouncilDebateResult, CouncilMemberVerdict } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Users,
  Brain,
  Zap,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Cpu,
  Layers,
  Activity,
  Flame,
  Scale,
  Compass,
  Check
} from "lucide-react";

interface CouncilViewProps {
  councilMembers: CouncilMember[];
  councilDebates: CouncilDebateResult[];
}

export const CouncilView: React.FC<CouncilViewProps> = ({
  councilMembers: initialMembers,
  councilDebates: initialDebates,
}) => {
  const [members, setMembers] = useState<CouncilMember[]>(initialMembers || veronicaStore.getCouncilMembers());
  const [debates, setDebates] = useState<CouncilDebateResult[]>(initialDebates || veronicaStore.getCouncilDebates());
  const [questionInput, setQuestionInput] = useState("");
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [activeDebate, setActiveDebate] = useState<CouncilDebateResult>(
    debates[0] || veronicaStore.getCouncilDebates()[0]
  );
  const [activeEngineTab, setActiveEngineTab] = useState<"SPEED_RAG" | "GAN" | "RNN" | "RLHF">("SPEED_RAG");

  const PRESET_QUESTIONS = [
    {
      title: "Rust WASM vs Pure JS for Vector Search",
      q: "Should we compile our 1536-d HNSW vector search index to Rust WebAssembly for client-side offline execution, or retain Pure TypeScript?",
    },
    {
      title: "Level 3 Autonomy for Background Workers",
      q: "Should VERONICA execute autonomous Git PR staging and dependency bumps without requiring synchronous confirmation?",
    },
    {
      title: "Microservices vs Sovereign Monolith",
      q: "Should we decompose VERONICA's background agent cluster into independent micro-services or maintain a unified modular monolith?",
    },
  ];

  const handleConveneCouncil = (qText?: string) => {
    const query = qText || questionInput;
    if (!query.trim()) return;

    setIsDeliberating(true);

    // Simulate multi-stage council deliberation
    setTimeout(() => {
      const result = veronicaStore.evaluateCouncilQuestion(query);
      setDebates(veronicaStore.getCouncilDebates());
      setActiveDebate(result);
      setIsDeliberating(false);
      setQuestionInput("");
    }, 1200);
  };

  const getVerdictBadge = (verdict: CouncilMemberVerdict["verdict"]) => {
    switch (verdict) {
      case "ENDORSE":
        return "bg-[#8C9A84]/15 text-[#8C9A84] border-[#8C9A84]/30";
      case "ALIGN":
        return "bg-[#5A6B5C]/15 text-[#5A6B5C] border-[#5A6B5C]/30";
      case "SCRUTINIZE":
        return "bg-[#C27B66]/15 text-[#C27B66] border-[#C27B66]/30";
      case "ADAPT":
        return "bg-[#D18E7B]/15 text-[#C27B66] border-[#D18E7B]/30";
      case "SYNTHESIZE":
        return "bg-[#2D3A31]/10 text-[#2D3A31] border-[#2D3A31]/30 font-bold";
      default:
        return "bg-[#F2F0EB] text-[#2D3A31] border-[#E6E2DA]";
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C9A84] animate-pulse" />
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
              Autonomous Governance
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#2D3A31]">
            The Cognitive <span className="font-cursive text-4xl text-[#8C9A84] ml-1">Council</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Every proposal is evaluated in real time by 5 specialized AI council members across Speed-RAG, GAN, RNN, and RLHF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] shadow-sm flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>5 Active Council Seats</span>
          </span>
        </div>
      </div>

      {/* 2. Proposal Submission Bar */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(45,58,49,0.05)] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8C9A84]" />
            <span>Submit Proposal to The 5-Agent Council</span>
          </span>
          <span className="text-xs text-[#2D3A31]/60">Parallel Multi-Agent Evaluation</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConveneCouncil()}
            placeholder="Pose a strategic question, technical dilemma, or architectural decision..."
            className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none focus:border-[#8C9A84] transition-all"
          />

          <button
            onClick={() => handleConveneCouncil()}
            disabled={!questionInput.trim() || isDeliberating}
            className="w-full sm:w-auto whitespace-nowrap botanical-btn-primary py-3.5 px-7 text-xs font-semibold rounded-full disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isDeliberating ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deliberating...</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4" />
                <span>Convene Council</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Quick Dilemmas */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#2D3A31]/60 font-medium">Try Preset:</span>
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleConveneCouncil(pq.q)}
              className="text-[11px] px-3 py-1 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-[#2D3A31] transition-colors"
            >
              {pq.title}
            </button>
          ))}
        </div>
      </div>

      {/* 3. The 5 Council Members Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
            Council Members & Specialized AI Engines
          </h3>
          <span className="text-xs text-[#8C9A84] font-semibold">
            Individual Perspectives & Weights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-5 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: m.avatarColor }}
                  />
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F2F0EB] text-[#2D3A31] rounded-full border border-[#E6E2DA]">
                    {m.aiCore}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-serif font-bold text-[#2D3A31]">{m.name}</h4>
                  <p className="text-[11px] text-[#8C9A84] font-medium">{m.role}</p>
                </div>

                <p className="text-[11px] text-[#2D3A31]/75 italic leading-snug">
                  &ldquo;{m.motto}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-[#E6E2DA] flex items-center justify-between text-[11px] text-[#2D3A31]/60">
                <span>Weight: <strong className="text-[#2D3A31]">{m.weight}%</strong></span>
                <span className="text-[#8C9A84] font-semibold">{m.accuracyScore}% Acc</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Deliberation Debate & Consensus Canvas */}
      {activeDebate && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[36px] p-8 sm:p-10 shadow-sm space-y-8">
          {/* Active Debate Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-[#E6E2DA] gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Evaluated Proposal
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3A31] leading-snug">
                {activeDebate.question}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-[#8C9A84] font-semibold uppercase block">
                  Consensus Agreement
                </span>
                <span className="text-3xl font-serif font-bold text-[#2D3A31]">
                  {activeDebate.consensusScore}%
                </span>
              </div>

              <div
                className={cn(
                  "px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider",
                  activeDebate.finalVerdict === "APPROVED"
                    ? "bg-[#8C9A84]/15 text-[#8C9A84] border-[#8C9A84]/30"
                    : activeDebate.finalVerdict === "CONDITIONAL"
                    ? "bg-[#C27B66]/15 text-[#C27B66] border-[#C27B66]/30"
                    : "bg-[#2D3A31]/15 text-[#2D3A31] border-[#2D3A31]/30"
                )}
              >
                {activeDebate.finalVerdict}
              </div>
            </div>
          </div>

          {/* 5 Member Individual Verdict Cards */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
              5-Member Individual Evaluations
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDebate.verdicts.map((v) => (
                <div
                  key={v.memberId}
                  className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-5 flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#2D3A31]">
                        {v.memberName}
                      </span>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full border text-[10px] font-semibold",
                          getVerdictBadge(v.verdict)
                        )}
                      >
                        {v.verdict}
                      </span>
                    </div>

                    <p className="text-xs text-[#2D3A31]/80 leading-relaxed">
                      {v.argument}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#E6E2DA] space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#8C9A84] font-medium">{v.keyMetric}</span>
                      <span className="font-bold text-[#2D3A31]">{v.confidence}% Conf</span>
                    </div>
                    <span className="text-[10px] text-[#2D3A31]/60 block leading-tight">
                      {v.aiEngineDetail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Synthesis Summary */}
          <div className="p-6 bg-[#F2F0EB] border border-[#E6E2DA] rounded-[28px] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D3A31]">
              <CheckCircle2 className="w-4 h-4 text-[#8C9A84]" />
              <span>Executive Council Synthesis Directive</span>
            </div>
            <p className="text-xs sm:text-sm text-[#2D3A31]/90 leading-relaxed">
              {activeDebate.synthesisSummary}
            </p>
          </div>
        </div>
      )}

      {/* 5. Dedicated Advanced AI Features Section (Speed RAG, GAN, RNN, RLHF) */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[36px] p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
              Advanced AI Engine Matrix
            </h3>
            <p className="text-xs text-[#2D3A31]/70 mt-0.5">
              Deep architecture telemetry for Speed RAG, GAN Discriminator, RNN Sequence Predictor, and RLHF Reward Optimizer.
            </p>
          </div>

          {/* Engine Tabs */}
          <div className="flex bg-[#F2F0EB] border border-[#E6E2DA] rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveEngineTab("SPEED_RAG")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all",
                activeEngineTab === "SPEED_RAG"
                  ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                  : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
              )}
            >
              Speed RAG
            </button>
            <button
              onClick={() => setActiveEngineTab("GAN")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all",
                activeEngineTab === "GAN"
                  ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                  : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
              )}
            >
              GAN
            </button>
            <button
              onClick={() => setActiveEngineTab("RNN")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all",
                activeEngineTab === "RNN"
                  ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                  : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
              )}
            >
              RNN
            </button>
            <button
              onClick={() => setActiveEngineTab("RLHF")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all",
                activeEngineTab === "RLHF"
                  ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                  : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
              )}
            >
              RLHF
            </button>
          </div>
        </div>

        {/* Tab 1: Speed RAG */}
        {activeEngineTab === "SPEED_RAG" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase">
                Vector Retrieval Speed
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">0.84 ms</span>
              <p className="text-xs text-[#2D3A31]/70">
                Sub-millisecond dense HNSW cosine similarity across 1536-d episodic memory chunks.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase">
                Hybrid Search Recall
              </span>
              <span className="text-3xl font-serif font-bold text-[#8C9A84]">98.4%</span>
              <p className="text-xs text-[#2D3A31]/70">
                Reciprocal Rank Fusion (RRF) combining BM25 sparse keywords with vector embeddings.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase">
                Active Chunks
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">1,248 Nodes</span>
              <p className="text-xs text-[#2D3A31]/70">
                Zero split-brain relational joins with PostgreSQL pgvector index.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: GAN */}
        {activeEngineTab === "GAN" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#C27B66] uppercase">
                Wasserstein Distance
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">0.12 W-Loss</span>
              <p className="text-xs text-[#2D3A31]/70">
                Minimax Discriminator verifying synthetic decisions against authentic user preferences.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#C27B66] uppercase">
                Perturbation Robustness
              </span>
              <span className="text-3xl font-serif font-bold text-[#C27B66]">94.6%</span>
              <p className="text-xs text-[#2D3A31]/70">
                Stress-tested against 200 adversarial edge-case variations with zero drift.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#C27B66] uppercase">
                Generator Epochs
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">3,400 Epochs</span>
              <p className="text-xs text-[#2D3A31]/70">
                Continuous background GAN training preventing cognitive overfitting.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: RNN */}
        {activeEngineTab === "RNN" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#7C8B74] uppercase">
                Recurrent Sequence Fit
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">94.2%</span>
              <p className="text-xs text-[#2D3A31]/70">
                Multi-layer GRU hidden state modeling long-range chronological workflow habits.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#7C8B74] uppercase">
                Temporal Horizon
              </span>
              <span className="text-3xl font-serif font-bold text-[#7C8B74]">14 Days</span>
              <p className="text-xs text-[#2D3A31]/70">
                Predictive forward lookahead forecasting upcoming architectural and coding needs.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#7C8B74] uppercase">
                Hidden State Dimensionality
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">512 Hidden (h_t)</span>
              <p className="text-xs text-[#2D3A31]/70">
                Continuous latent trajectory vector capturing behavioral momentum.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: RLHF */}
        {activeEngineTab === "RLHF" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#5A6B5C] uppercase">
                PPO Reward Alignment
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">+0.96 Score</span>
              <p className="text-xs text-[#2D3A31]/70">
                Reinforcement Learning from Human Feedback optimizing for user-aligned values.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#5A6B5C] uppercase">
                KL Divergence Regularization
              </span>
              <span className="text-3xl font-serif font-bold text-[#5A6B5C]">&Delta; &lt; 0.01</span>
              <p className="text-xs text-[#2D3A31]/70">
                Guarantees the model never drifts away from sovereign constitutional safety boundaries.
              </p>
            </div>

            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] p-6 space-y-2">
              <span className="text-[11px] font-semibold text-[#5A6B5C] uppercase">
                Feedback Signals
              </span>
              <span className="text-3xl font-serif font-bold text-[#2D3A31]">184 Pairwise</span>
              <p className="text-xs text-[#2D3A31]/70">
                Calibrated against direct user acceptances and corrections.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
