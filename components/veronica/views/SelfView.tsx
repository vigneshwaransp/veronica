"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { MarkdownViewer } from "@/components/veronica/ui/MarkdownViewer";
import { cn } from "@/lib/utils";
import {
  User,
  Sparkles,
  Award,
  Target,
  MessageSquare,
  Briefcase,
  Save,
  Check,
  Leaf,
  Sliders,
  Radio,
  Cpu,
  Volume2,
  Plus,
  Trash2,
  Send,
  Zap,
  RotateCw
} from "lucide-react";

interface SelfViewProps {
  user: UserProfile;
}

export const SelfView: React.FC<SelfViewProps> = ({ user }) => {
  const [profile, setProfile] = useState<UserProfile>({ ...user });
  const [isSaved, setIsSaved] = useState(false);
  const [newInterestInput, setNewInterestInput] = useState("");

  // Tone Mimicry Simulation State
  const [tonePrompt, setTonePrompt] = useState("Explain why we chose PostgreSQL with pgvector over separate Pinecone vector instances for our architecture.");
  const [isGeneratingToneResponse, setIsGeneratingToneResponse] = useState(false);
  const [simulatedToneOutput, setSimulatedToneOutput] = useState<string | null>(
    `**Architectural Invariant:** We opted for PostgreSQL with \`pgvector\` because co-locating relational business entities and dense vector embeddings into a single ACID transactional boundary eliminates two-phase commit overhead and distributed state synchronization drift.\n\nKey Trade-offs:\n1. **Sub-millisecond Latency:** 0.84ms dense vector lookup using HNSW indexes with zero network hops to an external SaaS.\n2. **Data Sovereignty:** 100% self-hosted vector persistence with zero unencrypted outbound API calls.\n3. **Transactional Integrity:** Metadata joins and embeddings occur in a single atomic SQL transaction.`
  );

  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    if (!profile.interests.includes(newInterestInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterestInput.trim()],
      }));
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSimulateAuthenticTone = () => {
    if (!tonePrompt.trim()) return;
    setIsGeneratingToneResponse(true);

    setTimeout(() => {
      let output = "";
      const p = tonePrompt.toLowerCase();

      if (p.includes("postgres") || p.includes("database") || p.includes("vector")) {
        output = `**Direct Assessment:** PostgreSQL + \`pgvector\` provides single-database consistency, eliminates network hops, and keeps P99 vector recall bounded at <1.2ms.\n\n- **Zero Out-of-Sync Drift:** Atomic transactions ensure relational rows and vector embeddings stay strictly synchronized.\n- **Zero Cost Sprawl:** Avoids vendor lock-in and per-query SaaS pricing tiers.\n- **HNSW Indexing:** Provides 98.4% recall with logarithmic scaling curves.`;
      } else if (p.includes("review") || p.includes("code") || p.includes("sql")) {
        output = `**Code Review Directive:** The proposed implementation contains an unbounded \`SELECT *\` on the hot memory path. \n\n1. Replace with targeted column projection to prevent excessive memory allocations.\n2. Add composite index on \`(tenant_id, created_at DESC)\` for index-only scan execution.\n3. Ensure async connections are pooled with \`max_connections = 20\`.`;
      } else {
        output = `**Core Thesis regarding "${tonePrompt}":**\n\n- **Principle 1 (Rigor):** Every state change must be cryptographically auditable and type-safe at compile time.\n- **Principle 2 (Performance):** Zero unneeded runtime abstractions. Keep latency strictly sub-millisecond.\n- **Principle 3 (Autonomy):** Delegate routine operational loops to Level 2 agents while retaining Level 3 human veto on destructive state transitions.`;
      }

      setSimulatedToneOutput(output);
      setIsGeneratingToneResponse(false);
    }, 600);
  };

  const handleSave = () => {
    const currentUser = veronicaStore.getUser();
    Object.assign(currentUser, profile);
    veronicaStore.logAuditEvent({
      agentRole: "PERSONA AGENT",
      agentName: "VERONICA Core",
      action: "Updated Digital Self Identity & Tone Mirroring Matrix",
      impactLevel: "LOW",
      confirmationRequired: false,
      status: "SUCCESS",
      details: `Saved identity parameters and calibrated communication tone for ${profile.name}.`,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            The Digital <span className="italic text-[#8C9A84]">Self</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Retains conversation interests, mirrors your authentic communication tone, and adapts personality matrix parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold shadow-sm"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>Identity & Tone Synchronized</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Identity Matrix</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Core Identity Card */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <User className="w-4 h-4 text-[#8C9A84]" />
            <span>Human Baseline Identity & Persona Anchor</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                Primary Title & Specialty
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                Personal Bio & Behavioral Thesis
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-3 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
            </div>
          </div>
        </div>

        {/* Right: Goals & Retained Interests Tracker */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84]">
              <Target className="w-4 h-4 text-[#8C9A84]" />
              <span>Retained Interests & Active Vectors</span>
            </div>
            <span className="text-[10px] font-mono text-[#8C9A84]">Mined from Sessions</span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                placeholder="Add learned interest (e.g. Speed-RAG, Next.js 16, pgvector)..."
                className="flex-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl px-3 py-2 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
              <button
                onClick={handleAddInterest}
                className="botanical-btn-primary px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-medium text-[#2D3A31] group"
                >
                  <Sparkles className="w-3 h-3 text-[#8C9A84]" />
                  <span>{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition-opacity ml-1"
                    title="Remove interest"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Active Goals */}
          <div className="pt-3 border-t border-[#E6E2DA] space-y-2">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
              Active Strategic Goals
            </span>
            <div className="space-y-2">
              {profile.goals.map((g) => (
                <div
                  key={g.id}
                  className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#2D3A31] block">{g.title}</span>
                    <span className="text-[10px] text-[#8C9A84]">Priority: {g.priority}</span>
                  </div>
                  <span className="text-[#8C9A84] text-xs font-bold">{g.progress}% Complete</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. AUTHENTIC TONE MIRRORING & SIMULATOR TEST BENCH */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#F2F0EB] text-[#8C9A84] rounded-full text-xs font-semibold uppercase mb-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Adaptive Tone Mirroring Engine</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
              Speak in My Authentic Tone Simulator
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8C9A84]">
            Calibrated from {profile.totalSimulationsCount || 184} conversation turns
          </span>
        </div>

        {/* Tone Parameter Sliders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#8C9A84]">Directness</span>
              <span className="font-bold text-[#2D3A31]">{profile.communicationStyle.directness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={profile.communicationStyle.directness}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  communicationStyle: {
                    ...profile.communicationStyle,
                    directness: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-[#8C9A84]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#8C9A84]">Formality</span>
              <span className="font-bold text-[#2D3A31]">{profile.communicationStyle.formality}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={profile.communicationStyle.formality}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  communicationStyle: {
                    ...profile.communicationStyle,
                    formality: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-[#8C9A84]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#8C9A84]">Technical Depth</span>
              <span className="font-bold text-[#2D3A31]">{profile.communicationStyle.technicalDepth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={profile.communicationStyle.technicalDepth}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  communicationStyle: {
                    ...profile.communicationStyle,
                    technicalDepth: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-[#8C9A84]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#8C9A84]">Humor / Wit</span>
              <span className="font-bold text-[#2D3A31]">{profile.communicationStyle.humor}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={profile.communicationStyle.humor}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  communicationStyle: {
                    ...profile.communicationStyle,
                    humor: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-[#8C9A84]"
            />
          </div>
        </div>

        {/* Live Simulator Test Input */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
            Test Inquiry (Twin will respond in your authentic cadence & vocabulary):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={tonePrompt}
              onChange={(e) => setTonePrompt(e.target.value)}
              placeholder="Ask a technical or architectural question..."
              className="flex-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
            />
            <button
              onClick={handleSimulateAuthenticTone}
              disabled={isGeneratingToneResponse || !tonePrompt.trim()}
              className="botanical-btn-primary px-6 py-3 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
            >
              {isGeneratingToneResponse ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Tone...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Speak In My Tone</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Questions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-semibold text-[#8C9A84]">Sample Prompts:</span>
            {[
              "Why PostgreSQL pgvector over Pinecone?",
              "Code review directive on slow SQL query",
              "What is our core engineering thesis?"
            ].map((qp) => (
              <button
                key={qp}
                onClick={() => {
                  setTonePrompt(qp);
                }}
                className="text-[11px] px-3 py-1 bg-[#F2F0EB] hover:bg-[#E6E2DA] rounded-full text-[#2D3A31] transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Tone Output Card */}
        {simulatedToneOutput && (
          <div className="p-6 bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8C9A84] border-b border-[#E6E2DA] pb-2">
              <span className="font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#8C9A84]" />
                <span>Simulated Output in {profile.name}&apos;s Authentic Tone</span>
              </span>
              <span className="font-mono">Directness: {profile.communicationStyle.directness}% • Technical: {profile.communicationStyle.technicalDepth}%</span>
            </div>

            <div className="text-xs sm:text-sm text-[#2D3A31] leading-relaxed">
              <MarkdownViewer content={simulatedToneOutput} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
