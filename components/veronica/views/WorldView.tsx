"use client";

import React, { useState } from "react";
import { VirtualDesktopWindow } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Code,
  Globe,
  FileText,
  Database,
  Cpu,
  X,
  Play,
  Send,
  Leaf
} from "lucide-react";

interface WorldViewProps {
  windows: VirtualDesktopWindow[];
}

export const WorldView: React.FC<WorldViewProps> = ({ windows }) => {
  const [activeWindow, setActiveWindow] = useState<VirtualDesktopWindow["id"]>("terminal");

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "VERONICA VIRTUAL WORKSPACE v1.0.0",
    "Type 'help' to inspect available computational commands.",
    "----------------------------------------------------",
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  // Code Editor State
  const [codeContent, setCodeContent] = useState(`// VERONICA Autonomous Neural Twin Pipeline
import { veronicaStore } from "@/lib/veronica-store";

export async function simulateUserHabits(query: string) {
  const persona = veronicaStore.getActivePersona();
  const memories = veronicaStore.getMemories();
  
  return {
    calibratedPersona: persona.name,
    activeTraces: memories.length,
    responseHarmonized: true,
  };
}`);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHist = [...terminalHistory, `> ${terminalInput}`];

    if (cmd === "help") {
      newHist.push(
        "Available Commands:",
        "  status      - Display current VERONICA computational health",
        "  memories    - Query total recorded memory nodes",
        "  personas    - List active behavioral persona profiles",
        "  clear       - Clear terminal window"
      );
    } else if (cmd === "status") {
      newHist.push(
        "VERONICA Core: ONLINE",
        `Active Persona: ${veronicaStore.getActivePersona().name}`,
        `Model Confidence: ${veronicaStore.getUser().modelConfidence}%`,
        `Mistral Inference Engine: ACTIVE`
      );
    } else if (cmd === "memories") {
      newHist.push(`Total memory traces indexed: ${veronicaStore.getMemories().length}`);
    } else if (cmd === "personas") {
      const pList = veronicaStore.getPersonas().map((p) => `• ${p.name} (${p.role})`);
      newHist.push("Registered Personas:", ...pList);
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else {
      newHist.push(`Unknown command: '${cmd}'. Type 'help' for available commands.`);
    }

    setTerminalHistory(newHist);
    setTerminalInput("");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Virtual <span className="italic text-[#8C9A84]">Workspace</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Simulated development environment, live scratchpad, and memory inspector.
          </p>
        </div>

        {/* Window Selector Tabs */}
        <div className="flex bg-[#F2F0EB] border border-[#E6E2DA] rounded-full p-1 shadow-sm">
          <button
            onClick={() => setActiveWindow("terminal")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeWindow === "terminal"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveWindow("code")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeWindow === "code"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveWindow("database")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeWindow === "database"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            Memory Store
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] overflow-hidden shadow-sm flex flex-col h-[560px]">
        {/* Window Titlebar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#F9F8F4] border-b border-[#E6E2DA]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6E2DA]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#DCCFC2]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C9A84]" />
            <span className="text-xs font-semibold text-[#2D3A31] ml-3">
              {activeWindow.toUpperCase()} — VERONICA Sandbox
            </span>
          </div>
          <span className="text-xs text-[#8C9A84] font-semibold">Local Node v20.x</span>
        </div>

        {/* Window Content */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs">
          {activeWindow === "terminal" && (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-1.5 text-[#2D3A31] overflow-y-auto">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith(">") ? "text-[#8C9A84] font-bold" : "text-[#2D3A31]"}>
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E6E2DA]">
                <span className="text-[#8C9A84] font-bold">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a command (e.g. 'status', 'help')..."
                  className="flex-1 bg-transparent text-[#2D3A31] focus:outline-none"
                />
                <button type="submit" className="text-[#8C9A84] hover:text-[#2D3A31]">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {activeWindow === "code" && (
            <div className="flex flex-col h-full justify-between space-y-3">
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full flex-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-4 text-xs text-[#2D3A31] font-mono leading-relaxed focus:outline-none focus:border-[#8C9A84] resize-none"
              />
              <div className="flex items-center justify-between text-xs text-[#2D3A31]/60">
                <span>TypeScript • Strict Mode</span>
                <button className="botanical-btn-primary py-2 px-5 text-xs">
                  Run Script
                </button>
              </div>
            </div>
          )}

          {activeWindow === "database" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-2 text-xs text-[#8C9A84] font-semibold">
                <span>Memory ID</span>
                <span>Type</span>
                <span>Importance</span>
                <span>Confidence</span>
              </div>
              <div className="divide-y divide-[#F2F0EB]">
                {veronicaStore.getMemories().slice(0, 8).map((mem) => (
                  <div key={mem.id} className="py-2.5 flex items-center justify-between text-xs text-[#2D3A31]">
                    <span className="text-[#8C9A84]">{mem.id}</span>
                    <span className="px-2 py-0.5 bg-[#F2F0EB] rounded-full text-[10px] uppercase font-semibold">
                      {mem.type}
                    </span>
                    <span>{mem.importance}%</span>
                    <span className="text-[#8C9A84] font-bold">{mem.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
