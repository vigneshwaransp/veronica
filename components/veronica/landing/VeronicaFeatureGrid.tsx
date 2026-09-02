"use client";

import React from "react";
import { BrutalistCard } from "@/components/veronica/ui/BrutalistCard";
import {
  Brain,
  Cpu,
  Layers,
  Sparkles,
  Shield,
  Activity,
  Terminal,
  HelpCircle,
  GitBranch,
  Network
} from "lucide-react";

interface VeronicaFeatureGridProps {
  onSelectFeature?: (featureKey: string) => void;
}

export const VeronicaFeatureGrid: React.FC<VeronicaFeatureGridProps> = ({
  onSelectFeature,
}) => {
  const features = [
    {
      id: "SIMULATION",
      number: "01",
      title: "WHAT WOULD I DO? (SIMULATION)",
      desc: "Simulate dilemmas with multi-factor trade-off scoring, counterfactual alternatives, and calibrated uncertainty ratings.",
      icon: Brain,
      badge: "CORE SIGNATURE",
    },
    {
      id: "MEMORY",
      number: "02",
      title: "6-TIER MEMORY ARCHITECTURE",
      desc: "Short-term, long-term, episodic, semantic, procedural, and preference memories with provenance attribution.",
      icon: Layers,
      badge: "1,248 TRACES",
    },
    {
      id: "PERSONA",
      number: "03",
      title: "VISUAL PERSONA MATRIX",
      desc: "Dynamically customize behavioral vectors across technical depth, risk tolerance, formality, and creative divergence.",
      icon: Sparkles,
      badge: "6 PROFILES",
    },
    {
      id: "BEHAVIOR",
      number: "04",
      title: "BEHAVIORAL DRIFT & PATTERNS",
      desc: "Probabilistically tracks your recurring workflows, coding habits, and stack selections without deterministic rigidity.",
      icon: Activity,
      badge: "BAYESIAN PRIORS",
    },
    {
      id: "AGENTS",
      number: "05",
      title: "8-AGENT SWARM & SAFETY GATES",
      desc: "Dedicated Persona, Memory, Research, Coding, Planning, Execution, Critic, and Safety agents governed by 5 autonomy levels.",
      icon: GitBranch,
      badge: "L0 - L4 GATED",
    },
    {
      id: "WORLD",
      number: "06",
      title: "VIRTUAL DESKTOP OS",
      desc: "Simulated sandbox with Terminal, Code Editor, Web Browser, Database Inspector, and AI Console.",
      icon: Terminal,
      badge: "SIMULATED ENVS",
    },
    {
      id: "TRUST",
      number: "07",
      title: "TRUST & GOVERNANCE CENTER",
      desc: "Audit exactly what VERONICA knows, inferred, predicted, or executed. Full memory deletion and data sovereignty.",
      icon: Shield,
      badge: "AUDIT VERIFIED",
    },
    {
      id: "GRAPH",
      number: "08",
      title: "3D PERSONAL KNOWLEDGE GRAPH",
      desc: "Interactive spatial graph connecting User, Personas, Projects, Skills, Technologies, Preferences, and Decisions.",
      icon: Network,
      badge: "SPATIAL GRAPH",
    },
  ];

  return (
    <section className="w-full bg-[#09090B] text-[#FAFAFA] border-b border-[#3F3F46] p-6 sm:p-12 lg:p-16">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[#3F3F46] pb-8 mb-12">
        <div>
          <span className="text-xs font-mono text-[#DFE104] uppercase font-bold tracking-widest block mb-2">
            SYSTEM ARCHITECTURE & CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-space uppercase text-white tracking-tight">
            ENGINEERED AS A<br />COMPUTATIONAL TWIN.
          </h2>
        </div>
        <p className="text-sm font-mono text-[#A1A1AA] max-w-md mt-4 md:mt-0">
          Built on probabilistic modeling, multi-agent orchestration, WebGL spatial memory, and zero-compromise kinetic brutalism.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              onClick={() => onSelectFeature && onSelectFeature(feat.id)}
              className="cursor-pointer group"
            >
              <BrutalistCard
                headerTitle={`SYS.${feat.number}`}
                badge={feat.badge}
                badgeVariant="accent"
                className="h-full flex flex-col justify-between"
              >
                <div>
                  <Icon className="w-8 h-8 text-[#DFE104] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-black font-space uppercase text-white tracking-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-mono text-[#A1A1AA] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#DFE104] font-bold">
                  <span>INSPECT SYSTEM</span>
                  <span>→</span>
                </div>
              </BrutalistCard>
            </div>
          );
        })}
      </div>
    </section>
  );
};
