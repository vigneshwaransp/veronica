"use client";

import React, { useState } from "react";
import { UserProfile, Persona, VeronicaMode, AvatarState } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Compass,
  Cpu,
  Database,
  Users,
  MessageSquare,
  Scale,
  Brain,
  Sparkles,
  Layers,
  Sliders,
  Shield,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  Settings,
  User,
  Server,
  GitFork
} from "lucide-react";

interface VeronicaSidebarProps {
  user: UserProfile;
  personas: Persona[];
  activePersona: Persona;
  currentMode: VeronicaMode;
  avatarState: AvatarState;
  showBrain: boolean;
  onToggleBrain: () => void;
  onOpenCommandBar: () => void;
  onSelectView: (view: string) => void;
  onOpenSpaceHero: () => void;
  activeView: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const VeronicaSidebar: React.FC<VeronicaSidebarProps> = ({
  user,
  personas,
  activePersona,
  currentMode,
  avatarState,
  showBrain,
  onToggleBrain,
  onOpenCommandBar,
  onSelectView,
  onOpenSpaceHero,
  activeView,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NAV_SECTIONS = [
    {
      group: "Core Intelligence",
      links: [
        { id: "PORTFOLIO", label: "Vigneshwaran Portfolio", icon: User, badge: "Creator" },
        { id: "HOME", label: "Executive Dashboard", icon: Compass },
        { id: "MCP_HUB", label: "MCP Hub (Google / OpenAI)", icon: Server, badge: "MCP v1" },
        { id: "LANGGRAPH_STUDIO", label: "LangGraph StateGraph", icon: GitFork, badge: "DAGs" },
        { id: "AI_GUDOWN", label: "AI Gudown (Top 10 ML)", icon: Cpu, badge: "10 ML" },
        { id: "DATA_CENTRE", label: "Data Centre (Chat Corpus)", icon: Database, badge: "Corpus" },
        { id: "BOARD_ROOM", label: "Agentic Room (15 Agents)", icon: Users, badge: "15 Agents" },
      ],
    },
    {
      group: "Cognitive Twin & Synthesis",
      links: [
        { id: "CHAT", label: "Talk to Twin", icon: MessageSquare },
        { id: "COUNCIL", label: "The Council", icon: Scale, badge: "5 Agents" },
        { id: "SIMULATION", label: "What Would I Do?", icon: Brain },
        { id: "STUDIO", label: "Executive Studio", icon: Sparkles, badge: "5 Tools" },
      ],
    },
    {
      group: "Memory & Sovereignty",
      links: [
        { id: "MEMORY", label: "Memory Bank", icon: Layers },
        { id: "PERSONA", label: "Personas & Lenses", icon: Sliders },
        { id: "TRUST", label: "Trust & Data", icon: Shield },
        { id: "SETTINGS", label: "Settings & Gemini", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-[#FFFFFF] border-r border-[#E6E2DA] flex flex-col justify-between transition-all duration-300 shadow-[2px_0_20px_rgba(45,58,49,0.02)]",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* 1. Sidebar Header */}
        <div className="p-5 border-b border-[#E6E2DA]/80 space-y-4">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                onSelectView("HOME");
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <span className="w-3 h-3 bg-[#8C9A84] rounded-full inline-block group-hover:scale-125 transition-transform shrink-0" />
              {!isCollapsed && (
                <span className="font-cursive text-3xl text-[#2D3A31] tracking-wide pt-1">
                  Veronica
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-[#2D3A31]/60 hover:text-[#2D3A31] hover:bg-[#F2F0EB] transition-colors"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>

              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-[#2D3A31]/60 hover:text-[#2D3A31]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Persona Lens Selector */}
          {!isCollapsed && (
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="w-full flex items-center justify-between p-2.5 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-2xl text-xs font-semibold text-[#2D3A31] transition-all shadow-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C9A84] shrink-0" />
                  <span className="truncate">{activePersona?.name || "ARCH-DEVELOPER"}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C9A84] shrink-0" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl shadow-xl z-50 p-1.5 divide-y divide-[#F2F0EB] animate-in fade-in">
                  <div className="px-3 py-2 text-[10px] text-[#8C9A84] font-semibold uppercase tracking-wider">
                    Select Cognitive Lens
                  </div>
                  {(personas || []).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        veronicaStore.setActivePersona(p.id);
                        setIsPersonaMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all",
                        p.id === activePersona?.id
                          ? "bg-[#2D3A31] text-[#FFFFFF]"
                          : "text-[#2D3A31] hover:bg-[#F2F0EB]"
                      )}
                    >
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-[10px] text-[#8C9A84]">{p.parameters?.technicalDepth || 90}% Tech</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Navigation Links List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {!isCollapsed && (
                <span className="text-[10px] font-semibold text-[#8C9A84] uppercase tracking-wider px-3 block">
                  {section.group}
                </span>
              )}

              <div className="space-y-1">
                {section.links.map((link) => {
                  const isActive = activeView === link.id;
                  const Icon = link.icon;

                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        onSelectView(link.id);
                        onCloseMobile();
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group relative",
                        isActive
                          ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm font-bold"
                          : "text-[#2D3A31]/75 hover:text-[#2D3A31] hover:bg-[#F2F0EB]",
                        isCollapsed ? "justify-center" : "justify-between"
                      )}
                      title={link.label}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-[#8C9A84]" : "text-[#2D3A31]/70 group-hover:text-[#2D3A31]")} />
                        {!isCollapsed && <span className="truncate">{link.label}</span>}
                      </div>

                      {!isCollapsed && link.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0",
                            isActive
                              ? "bg-[#8C9A84] text-[#FFFFFF]"
                              : "bg-[#F2F0EB] text-[#8C9A84] group-hover:bg-[#E6E2DA]"
                          )}
                        >
                          {link.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Sidebar Footer (Identity & Utility Strip) */}
        <div className="p-4 border-t border-[#E6E2DA]/80 space-y-3 bg-[#F9F8F4]/50">
          {!isCollapsed && (
            <div className="p-3 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5 truncate">
                <span className="font-serif font-bold text-xs text-[#2D3A31] block truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#8C9A84] block truncate">
                  {user.title}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#8C9A84] animate-ping shrink-0" />
            </div>
          )}

          <div className={cn("flex items-center gap-1.5", isCollapsed ? "flex-col" : "justify-between")}>
            <button
              onClick={onOpenSpaceHero}
              className="p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl hover:bg-[#F2F0EB] text-[#2D3A31] text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 shadow-sm transition-all"
              title="Open Cinematic Space Hero"
            >
              <Compass className="w-3.5 h-3.5 text-[#8C9A84]" />
              {!isCollapsed && <span>Space Hero</span>}
            </button>

            <button
              onClick={onToggleBrain}
              className={cn(
                "p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all",
                showBrain
                  ? "bg-[#8C9A84] text-[#FFFFFF] border-[#8C9A84]"
                  : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]",
                isCollapsed ? "w-full" : "flex-1"
              )}
              title="Toggle 3D Neural Brain"
            >
              <Brain className="w-3.5 h-3.5" />
              {!isCollapsed && <span>3D Brain</span>}
            </button>

            <button
              onClick={onOpenCommandBar}
              className="p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl hover:border-[#8C9A84] text-[#2D3A31] shadow-sm transition-colors"
              title="Search (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
