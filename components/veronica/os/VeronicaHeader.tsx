"use client";

import React, { useState } from "react";
import { UserProfile, Persona, VeronicaMode, AvatarState } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ChevronDown,
  Brain,
  Search,
  Menu,
  X,
  Compass,
  Users,
  MessageSquare,
  Scale,
  Zap,
  Sliders
} from "lucide-react";

interface VeronicaHeaderProps {
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
}

export const VeronicaHeader: React.FC<VeronicaHeaderProps> = ({
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
}) => {
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { id: "HOME", label: "Home" },
    { id: "BOARD_ROOM", label: "Board Room", highlight: true },
    { id: "CHAT", label: "Talk to Twin" },
    { id: "SIMULATION", label: "What Would I Do?" },
    { id: "COUNCIL", label: "Council" },
    { id: "STUDIO", label: "Studio" },
    { id: "MEMORY", label: "Memories" },
    { id: "PERSONA", label: "Personas" },
    { id: "TRUST", label: "Trust & Data" },
  ];

  return (
    <header className="w-full bg-[#F9F8F4]/80 border-b border-[#E6E2DA]/80 text-[#2D3A31] font-sans sticky top-0 z-40 backdrop-blur-xl transition-all shadow-[0_2px_15px_rgba(45,58,49,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Active Persona Lens */}
        <div className="flex items-center gap-3.5">
          <div
            onClick={() => onSelectView("HOME")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 bg-[#8C9A84] rounded-full inline-block group-hover:scale-125 transition-transform" />
            <span className="font-cursive text-2xl sm:text-3xl text-[#2D3A31] tracking-wide pt-1">
              Veronica
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-[11px] text-[#2D3A31] font-semibold">
            <span className="w-1.5 h-1.5 bg-[#8C9A84] rounded-full animate-ping" />
            <span>Harmonized</span>
          </div>

          {/* Active Persona Lens Pill */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span className="truncate max-w-[110px] sm:max-w-none">{activePersona?.name || "ARCH-DEVELOPER"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C9A84]" />
            </button>

            {isPersonaMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl shadow-xl z-50 p-1.5 divide-y divide-[#F2F0EB] animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="px-3 py-2 text-[11px] text-[#8C9A84] font-semibold uppercase tracking-wider">
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
                      "w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all",
                      p.id === activePersona?.id
                        ? "bg-[#2D3A31] text-[#FFFFFF]"
                        : "text-[#2D3A31] hover:bg-[#F2F0EB]"
                    )}
                  >
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[11px] text-[#8C9A84]">
                      {p.parameters?.technicalDepth || 90}% Tech
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Modern Floating Glassmorphic Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F2F0EB]/70 border border-[#E6E2DA]/80 rounded-full p-1 shadow-inner">
          {NAV_LINKS.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectView(link.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all relative flex items-center gap-1.5",
                  isActive
                    ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm font-bold"
                    : "text-[#2D3A31]/75 hover:text-[#2D3A31] hover:bg-[#FFFFFF]/60"
                )}
              >
                {link.highlight && (
                  <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-[#8C9A84]" : "bg-[#8C9A84] animate-pulse")} />
                )}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Space Hero, 3D Brain & Command Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenSpaceHero}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border border-[#E6E2DA] bg-[#FFFFFF] hover:bg-[#F2F0EB] text-[#2D3A31] transition-all flex items-center gap-1.5 shadow-sm"
            title="Open Cinematic Space Hero"
          >
            <Compass className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span className="hidden sm:inline">Space Hero</span>
          </button>

          <button
            onClick={onToggleBrain}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 shadow-sm",
              showBrain
                ? "bg-[#8C9A84] text-[#FFFFFF] border-[#8C9A84]"
                : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
            )}
            title="Toggle 3D Neural Brain"
          >
            <Brain className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span className="hidden sm:inline">3D Brain</span>
          </button>

          <button
            onClick={onOpenCommandBar}
            className="p-2 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full hover:border-[#8C9A84] text-[#2D3A31] shadow-sm transition-colors"
            title="Open Command Bar (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full text-[#2D3A31]"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E6E2DA] p-4 space-y-1 shadow-lg animate-in fade-in">
          {NAV_LINKS.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                  isActive
                    ? "bg-[#2D3A31] text-[#FFFFFF]"
                    : "text-[#2D3A31] hover:bg-[#F2F0EB]"
                )}
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="text-[10px] px-2 py-0.5 bg-[#8C9A84]/20 text-[#8C9A84] rounded-full font-bold">
                    Executive
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
