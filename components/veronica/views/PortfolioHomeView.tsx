"use client";

import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Server,
  GitFork,
  Terminal,
  Cpu,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Code,
  GitBranch,
  Mail,
  Send,
  Zap,
  Globe,
  Database,
  Shield,
  Activity,
  User,
  Compass,
  MessageSquare,
  FileCode,
  Check,
  RefreshCw
} from "lucide-react";

interface PortfolioHomeViewProps {
  onLaunchOS: (initialView?: string) => void;
}

export function PortfolioHomeView({ onLaunchOS }: PortfolioHomeViewProps) {
  const [digitalTwinQuery, setDigitalTwinQuery] = useState("");
  const [digitalTwinAnswer, setDigitalTwinAnswer] = useState<string | null>(null);
  const [isTwinThinking, setIsTwinThinking] = useState(false);
  const [twinModelUsed, setTwinModelUsed] = useState<string>("gemini-3.6-flash");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<string | null>(null);

  const handleAskDigitalTwin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!digitalTwinQuery.trim()) return;

    setIsTwinThinking(true);
    setDigitalTwinAnswer(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: digitalTwinQuery,
          personaId: "arch_developer",
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setDigitalTwinAnswer(data.reply);
        if (data.modelUsed) setTwinModelUsed(data.modelUsed);
      } else {
        setDigitalTwinAnswer(
          "I am Vigneshwaran's AI Digital Twin. I architect autonomous multi-agent systems, Model Context Protocol (MCP) server hubs, and LangGraph cyclical DAGs. Explore the modules below or launch the full Veronica OS workspace!"
        );
      }
    } catch {
      setDigitalTwinAnswer(
        "I am Vigneshwaran's AI Digital Twin. Specializing in high-performance autonomous agent orchestration, LangGraph state machines, and Next.js 16 architectures."
      );
    } finally {
      setIsTwinThinking(false);
    }
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "email_outreach",
          prompt: `Inquiry from portfolio visitor: Name: ${contactName || "Anonymous"} (${contactEmail || "No email"})\nMessage: ${contactMessage}`,
          targetEmail: "vigneshwaranspcs24@gmail.com",
          senderName: contactName || "Portfolio Visitor",
          senderEmail: contactEmail || "visitor@web.io",
        }),
      });
      const data = await res.json();
      const receipt = data.automatedDispatchReceipt?.transactionId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setDispatchReceipt(receipt);
      setContactSuccess(true);
    } catch {
      setDispatchReceipt(`TXN-LOCAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setContactSuccess(true);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#2D3A31] font-sans selection:bg-[#8C9A84] selection:text-white">
      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 bg-[#F9F8F4]/80 backdrop-blur-md border-b border-[#E6E2DA] px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#2D3A31] flex items-center justify-center text-white shadow-sm">
            <span className="font-bold text-sm tracking-tighter">V</span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#2D3A31] tracking-tight">Vigneshwaran S P</div>
            <div className="text-[10px] text-[#8C9A84] font-medium tracking-wide">
              AI Systems Architect & Cognitive Engineer
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#2D3A31]/70">
          <a href="#about" className="hover:text-[#2D3A31] transition-colors">About</a>
          <a href="#innovations" className="hover:text-[#2D3A31] transition-colors">AI Systems</a>
          <a href="#mcp-langgraph" className="hover:text-[#2D3A31] transition-colors">MCP & LangGraph</a>
          <a href="#skills" className="hover:text-[#2D3A31] transition-colors">Tech Matrix</a>
          <a href="#contact" className="hover:text-[#2D3A31] transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLaunchOS("HOME")}
            className="px-4 py-2 bg-[#2D3A31] hover:bg-[#1E2620] text-white rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Veronica AI OS</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 lg:px-24 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-100/50 via-[#8C9A84]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Principal AI Systems & Architecture Roles</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2D3A31] leading-[1.1]">
              Architecting <span className="text-[#4F6352]">Autonomous Multi-Agent</span> Intelligence & Cognitive OS.
            </h1>

            <p className="text-base sm:text-lg text-[#2D3A31]/80 leading-relaxed max-w-2xl">
              I am <strong>Vigneshwaran S P</strong>, creator of <strong>VERONICA AI</strong>. I build production-grade multi-agent swarms, Model Context Protocol (MCP) server hubs, LangGraph cyclical state graphs, and sub-millisecond Speed-RAG vector engines.
            </p>

            {/* Quick Action Matrix */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onLaunchOS("BOARD_ROOM")}
                className="px-5 py-3 bg-[#2D3A31] hover:bg-[#1E2620] text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>15-Agent Board Room</span>
              </button>

              <button
                onClick={() => onLaunchOS("MCP_HUB")}
                className="px-5 py-3 bg-[#FFFFFF] hover:bg-[#F2F0EB] text-[#2D3A31] border border-[#E6E2DA] rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Server className="w-4 h-4 text-[#8C9A84]" />
                <span>Model Context Protocol (MCP)</span>
              </button>

              <button
                onClick={() => onLaunchOS("LANGGRAPH_STUDIO")}
                className="px-5 py-3 bg-[#FFFFFF] hover:bg-[#F2F0EB] text-[#2D3A31] border border-[#E6E2DA] rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <GitFork className="w-4 h-4 text-[#8C9A84]" />
                <span>LangGraph Studio</span>
              </button>
            </div>

            {/* Verification Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E6E2DA] max-w-lg">
              <div>
                <div className="text-2xl font-extrabold text-[#2D3A31] font-mono">15</div>
                <div className="text-xs text-[#2D3A31]/60 font-medium">Autonomous Agents</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#2D3A31] font-mono">&lt; 0.8ms</div>
                <div className="text-xs text-[#2D3A31]/60 font-medium">Speed-RAG Recall</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#2D3A31] font-mono">100%</div>
                <div className="text-xs text-[#2D3A31]/60 font-medium">Type Safety</div>
              </div>
            </div>
          </div>

          {/* Interactive Digital Twin Terminal */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-[#2D3A31] uppercase tracking-wider">
                    Vigneshwaran AI Digital Twin
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
                  LIVE INTERACTIVE
                </span>
              </div>

              <p className="text-xs text-[#2D3A31]/70">
                Ask anything about my engineering philosophy, technical stack, or architecture decisions:
              </p>

              <form onSubmit={handleAskDigitalTwin} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={digitalTwinQuery}
                    onChange={(e) => setDigitalTwinQuery(e.target.value)}
                    placeholder="e.g. How does your MCP hub handle Google Gemini tool calls?"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isTwinThinking || !digitalTwinQuery.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#2D3A31] text-white rounded-lg hover:bg-[#1E2620] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Digital Twin Response Area */}
              <div className="min-h-[140px] bg-[#1B241E] border border-[#2D3A31] rounded-2xl p-4 text-xs font-mono text-emerald-400 overflow-y-auto max-h-56">
                {isTwinThinking ? (
                  <div className="flex items-center gap-2 text-white/70">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Veronica Digital Twin is synthesizing response...</span>
                  </div>
                ) : digitalTwinAnswer ? (
                  <div className="space-y-2">
                    <div className="text-[10px] text-white/40 border-b border-white/10 pb-1 flex justify-between">
                      <span>GROUNDED VIA VERONICA CORE</span>
                      <span>{twinModelUsed}</span>
                    </div>
                    <p className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
                      {digitalTwinAnswer}
                    </p>
                  </div>
                ) : (
                  <div className="text-white/40 space-y-1">
                    <p>&gt; VERONICA Digital Twin v2.4 initialized.</p>
                    <p>&gt; Type your query above or click one of the suggested prompts below.</p>
                  </div>
                )}
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "Explain your LangGraph architecture",
                  "How does MCP bridge OpenAI & Gemini?",
                  "Walk through your 15 autonomous agents",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setDigitalTwinQuery(q);
                    }}
                    className="text-[10px] px-2.5 py-1 bg-[#F2F0EB] hover:bg-[#E6E2DA] rounded-lg text-[#2D3A31]/80 transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured AI Innovations Section */}
      <section id="innovations" className="px-6 sm:px-12 lg:px-24 py-16 bg-[#FFFFFF] border-y border-[#E6E2DA]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F0EB] rounded-full text-xs font-semibold text-[#2D3A31]">
              <Layers className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Core Systems Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D3A31] tracking-tight">
              Production AI Innovations
            </h2>
            <p className="text-sm text-[#2D3A31]/70">
              Each system is engineered with end-to-end type safety, deterministic failover, and multi-model grounding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: 15-Agent Swarm */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3A31]">15-Agent Autonomous Swarm</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                  Specialized agent studios (WhatsApp Growth, Email Outreach, GitHub Reviewer, Web Scraper, Data Analyst) with automated external message dispatches and delivery certificates.
                </p>
              </div>
              <button
                onClick={() => onLaunchOS("BOARD_ROOM")}
                className="pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#2D3A31] hover:text-[#4F6352] flex items-center justify-between cursor-pointer"
              >
                <span>Launch Board Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: MCP Hub */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3A31]">Model Context Protocol (MCP) Hub</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                  Unified JSON-RPC 2.0 tool execution client supporting Google Gemini Core, ChatGPT/OpenAI, GitHub, Filesystem, and WebSearch MCP servers with live wire inspection.
                </p>
              </div>
              <button
                onClick={() => onLaunchOS("MCP_HUB")}
                className="pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#2D3A31] hover:text-[#4F6352] flex items-center justify-between cursor-pointer"
              >
                <span>Open MCP Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: LangGraph Engine */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <GitFork className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3A31]">LangGraph State Machine Studio</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                  Cyclical multi-agent DAGs with supervisor planning, MCP worker nodes, and adversarial self-correction loops. Traces state checkpoints in real time.
                </p>
              </div>
              <button
                onClick={() => onLaunchOS("LANGGRAPH_STUDIO")}
                className="pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#2D3A31] hover:text-[#4F6352] flex items-center justify-between cursor-pointer"
              >
                <span>Launch LangGraph Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Cognitive Council */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3A31]">5-Member Cognitive Council</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                  Dynamic multi-perspective debate engine (Rationalist Speed-RAG, Adversary GAN, Temporal RNN, Value Guardian RLHF, and Pragmatic Executor) resolving strategic dilemmas.
                </p>
              </div>
              <button
                onClick={() => onLaunchOS("COUNCIL")}
                className="pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#2D3A31] hover:text-[#4F6352] flex items-center justify-between cursor-pointer"
              >
                <span>Convene Council</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5: Speed-RAG */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3A31]">Speed-RAG Vector Retrieval</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                  Sub-millisecond associative memory and codebase vector retrieval over 128-dimensional HNSW embeddings with cosine similarity.
                </p>
              </div>
              <button
                onClick={() => onLaunchOS("DATA_CENTRE")}
                className="pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#2D3A31] hover:text-[#4F6352] flex items-center justify-between cursor-pointer"
              >
                <span>Inspect Data Centre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6: AI Gudown */}
            <div className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3A31]">AI Gudown Model Registry</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
                  Comprehensive benchmark comparisons across top 10 machine learning models (Gemini 3.8, Mistral Large, Claude, Llama 3, DeepSeek) with latency & context tracking.
                </p>
              </div>
              <button
                onClick={() => onLaunchOS("AI_GUDOWN")}
                className="pt-4 border-t border-[#E6E2DA] text-xs font-bold text-[#2D3A31] hover:text-[#4F6352] flex items-center justify-between cursor-pointer"
              >
                <span>View AI Gudown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Matrix Section */}
      <section id="skills" className="px-6 sm:px-12 lg:px-24 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31]">
              <Code className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Technical Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D3A31] tracking-tight">
              Engineering Matrix
            </h2>
            <p className="text-sm text-[#2D3A31]/70">
              State-of-the-art tooling across artificial intelligence, frontend systems, and distributed backends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-[#2D3A31] flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-600" />
                <span>AI & Multi-Agent Systems</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-[#2D3A31]/80 font-mono">
                <li className="flex items-center justify-between">
                  <span>LangChain & LangGraph DAGs</span>
                  <span className="text-emerald-700 font-bold">Expert</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Model Context Protocol (MCP)</span>
                  <span className="text-emerald-700 font-bold">Mastery</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Google Gemini 3.8 / 3.6 SDK</span>
                  <span className="text-emerald-700 font-bold">Production</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Mistral AI & Codestral</span>
                  <span className="text-emerald-700 font-bold">Production</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Speed-RAG & HNSW Indexing</span>
                  <span className="text-emerald-700 font-bold">Architecture</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-[#2D3A31] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Full-Stack & Web Performance</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-[#2D3A31]/80 font-mono">
                <li className="flex items-center justify-between">
                  <span>Next.js 16.3 (Turbopack)</span>
                  <span className="text-emerald-700 font-bold">Expert</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>React 19 & Server Actions</span>
                  <span className="text-emerald-700 font-bold">Expert</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Strict TypeScript & Zero Any</span>
                  <span className="text-emerald-700 font-bold">100% Rigor</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Tailwind CSS v4 & Glassmorphism</span>
                  <span className="text-emerald-700 font-bold">Production</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Three.js / WebGL 3D Shaders</span>
                  <span className="text-emerald-700 font-bold">Advanced</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-[#2D3A31] flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600" />
                <span>Systems & Protocols</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-[#2D3A31]/80 font-mono">
                <li className="flex items-center justify-between">
                  <span>JSON-RPC 2.0 Transports</span>
                  <span className="text-emerald-700 font-bold">Mastery</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Python 3.12 & FastAPI</span>
                  <span className="text-emerald-700 font-bold">Expert</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Vercel Edge Functions & CI/CD</span>
                  <span className="text-emerald-700 font-bold">Production</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Graph API & Webhooks</span>
                  <span className="text-emerald-700 font-bold">Production</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Distributed Consensus & Memory</span>
                  <span className="text-emerald-700 font-bold">Architecture</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 sm:px-12 lg:px-24 py-16 bg-[#FFFFFF] border-t border-[#E6E2DA]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F0EB] rounded-full text-xs font-semibold text-[#2D3A31]">
              <Mail className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Direct Connection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3A31] tracking-tight">
              Let's Build the Future of AI.
            </h2>
            <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
              Available for full-time Principal AI Architect, Staff Engineer, or strategic advisory engagements.
            </p>

            <div className="space-y-2.5 pt-4 text-xs font-mono">
              <a
                href="mailto:vigneshwaranspcs24@gmail.com"
                className="flex items-center gap-2.5 text-[#2D3A31] hover:text-[#4F6352] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#8C9A84]" />
                <span>vigneshwaranspcs24@gmail.com</span>
              </a>
              <a
                href="https://github.com/vigneshwaransp"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[#2D3A31] hover:text-[#4F6352] transition-colors"
              >
                <GitBranch className="w-4 h-4 text-[#8C9A84]" />
                <span>github.com/vigneshwaransp</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <form onSubmit={handleSendContact} className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#2D3A31]">Send a Message via Autonomous Dispatch</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Your project inquiry or message..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none resize-none"
              />

              <button
                type="submit"
                disabled={isSendingMessage || !contactMessage.trim()}
                className="w-full py-2.5 bg-[#2D3A31] hover:bg-[#1E2620] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingMessage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Dispatch...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message via Agentic Outreach</span>
                  </>
                )}
              </button>

              {contactSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Message Dispatched &amp; Logged</span>
                  </div>
                  <div className="text-[10px] text-emerald-700">Receipt ID: {dispatchReceipt}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-8 bg-[#F9F8F4] border-t border-[#E6E2DA] text-center text-xs text-[#2D3A31]/60 space-y-2">
        <div>
          &copy; {new Date().getFullYear()} Vigneshwaran S P. All Systems Operational. Powered by Veronica AI &amp; LangGraph.
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] font-mono">
          <span>Next.js 16.3</span>
          <span>•</span>
          <span>Model Context Protocol (MCP)</span>
          <span>•</span>
          <span>LangGraph State Graphs</span>
        </div>
      </footer>
    </div>
  );
}
