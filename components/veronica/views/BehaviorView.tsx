"use client";

import React, { useState } from "react";
import { UserPreference, BehaviorPattern, KnowledgeGraphData } from "@/types/veronica";
import { KnowledgeGraph3D } from "@/components/veronica/webgl/KnowledgeGraph3D";
import { cn } from "@/lib/utils";
import {
  Layers,
  Network,
  TrendingUp,
  Leaf
} from "lucide-react";

interface BehaviorViewProps {
  preferences: UserPreference[];
  patterns: BehaviorPattern[];
  knowledgeGraph: KnowledgeGraphData;
}

export const BehaviorView: React.FC<BehaviorViewProps> = ({
  preferences,
  patterns,
  knowledgeGraph,
}) => {
  const [activeTab, setActiveTab] = useState<"PREFERENCES" | "PATTERNS" | "GRAPH">("PREFERENCES");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredPreferences = preferences.filter((p) => {
    if (categoryFilter === "ALL") return true;
    return p.category === categoryFilter;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Behavioral <span className="italic text-[#8C9A84]">Dynamics</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Probabilistic decision models, learned priors, and knowledge relations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F2F0EB] border border-[#E6E2DA] rounded-full p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("PREFERENCES")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeTab === "PREFERENCES"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab("PATTERNS")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeTab === "PATTERNS"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            Learned Habits
          </button>
          <button
            onClick={() => setActiveTab("GRAPH")}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-full transition-all",
              activeTab === "GRAPH"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            3D Graph
          </button>
        </div>
      </div>

      {activeTab === "PREFERENCES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPreferences.map((p) => (
            <div
              key={p.id}
              className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8C9A84] uppercase">
                    {p.category}
                  </span>
                  <span className="px-2 py-0.5 bg-[#F2F0EB] text-[#2D3A31] text-[10px] font-semibold rounded-full">
                    {p.confidence}% Conf
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-[#2D3A31]">{p.name}</h4>
                <p className="text-xs text-[#2D3A31]/80 leading-relaxed">{p.value}</p>
              </div>

              <div className="pt-3 border-t border-[#E6E2DA] flex justify-between items-center text-xs text-[#2D3A31]/60">
                <span>Observed: {p.evidenceCount} times</span>
                <span className="text-[#8C9A84] font-semibold">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "PATTERNS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patterns.map((pt) => (
            <div
              key={pt.id}
              className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8C9A84] uppercase">
                  {pt.category}
                </span>
                <span className="px-2.5 py-0.5 bg-[#F2F0EB] text-[#2D3A31] text-xs font-bold rounded-full border border-[#E6E2DA]">
                  {pt.consistencyScore}% Consistent
                </span>
              </div>

              <div>
                <h4 className="text-lg font-serif font-bold text-[#2D3A31]">{pt.title}</h4>
                <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">{pt.description}</p>
              </div>

              <div className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl text-xs flex justify-between">
                <span>Frequency: <strong className="text-[#2D3A31]">{pt.frequency}</strong></span>
                <span>Triggers: {pt.contextTriggers.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "GRAPH" && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm">
          <div className="h-[520px] w-full rounded-2xl overflow-hidden bg-[#04101F]">
            <KnowledgeGraph3D data={knowledgeGraph} />
          </div>
        </div>
      )}
    </div>
  );
};
