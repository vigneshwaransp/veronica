"use client";

import React, { useState } from "react";
import { UserProfile, Persona, MemoryNode, ChatTrainingSample } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Database,
  Cpu,
  Brain,
  Zap,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Table,
  Upload,
  Download,
  Search,
  Filter,
  ArrowRight,
  Check,
  FileSpreadsheet,
  BarChart2,
  Sliders
} from "lucide-react";

interface DataCentreViewProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
  onNavigateView: (view: string) => void;
}

const INITIAL_CHAT_SAMPLES: ChatTrainingSample[] = [
  {
    id: "sample_001",
    timestamp: "2026-09-01 13:20",
    role: "user",
    text: "Simulate a decision: Should I build my new high-throughput platform with Next.js App Router or Remix?",
    category: "Architectural Dilemma",
    technicalRigor: 94,
    tokenCount: 22,
    sentimentScore: 0.15,
    ingestedStatus: "INDEXED",
  },
  {
    id: "sample_002",
    timestamp: "2026-09-01 13:22",
    role: "assistant",
    text: "Based on your active persona and Speed-RAG vector memory traces, I estimate you would choose Next.js with unified PostgreSQL pgvector single-engine ACID consistency.",
    category: "AI Synthesis",
    technicalRigor: 96,
    tokenCount: 31,
    sentimentScore: 0.85,
    ingestedStatus: "INDEXED",
  },
  {
    id: "sample_003",
    timestamp: "2026-09-01 12:45",
    role: "user",
    text: "Remember that I strongly prefer strict TypeScript return types and zero any across all backend and frontend modules.",
    category: "Constitutional Preference",
    technicalRigor: 98,
    tokenCount: 20,
    sentimentScore: 0.90,
    ingestedStatus: "INDEXED",
  },
  {
    id: "sample_004",
    timestamp: "2026-09-01 11:15",
    role: "user",
    text: "What backend stack would I most likely choose for a high-concurrency AI agent background worker?",
    category: "Systems Engineering",
    technicalRigor: 92,
    tokenCount: 17,
    sentimentScore: 0.20,
    ingestedStatus: "INDEXED",
  },
  {
    id: "sample_005",
    timestamp: "2026-09-01 10:30",
    role: "assistant",
    text: "Synthesized executive evaluation: Single-engine pgvector prevents split-brain inconsistencies and simplifies cloud migration.",
    category: "Architectural Decision",
    technicalRigor: 95,
    tokenCount: 16,
    sentimentScore: 0.75,
    ingestedStatus: "INDEXED",
  },
  {
    id: "sample_006",
    timestamp: "2026-09-01 09:40",
    role: "user",
    text: "Analyze attached PDF architecture whitepaper and compute sub-millisecond Speed-RAG embeddings.",
    category: "RAG Ingestion",
    technicalRigor: 99,
    tokenCount: 14,
    sentimentScore: 0.40,
    ingestedStatus: "INDEXED",
  },
];

