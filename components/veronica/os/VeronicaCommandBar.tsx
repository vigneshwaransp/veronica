"use client";

import React, { useState, useEffect, useRef } from "react";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Search,
  Brain,
  Sparkles,
  Database,
  Shield,
  Zap,
  ArrowRight,
  X,
  Compass,
  Image as ImageIcon,
  Volume2,
  FileText,
  Presentation,
  Mail,
  Users,
  Cpu,
  Settings,
  Globe,
  ExternalLink
} from "lucide-react";

interface VeronicaCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateView: (view: string) => void;
}

interface CommandOption {
  id: string;
  category: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const VeronicaCommandBar: React.FC<VeronicaCommandBarProps> = ({
  isOpen,
  onClose,
  onNavigateView,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const COMMANDS: CommandOption[] = [
    {
      id: "cmd_home",
      category: "WORKSPACE",
      label: "Open Botanical Home Dashboard",
      sublabel: "Overview of your digital twin, 3D neural brain, and quick actions",
      icon: Compass,
      action: () => {
        onNavigateView("HOME");
        onClose();
      },
    },
    {
      id: "cmd_board_room",
      category: "BOARD ROOM",
      label: "Enter AI Board Room",
      sublabel: "Interactive executive dialogue with Speed-RAG, RLHF, GAN, RNN, and DAG directors",
      icon: Users,
      action: () => {
        onNavigateView("BOARD_ROOM");
        onClose();
      },
    },
    {
      id: "cmd_gudown",
      category: "AI GUDOWN",
      label: "Open AI Gudown (Top 10 ML Models)",
      sublabel: "Explore SVM, KNN, Regression, K-Means, XGBoost, and MLP trained on chat corpus",
      icon: Cpu,
      action: () => {
        onNavigateView("AI_GUDOWN");
        onClose();
      },
    },
    {
      id: "cmd_data_centre",
      category: "DATA CENTRE",
      label: "Open Data Centre (Chat Corpus)",
      sublabel: "Ingest and feed all conversations and memories to train ML models",
      icon: Database,
      action: () => {
        onNavigateView("DATA_CENTRE");
        onClose();
      },
    },
    {
      id: "cmd_chat",
      category: "CHAT",
      label: "Talk to Digital Twin",
      sublabel: "Converse, reflect, and calibrate with live Mistral AI reasoning",
      icon: Sparkles,
      action: () => {
        onNavigateView("CHAT");
        onClose();
      },
    },
    {
      id: "cmd_sim",
      category: "SIMULATION",
      label: "Simulate a decision dilemma (What Would I Do?)",
      sublabel: "Run multi-factor trade-off simulation with calibrated confidence",
      icon: Brain,
      action: () => {
        onNavigateView("SIMULATION");
        onClose();
      },
    },
    {
      id: "cmd_mem",
      category: "MEMORY",
      label: "Inspect 3D Memory Cosmos",
      sublabel: "Browse cognitive memory tiers with provenance attribution",
      icon: Database,
      action: () => {
        onNavigateView("MEMORY");
        onClose();
      },
    },
    {
      id: "cmd_council",
      category: "COUNCIL",
      label: "Convene The Cognitive Council",
      sublabel: "5-member multi-agent debate across Speed RAG, GAN, RNN, and RLHF",
      icon: Zap,
      action: () => {
        onNavigateView("COUNCIL");
        onClose();
      },
    },
    {
      id: "cmd_studio_image",
      category: "STUDIO",
      label: "AI Image Generation Studio",
      sublabel: "Synthesize high-resolution botanical, 3D octane, and minimal vector artwork",
      icon: ImageIcon,
      action: () => {
        onNavigateView("STUDIO");
        onClose();
      },
    },
    {
      id: "cmd_studio_audio",
      category: "STUDIO",
      label: "Neural Audio & Speech Synthesizer",
      sublabel: "Generate multi-modal voice notes and binaural brainwave soundscapes",
      icon: Volume2,
      action: () => {
        onNavigateView("STUDIO");
        onClose();
      },
    },
    {
      id: "cmd_studio_pdf",
      category: "STUDIO",
      label: "Generate Executive PDF Dossier",
      sublabel: "Compile cognitive audits, decision briefs, and verifiable provenance reports",
      icon: FileText,
      action: () => {
        onNavigateView("STUDIO");
        onClose();
      },
    },
    {
      id: "cmd_studio_ppt",
      category: "STUDIO",
      label: "Generate Interactive PPT Presentation",
      sublabel: "Create multi-slide AI system strategy presentations and download deck",
      icon: Presentation,
      action: () => {
        onNavigateView("STUDIO");
        onClose();
      },
    },
    {
      id: "cmd_studio_gmail",
      category: "STUDIO",
      label: "Dispatch Executive Gmail Workflow",
      sublabel: "Compose and dispatch autonomous emails aligned to your communication tone",
      icon: Mail,
      action: () => {
        onNavigateView("STUDIO");
        onClose();
      },
    },
    {
      id: "cmd_trust",
      category: "TRUST",
      label: "Data Sovereignty & Memory Audit",
      sublabel: "Review immutable provenance logs and export memory JSON",
      icon: Shield,
      action: () => {
        onNavigateView("TRUST");
        onClose();
      },
    },
    {
      id: "cmd_settings",
      category: "SETTINGS",
      label: "System Settings & Gemini AI Engine",
      sublabel: "Configure Google Gemini (gemini-2.5-flash / gemini-1.5-pro) and voice acoustics",
      icon: Settings,
      action: () => {
        onNavigateView("SETTINGS");
        onClose();
      },
    },
    {
      id: "cmd_venus_paper",
      category: "COSMOS (VENUS)",
      label: "Launch Venus: Paper Project Site (paperc.vercel.app)",
      sublabel: "Open full working site for autonomous document research & synthesis",
      icon: ExternalLink,
      action: () => {
        window.open("https://paperc.vercel.app/", "_blank");
        onClose();
      },
    },
    {
      id: "cmd_mars_cresent",
      category: "COSMOS (MARS)",
      label: "Launch Mars: CresentX Legacy Preview (cresentx.vercel.app)",
      sublabel: "LLM Suspended — Only for view purpose. Use Gemini model in settings",
      icon: Globe,
      action: () => {
        window.open("https://cresentx.vercel.app/", "_blank");
        onClose();
      },
    },
  ];

  const filteredCommands = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.sublabel.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3A31]/40 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-[#2D3A31]">
        {/* Top Input Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E6E2DA] bg-[#F9F8F4]">
          <Search className="w-5 h-5 text-[#8C9A84]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or navigate... (e.g. 'simulate', 'memories')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#2D3A31]/60 hover:text-[#2D3A31] hover:bg-[#F2F0EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List Results */}
        <div className="overflow-y-auto p-3 divide-y divide-[#F2F0EB]">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  className="p-3.5 hover:bg-[#F2F0EB] rounded-2xl transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-[#F2F0EB] group-hover:bg-[#8C9A84] group-hover:text-[#FFFFFF] text-[#8C9A84] rounded-xl transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-[#8C9A84] tracking-wider">
                          {cmd.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#2D3A31]">
                          {cmd.label}
                        </h4>
                      </div>
                      <p className="text-xs text-[#2D3A31]/70 mt-0.5">{cmd.sublabel}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C9A84] group-hover:translate-x-1 transition-transform" />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#2D3A31]/60">
              No matching commands. Press Enter to search your digital twin.
            </div>
          )}
        </div>

        {/* Bottom Help */}
        <div className="px-5 py-2.5 border-t border-[#E6E2DA] bg-[#F9F8F4] flex items-center justify-between text-xs text-[#2D3A31]/60">
          <span>Navigate with arrows • Press Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
