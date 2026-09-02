"use client";

import React, { useState } from "react";
import { MemoryNode, MemoryType } from "@/types/veronica";
import { MemoryVisualizer3D } from "@/components/veronica/webgl/MemoryVisualizer3D";
import { veronicaStore } from "@/lib/veronica-store";
import { MemoryEngine } from "@/lib/memory-engine";
import { cn } from "@/lib/utils";
import {
  Database,
  Search,
  Plus,
  Trash2,
  Filter,
  Layers,
  Sparkles,
  Globe,
  Grid,
  X,
  Leaf,
  Clock
} from "lucide-react";

interface MemoryViewProps {
  memories: MemoryNode[];
}

export const MemoryView: React.FC<MemoryViewProps> = ({ memories }) => {
  const [viewMode, setViewMode] = useState<"3D" | "GRID">("GRID");
  const [typeFilter, setTypeFilter] = useState<MemoryType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<MemoryType>("preference");
  const [newCategory, setNewCategory] = useState("Architecture");
  const [newImportance, setNewImportance] = useState(85);
  const [newTags, setNewTags] = useState("engineering, stack");

  const filteredMemories = MemoryEngine.queryMemories(
    memories,
    searchQuery,
    typeFilter
  );

  const tierDistribution = MemoryEngine.getMemoryTierDistribution(memories);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    veronicaStore.addMemory({
      type: newType,
      content: newContent,
      category: newCategory,
      importance: newImportance,
      confidence: 90,
      recency: "HIGH",
      evidenceCount: 1,
      source: "Manual User Assertion",
      tags: newTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      linkedNodeIds: [],
    });

    setNewContent("");
    setIsAddModalOpen(false);
  };

  const handleForgetRequest = (nodeId: string) => {
    veronicaStore.deleteMemory(nodeId);
  };

  const TIERS: { key: MemoryType; label: string }[] = [
    { key: "preference", label: "Preferences" },
    { key: "semantic", label: "Semantic" },
    { key: "procedural", label: "Procedural" },
    { key: "episodic", label: "Episodic" },
    { key: "long_term", label: "Long-Term" },
    { key: "short_term", label: "Short-Term" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Memory <span className="italic text-[#8C9A84]">Cosmos</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            6 cognitive tiers with continuous Bayesian weights and strict provenance tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 3D vs Grid Toggle */}
          <div className="flex bg-[#F2F0EB] border border-[#E6E2DA] rounded-full p-1 shadow-sm">
            <button
              onClick={() => setViewMode("GRID")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all",
                viewMode === "GRID"
                  ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                  : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
              )}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Card Grid</span>
            </button>
            <button
              onClick={() => setViewMode("3D")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all",
                viewMode === "3D"
                  ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                  : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Cosmos</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="botanical-btn-primary py-2 px-4 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Tier Distribution Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {TIERS.map((t) => {
          const count = tierDistribution[t.key] || 0;
          const percentage = memories.length > 0 ? Math.round((count / memories.length) * 100) : 0;
          return (
            <button
              key={t.key}
              onClick={() => setTypeFilter(typeFilter === t.key ? "ALL" : t.key)}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                typeFilter === t.key
                  ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-md"
                  : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
              )}
            >
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase block">
                {t.label}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-serif font-bold">{count}</span>
                <span className="text-[10px] opacity-70">{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full p-2 shadow-sm">
        <Search className="w-4 h-4 text-[#8C9A84] ml-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories by keyword, concept, or provenance tag..."
          className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none"
        />
        {typeFilter !== "ALL" && (
          <button
            onClick={() => setTypeFilter("ALL")}
            className="px-3 py-1 bg-[#F2F0EB] text-[#2D3A31] text-xs font-semibold rounded-full border border-[#E6E2DA] flex items-center gap-1"
          >
            <span>{typeFilter}</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3D View vs Grid View */}
      {viewMode === "3D" ? (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm">
          <div className="h-[520px] w-full rounded-2xl overflow-hidden bg-[#04101F]">
            <MemoryVisualizer3D memories={filteredMemories} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((m) => (
            <div
              key={m.id}
              className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(45,58,49,0.03)] hover:shadow-[0_10px_30px_rgba(45,58,49,0.06)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#F2F0EB] text-[#8C9A84] rounded-full text-xs font-semibold uppercase">
                    {m.type}
                  </span>
                  <span className="text-xs font-bold text-[#2D3A31]">
                    {m.importance}% Importance
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#2D3A31] leading-relaxed font-normal">
                  {m.content}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6E2DA] flex items-center justify-between text-xs text-[#2D3A31]/70">
                <span className="truncate max-w-[150px]">{m.source}</span>
                <button
                  onClick={() => handleForgetRequest(m.id)}
                  className="text-[#C27B66] hover:text-[#2D3A31] p-1 transition-colors"
                  title="Forget Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#2D3A31]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-4">
              <h3 className="text-xl font-serif font-bold text-[#2D3A31]">Add Memory Node</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#2D3A31]/60 hover:text-[#2D3A31]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                  Memory Statement / Knowledge
                </label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Strongly prefers functional programming patterns and zero unneeded runtime packages."
                  className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-3 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                    Cognitive Tier
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MemoryType)}
                    className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                  >
                    <option value="preference">Preference</option>
                    <option value="semantic">Semantic</option>
                    <option value="procedural">Procedural</option>
                    <option value="episodic">Episodic</option>
                    <option value="long_term">Long-Term</option>
                    <option value="short_term">Short-Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                    Importance ({newImportance}%)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={newImportance}
                    onChange={(e) => setNewImportance(Number(e.target.value))}
                    className="w-full mt-2 accent-[#8C9A84]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full botanical-btn-primary py-3 text-xs font-semibold"
              >
                <span>Commit to Memory Bank</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