export const DataCentreView: React.FC<DataCentreViewProps> = ({
  user,
  activePersona,
  memories,
  onNavigateView,
}) => {
  const [samples, setSamples] = useState<ChatTrainingSample[]>(() => {
    return veronicaStore.getChatTrainingSamples();
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isFeedingModels, setIsFeedingModels] = useState(false);
  const [feedSuccess, setFeedSuccess] = useState(false);

  const filteredSamples = samples.filter((s) => {
    const matchesSearch = s.text.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleFeedChatCorpusToModels = () => {
    setIsFeedingModels(true);
    setFeedSuccess(false);

    setTimeout(() => {
      veronicaStore.ingestChatToGudown(samples);
      setIsFeedingModels(false);
      setFeedSuccess(true);
      setTimeout(() => setFeedSuccess(false), 3500);

      veronicaStore.logAuditEvent({
        agentRole: "RESEARCH AGENT",
        agentName: "Data Centre Pipeline",
        action: "Dispatched Chat Corpus Ingestion to AI Gudown (10 Models)",
        impactLevel: "HIGH",
        confirmationRequired: false,
        status: "SUCCESS",
        details: `Transformed ${samples.length} conversation records into 12-dimensional feature matrix and calibrated SNS trajectory pipeline.`,
      });
    }, 1200);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(samples, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "veronica_chat_corpus_dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full space-y-12 py-4 font-sans text-[#2D3A31]">
      {/* 1. Header & Dispatch to Models Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between border-b border-[#E6E2DA] pb-8 gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#8C9A84]">
            <Database className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Chat Corpus Ingestion and Feature Matrix Hub</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2D3A31]">
            Data <span className="font-cursive text-5xl sm:text-6xl text-[#8C9A84]">Centre</span>
          </h2>
          <p className="text-sm text-[#2D3A31]/75 leading-relaxed">
            Ingests, tokenizes, and vectorizes all multi-turn conversations, user prompt reflections, and simulation logs into clean training feature matrices to feed the AI Gudown models.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateView("AI_GUDOWN")}
            className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] flex items-center gap-2 shadow-sm transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Inspect AI Gudown Models</span>
          </button>

          <button
            onClick={handleFeedChatCorpusToModels}
            disabled={isFeedingModels}
            className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold rounded-full disabled:opacity-40 flex items-center gap-2"
          >
            {isFeedingModels ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Vectorizing and Feeding...</span>
              </>
            ) : feedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Fed to 10 AI Gudown Models!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Feed Chat Corpus to AI Gudown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Dataset Metrics Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] shadow-sm">
        <div className="space-y-1">
          <span className="text-xs text-[#8C9A84] font-medium block">Total Chat Samples</span>
          <span className="text-2xl font-serif font-bold text-[#2D3A31]">1,420 Rows</span>
          <span className="text-[11px] text-[#2D3A31]/60 block">Multi-turn dialogues</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#8C9A84] font-medium block">Tokenized Vocabulary</span>
          <span className="text-2xl font-serif font-bold text-[#2D3A31]">184,200 Tokens</span>
          <span className="text-[11px] text-[#2D3A31]/60 block">Byte-Pair Encoding</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#8C9A84] font-medium block">Feature Matrix Shape</span>
          <span className="text-2xl font-serif font-bold text-[#8C9A84]">1,420 x 12</span>
          <span className="text-[11px] text-[#2D3A31]/60 block">Numerical normalized</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#8C9A84] font-medium block">Train / Test Split</span>
          <span className="text-2xl font-serif font-bold text-[#2D3A31]">80% / 20%</span>
          <span className="text-[11px] text-[#2D3A31]/60 block">Stratified partition</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#8C9A84] font-medium block">Corpus Integrity Score</span>
          <span className="text-2xl font-serif font-bold text-[#2D3A31]">99.4% Clean</span>
          <span className="text-[11px] text-[#2D3A31]/60 block">Zero corrupted labels</span>
        </div>
      </div>

      {/* 3. Feature Extraction & Engineering Breakdown */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
              Automated Feature Engineering Pipeline
            </span>
            <h4 className="font-serif font-bold text-xl text-[#2D3A31]">
              12 Engineered Numerical Features Extracted from Raw Text
            </h4>
          </div>
          <span className="text-xs text-[#2D3A31]/60">Auto-normalized via StandardScaler</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {[
            { name: "X1: Token Length", desc: "Word count density" },
            { name: "X2: Technical Depth", desc: "Algorithmic keyword rank" },
            { name: "X3: Directness Metric", desc: "Clarity coefficient" },
            { name: "X4: Sentiment Polarity", desc: "VADER valence score" },
            { name: "X5: Formality Level", desc: "Executive tone rating" },
            { name: "X6: Axiom Preference", desc: "First-principles bias" },
            { name: "X7: FOSS Density", desc: "Open-source keyword match" },
            { name: "X8: Type Strictness", desc: "Static type indicator" },
            { name: "X9: ACID Consistency", desc: "Relational preference" },
            { name: "X10: Bayesian Prior", desc: "Historical probability" },
            { name: "X11: Cosine Sim", desc: "1536-d vector match" },
            { name: "X12: Recurrence Freq", desc: "Temporal sequence rank" },
          ].map((feat, idx) => (
            <div key={idx} className="p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-1">
              <span className="font-bold text-[#2D3A31] block">{feat.name}</span>
              <span className="text-[11px] text-[#2D3A31]/60 block">{feat.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Chat Training Samples Table */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
              Training Corpus Dataset Records
            </span>
            <h4 className="font-serif font-bold text-xl text-[#2D3A31]">
              Chat Samples Matrix ({filteredSamples.length} Active Records)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-1.5 bg-[#F2F0EB] hover:bg-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Export Dataset (.json)</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D3A31]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat training text, category, or tokens..."
              className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {["ALL", "Architectural Dilemma", "Constitutional Preference", "Systems Engineering", "RAG Ingestion"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                  categoryFilter === cat
                    ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31]"
                    : "bg-[#FFFFFF] text-[#2D3A31]/70 border-[#E6E2DA] hover:bg-[#F2F0EB]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E2DA] text-[#8C9A84] uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-3">Sample ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Text Excerpt</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Technical Rigor</th>
                <th className="py-3 px-3">Tokens</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F0EB]">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-[#F9F8F4] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#2D3A31]">{sample.id}</td>
                  <td className="py-3 px-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", sample.role === "user" ? "bg-[#2D3A31] text-[#FFFFFF]" : "bg-[#8C9A84]/15 text-[#8C9A84]")}>
                      {sample.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-sm truncate text-[#2D3A31]/80">
                    {sample.text}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#2D3A31]">
                    {sample.category}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#8C9A84]">
                    {sample.technicalRigor}%
                  </td>
                  <td className="py-3 px-3 font-mono text-[#2D3A31]/70">
                    {sample.tokenCount}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-[#8C9A84]/15 text-[#8C9A84] rounded-full text-[10px] font-bold">
                      {sample.ingestedStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
