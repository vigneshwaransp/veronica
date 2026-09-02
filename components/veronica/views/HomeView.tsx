"use client";

import React, { useState } from "react";
import { UserProfile, Persona, MemoryNode, DecisionSimulation, AuditEvent } from "@/types/veronica";
import { VeronicaMindStream } from "@/components/veronica/views/VeronicaMindStream";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Brain,
  Sparkles,
  ArrowRight,
  Database,
  Shield,
  Send,
  Zap,
  Leaf,
  CheckCircle2,
  Users,
  Scale,
  Cpu,
  Globe,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

interface HomeViewProps {
  user: UserProfile;
  activePersona: Persona;
  simulations: DecisionSimulation[];
  memories: MemoryNode[];
  auditEvents: AuditEvent[];
  onNavigateView: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  activePersona,
  simulations,
  memories,
  auditEvents,
  onNavigateView,
}) => {
  const [quickThought, setQuickThought] = useState("");
  const [isThoughtSaved, setIsThoughtSaved] = useState(false);

  const handleSaveQuickThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim()) return;

    veronicaStore.addMemory({
      type: "preference",
      content: quickThought.trim(),
      category: "Home Thought Stream",
      importance: 90,
      confidence: 95,
      recency: "HIGH",
      evidenceCount: 1,
      source: "Living Mindstream",
      tags: ["quick-thought", "user-prior"],
      linkedNodeIds: [],
    });

    setQuickThought("");
    setIsThoughtSaved(true);
    setTimeout(() => setIsThoughtSaved(false), 2200);
  };

  return (
    <div className="w-full space-y-16 py-4 font-sans text-[#2D3A31]">
      {/* 1. Full-Page Editorial Hero Section */}
      <section className="w-full border-b border-[#E6E2DA] pb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          {/* Left Column: Signature Typography & Description */}
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#8C9A84]">
              <Leaf className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Computational Digital Self • Living Resonance</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-cursive text-[#2D3A31] leading-none tracking-wide">
                Veronica
              </h1>
              <p className="text-2xl sm:text-3xl font-serif text-[#2D3A31]/90 leading-tight">
                A serene digital mirror of your <span className="italic text-[#C27B66]">mind</span>, intuition, and decision workflows.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#2D3A31]/75 leading-relaxed max-w-2xl">
              Continuously harmonizing with your preferences, architecture patterns, and operational habits.
              <br />
              <em className="font-serif italic text-xs sm:text-sm text-[#2D3A31]/90">
                &ldquo;Don&apos;t just assist the user. Understand how the user operates.&rdquo;
              </em>
            </p>

            {/* Direct Action Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigateView("AI_GUDOWN")}
                className="botanical-btn-primary"
              >
                <Cpu className="w-4 h-4" />
                <span>AI Gudown (Top 10 ML)</span>
              </button>

              <button
                onClick={() => onNavigateView("DATA_CENTRE")}
                className="px-5 py-2.5 rounded-full border border-[#E6E2DA] hover:bg-[#F2F0EB] text-xs font-semibold text-[#2D3A31] flex items-center gap-2 transition-all shadow-sm"
              >
                <Database className="w-4 h-4 text-[#8C9A84]" />
                <span>Data Centre</span>
              </button>

              <button
                onClick={() => onNavigateView("BOARD_ROOM")}
                className="px-5 py-2.5 rounded-full border border-[#E6E2DA] hover:bg-[#F2F0EB] text-xs font-semibold text-[#2D3A31] flex items-center gap-2 transition-all shadow-sm"
              >
                <Users className="w-4 h-4 text-[#8C9A84]" />
                <span>AI Board Room</span>
              </button>

              <button
                onClick={() => onNavigateView("CHAT")}
                className="botanical-btn-secondary"
              >
                <MessageSquare className="w-4 h-4 text-[#8C9A84]" />
                <span>Converse with Twin</span>
              </button>

              <button
                onClick={() => onNavigateView("SIMULATION")}
                className="px-5 py-2.5 rounded-full border border-[#E6E2DA] hover:bg-[#F2F0EB] text-xs font-semibold text-[#2D3A31] flex items-center gap-2 transition-all shadow-sm"
              >
                <Brain className="w-4 h-4 text-[#8C9A84]" />
                <span>What Would I Do?</span>
              </button>

              <button
                onClick={() => onNavigateView("COUNCIL")}
                className="px-5 py-2.5 rounded-full border border-[#E6E2DA] hover:bg-[#F2F0EB] text-xs font-semibold text-[#2D3A31] flex items-center gap-2 transition-all shadow-sm"
              >
                <Scale className="w-4 h-4 text-[#8C9A84]" />
                <span>The Council</span>
              </button>

              <button
                onClick={() => onNavigateView("STUDIO")}
                className="px-5 py-2.5 rounded-full border border-[#E6E2DA] hover:bg-[#F2F0EB] text-xs font-semibold text-[#2D3A31] flex items-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#8C9A84]" />
                <span>Executive Studio</span>
              </button>
            </div>
          </div>

          {/* Right Column: Model Synchronization Status */}
          <div className="w-full lg:w-80 border-l lg:border-l border-[#E6E2DA] lg:pl-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
                Current Lens
              </span>
              <span className="text-xs font-bold text-[#C27B66] px-2.5 py-0.5 bg-[#F2F0EB] rounded-full border border-[#E6E2DA]">
                {activePersona.parameters.technicalDepth}% Rigor
              </span>
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-[#2D3A31]">{activePersona.name}</h3>
              <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">{activePersona.role}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E6E2DA]">
              <div className="flex justify-between text-xs">
                <span className="text-[#2D3A31]/70">Model Calibration</span>
                <span className="font-semibold text-[#2D3A31]">{user.modelConfidence}% Calibrated</span>
              </div>
              <div className="w-full h-1.5 bg-[#E6E2DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8C9A84] rounded-full"
                  style={{ width: `${user.modelConfidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Aligned Telemetry Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-[#E6E2DA]">
          <div className="space-y-1">
            <span className="text-xs text-[#8C9A84] font-medium block">Cognitive Memory Traces</span>
            <span className="text-3xl font-serif font-bold text-[#2D3A31]">{memories.length}</span>
            <span className="text-xs text-[#2D3A31]/60 block">6 multi-tier dimensions</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8C9A84] font-medium block">Bayesian Decision Alignment</span>
            <span className="text-3xl font-serif font-bold text-[#2D3A31]">89.4%</span>
            <span className="text-xs text-[#2D3A31]/60 block">Empirically confirmed</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8C9A84] font-medium block">The Cognitive Council</span>
            <span className="text-3xl font-serif font-bold text-[#2D3A31]">5 AI Seats</span>
            <span className="text-xs text-[#2D3A31]/60 block">Speed RAG, GAN, RNN, RLHF</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-[#8C9A84] font-medium block">Reasoning Engine</span>
            <span className="text-2xl font-serif font-bold text-[#8C9A84] truncate block">Mistral AI</span>
            <span className="text-xs text-[#2D3A31]/60 block">Live sub-ms streaming</span>
          </div>
        </div>
      </section>

      {/* 2. Main Interactive Workspace (Seamless Two-Column Layout) */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-[#E6E2DA] pb-16">
        {/* Left Column: Digital Twin Consciousness Stream */}
        <div className="lg:col-span-7 space-y-6">
          <VeronicaMindStream
            user={user}
            activePersona={activePersona}
            memories={memories}
            onNavigateView={onNavigateView}
          />
        </div>

        {/* Right Column: Quick Capture & Latest Dilemma */}
        <div className="lg:col-span-5 space-y-10 lg:border-l lg:border-[#E6E2DA] lg:pl-12">
          {/* Quick Thought Capture */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84]">
                <Sparkles className="w-4 h-4 text-[#8C9A84]" />
                <span>Nurture a Preference or Thought</span>
              </div>
              {isThoughtSaved && (
                <span className="text-xs font-semibold text-[#8C9A84] flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized!
                </span>
              )}
            </div>

            <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
              Teach Veronica how you operate.
            </h3>

            <form onSubmit={handleSaveQuickThought} className="space-y-3">
              <input
                type="text"
                value={quickThought}
                onChange={(e) => setQuickThought(e.target.value)}
                placeholder="e.g. I prefer declarative UI patterns and zero-dependency micro-libraries..."
                className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none focus:border-[#8C9A84] shadow-sm transition-all"
              />

              <button
                type="submit"
                disabled={!quickThought.trim()}
                className="w-full botanical-btn-primary py-3 text-xs font-semibold rounded-full disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <span>Feed into Living Memory Graph</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick Dilemma Card */}
          <div className="space-y-4 pt-6 border-t border-[#E6E2DA]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
                Latest Decision Dilemma
              </span>
              <span className="px-2.5 py-0.5 bg-[#F2F0EB] rounded-full text-xs font-semibold text-[#2D3A31]">
                Probabilistic
              </span>
            </div>

            {simulations[0] ? (
              <div className="space-y-4">
                <p className="text-sm font-medium text-[#2D3A31] leading-relaxed">
                  {simulations[0].situation}
                </p>

                <div className="pl-4 border-l-2 border-[#8C9A84] py-1 space-y-1">
                  <span className="text-xs font-semibold text-[#8C9A84] uppercase block">
                    Predicted Selection
                  </span>
                  <p className="text-base font-serif font-bold text-[#2D3A31]">
                    {simulations[0].predictedChoiceTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#2D3A31]/60 pt-2">
                  <span>Confidence: <strong className="text-[#8C9A84]">{simulations[0].confidence}%</strong></span>
                  <button
                    onClick={() => onNavigateView("SIMULATION")}
                    className="text-[#8C9A84] hover:text-[#2D3A31] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Simulate Dilemma</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#2D3A31]/70 py-4">
                Run a decision simulation to see your predicted choices.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Four Core Pillars of the Digital Self (Minimalist Open Strip) */}
      <section className="w-full space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
            System Architecture
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2D3A31]">
            Core Modules of the Digital Self
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            onClick={() => onNavigateView("PERSONA")}
            className="cursor-pointer group space-y-3 p-4 rounded-2xl hover:bg-[#FFFFFF] transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C9A84] uppercase">
              <span>01</span>
              <span>•</span>
              <span>Personas</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-[#2D3A31] group-hover:text-[#8C9A84] transition-colors">
              Persona Lenses
            </h4>
            <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
              Developer, Researcher, Founder, and Designer cognitive archetypes.
            </p>
          </div>

          <div
            onClick={() => onNavigateView("MEMORY")}
            className="cursor-pointer group space-y-3 p-4 rounded-2xl hover:bg-[#FFFFFF] transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C9A84] uppercase">
              <span>02</span>
              <span>•</span>
              <span>Memory</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-[#2D3A31] group-hover:text-[#8C9A84] transition-colors">
              Memory Cosmos
            </h4>
            <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
              {memories.length} indexed memory nodes with strict provenance attribution.
            </p>
          </div>

          <div
            onClick={() => onNavigateView("COUNCIL")}
            className="cursor-pointer group space-y-3 p-4 rounded-2xl hover:bg-[#FFFFFF] transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C9A84] uppercase">
              <span>03</span>
              <span>•</span>
              <span>Council</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-[#2D3A31] group-hover:text-[#8C9A84] transition-colors">
              The Cognitive Council
            </h4>
            <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
              5 specialized AI members: Speed-RAG, GAN, RNN, and RLHF.
            </p>
          </div>

          <div
            onClick={() => onNavigateView("TRUST")}
            className="cursor-pointer group space-y-3 p-4 rounded-2xl hover:bg-[#FFFFFF] transition-all"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C9A84] uppercase">
              <span>04</span>
              <span>•</span>
              <span>Sovereignty</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-[#2D3A31] group-hover:text-[#8C9A84] transition-colors">
              Data Sovereignty
            </h4>
            <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
              Immutable audit stream, right to forget, and full JSON data export.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Cosmos Planetary Projects Matrix */}
      <section className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4 text-[#8C9A84]" />
              <span>Cosmos Planetary Ecosystem</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3A31]">
              Planetary AI Workspaces & Version Lineage
            </h3>
          </div>
          <button
            onClick={() => onNavigateView("SETTINGS")}
            className="text-xs font-semibold text-[#8C9A84] hover:text-[#2D3A31] underline flex items-center gap-1"
          >
            <span>Model Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earth - Veronica */}
          <div className="p-5 bg-[#F9F8F4] border-2 border-[#8C9A84] rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C9A84] uppercase tracking-wider">EARTH</span>
                <span className="px-2.5 py-0.5 bg-[#8C9A84] text-[#FFFFFF] rounded-full text-[10px] font-bold">
                  ACTIVE OS
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold text-[#2D3A31]">Veronica</h4>
              <p className="text-xs text-[#2D3A31]/75 leading-relaxed">
                Autonomous digital self with AI Gudown (Top 10 ML models), Data Centre, and AI Board Room.
              </p>
            </div>
            <button
              onClick={() => onNavigateView("CHAT")}
              className="w-full botanical-btn-primary text-xs py-2 justify-center"
            >
              <span>Talk to Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Venus - Paper */}
          <div className="p-5 bg-[#F9F8F4] border border-[#E6E2DA] hover:border-[#8C9A84] rounded-2xl space-y-3 flex flex-col justify-between transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C9A84] uppercase tracking-wider">VENUS</span>
                <span className="px-2.5 py-0.5 bg-[#2D3A31] text-[#FFFFFF] rounded-full text-[10px] font-bold">
                  LIVE WORKSPACE
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold text-[#2D3A31]">Paper Project</h4>
              <p className="text-xs text-[#2D3A31]/75 leading-relaxed">
                Full working site for autonomous document synthesis and LaTeX publication workflows.
              </p>
            </div>
            <a
              href="https://paperc.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 bg-[#FFFFFF] border border-[#E6E2DA] hover:border-[#8C9A84] text-[#2D3A31] rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>Launch paperc.vercel.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mars - CresentX */}
          <div className="p-5 bg-[#C27B66]/10 border border-[#C27B66]/30 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C27B66] uppercase tracking-wider">MARS</span>
                <span className="px-2.5 py-0.5 bg-[#C27B66] text-[#FFFFFF] rounded-full text-[10px] font-bold">
                  LEGACY PREVIEW
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold text-[#2D3A31]">CresentX</h4>
              <div className="p-2.5 bg-[#C27B66]/15 rounded-xl flex items-start gap-2 text-[11px] text-[#C27B66] font-semibold leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#C27B66]" />
                <span>LLM Suspended — Only for view purpose. Use Gemini model in settings.</span>
              </div>
            </div>
            <a
              href="https://cresentx.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 bg-[#C27B66] hover:bg-[#2D3A31] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>Launch cresentx.vercel.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
