"use client";

import React, { useState, useEffect } from "react";
import { veronicaStore } from "@/lib/veronica-store";
import { VeronicaSidebar } from "@/components/veronica/os/VeronicaSidebar";
import { VeronicaCommandBar } from "@/components/veronica/os/VeronicaCommandBar";
import { VeronicaBrain } from "@/components/veronica/webgl/VeronicaBrain";
import { VeronicaSpaceHero } from "@/components/veronica/landing/VeronicaSpaceHero";
import { VeronicaBecomeSelf } from "@/components/veronica/landing/VeronicaBecomeSelf";

// Botanical & Machine Learning Views
import { HomeView } from "@/components/veronica/views/HomeView";
import { AIGudownView } from "@/components/veronica/views/AIGudownView";
import { DataCentreView } from "@/components/veronica/views/DataCentreView";
import { AIBoardRoomView } from "@/components/veronica/views/AIBoardRoomView";
import { ChatView } from "@/components/veronica/views/ChatView";
import { SimulationView } from "@/components/veronica/views/SimulationView";
import { MemoryView } from "@/components/veronica/views/MemoryView";
import { PersonaView } from "@/components/veronica/views/PersonaView";
import { BehaviorView } from "@/components/veronica/views/BehaviorView";
import { AgentsView } from "@/components/veronica/views/AgentsView";
import { CouncilView } from "@/components/veronica/views/CouncilView";
import { StudioView } from "@/components/veronica/views/StudioView";
import { WorldView } from "@/components/veronica/views/WorldView";
import { AnalyticsView } from "@/components/veronica/views/AnalyticsView";
import { TrustView } from "@/components/veronica/views/TrustView";
import { SettingsView } from "@/components/veronica/views/SettingsView";
import { SelfView } from "@/components/veronica/views/SelfView";
import { X, Brain, Leaf, Compass, Menu, Search, Sparkles } from "lucide-react";

export default function VeronicaApp() {
  const [user, setUser] = useState(veronicaStore.getUser());
  const [personas, setPersonas] = useState(veronicaStore.getPersonas());
  const [activePersona, setActivePersona] = useState(veronicaStore.getActivePersona());
  const [memories, setMemories] = useState(veronicaStore.getMemories());
  const [preferences, setPreferences] = useState(veronicaStore.getPreferences());
  const [patterns, setPatterns] = useState(veronicaStore.getBehaviorPatterns());
  const [simulations, setSimulations] = useState(veronicaStore.getSimulations());
  const [agents, setAgents] = useState(veronicaStore.getAgents());
  const [councilMembers, setCouncilMembers] = useState(veronicaStore.getCouncilMembers());
  const [councilDebates, setCouncilDebates] = useState(veronicaStore.getCouncilDebates());
  const [auditEvents, setAuditEvents] = useState(veronicaStore.getAuditEvents());
  const [knowledgeGraph, setKnowledgeGraph] = useState(veronicaStore.getKnowledgeGraph());
  const [windows, setWindows] = useState(veronicaStore.getWindows());
  const [currentMode, setCurrentMode] = useState(veronicaStore.getCurrentMode());
  const [avatarState, setAvatarState] = useState(veronicaStore.getAvatarState());
  const [activeView, setActiveView] = useState("HOME");
  const [reflections, setReflections] = useState(veronicaStore.getReflections());
  const [isMounted, setIsMounted] = useState(false);

  // UI state: Default to false so the Motionsites Space Hero is the first thing visible on load!
  const [isInOSMode, setIsInOSMode] = useState(false);
  const [showBrain, setShowBrain] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isBecomeSelfOpen, setIsBecomeSelfOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = veronicaStore.subscribe(() => {
      setUser(veronicaStore.getUser());
      setPersonas(veronicaStore.getPersonas());
      setActivePersona(veronicaStore.getActivePersona());
      setMemories(veronicaStore.getMemories());
      setPreferences(veronicaStore.getPreferences());
      setPatterns(veronicaStore.getBehaviorPatterns());
      setSimulations(veronicaStore.getSimulations());
      setAgents(veronicaStore.getAgents());
      setCouncilMembers(veronicaStore.getCouncilMembers());
      setCouncilDebates(veronicaStore.getCouncilDebates());
      setAuditEvents(veronicaStore.getAuditEvents());
      setKnowledgeGraph(veronicaStore.getKnowledgeGraph());
      setWindows(veronicaStore.getWindows());
      setCurrentMode(veronicaStore.getCurrentMode());
      setAvatarState(veronicaStore.getAvatarState());
      setReflections(veronicaStore.getReflections());
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandBarOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      unsubscribe();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectView = (view: string) => {
    setActiveView(view);
  };

  const handleCompleteBecomeSelf = () => {
    setIsBecomeSelfOpen(false);
    setIsInOSMode(true);
  };

  if (!isMounted) return null;

  const getViewTitle = () => {
    switch (activeView) {
      case "HOME": return "Executive Dashboard";
      case "AI_GUDOWN": return "AI Gudown (Top 10 ML Models)";
      case "DATA_CENTRE": return "Data Centre (Chat Corpus)";
      case "BOARD_ROOM": return "AI Board Room";
      case "CHAT": return "Conversational Digital Twin";
      case "COUNCIL": return "The Cognitive Council";
      case "SIMULATION": return "Decision Simulator";
      case "STUDIO": return "Multi-Modal Executive Studio";
      case "MEMORY": return "Memory Bank";
      case "PERSONA": return "Cognitive Personas";
      case "TRUST": return "Trust and Data Sovereignty";
      default: return "Veronica AI";
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F8F4] text-[#2D3A31] selection:bg-[#8C9A84] selection:text-white flex flex-col justify-between font-sans relative">
      {/* Paper Grain Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Global Command Bar (Cmd+K) */}
      <VeronicaCommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        onNavigateView={handleSelectView}
      />

      {/* Signature Become The Self Modal */}
      {isBecomeSelfOpen && (
        <VeronicaBecomeSelf
          onComplete={handleCompleteBecomeSelf}
          onCancel={() => setIsBecomeSelfOpen(false)}
        />
      )}

      {isInOSMode ? (
        <div className="flex min-h-screen relative">
          {/* Sleek Vertical Sidebar Navigation */}
          <VeronicaSidebar
            user={user}
            personas={personas}
            activePersona={activePersona}
            currentMode={currentMode}
            avatarState={avatarState}
            showBrain={showBrain}
            onToggleBrain={() => setShowBrain(!showBrain)}
            onOpenCommandBar={() => setIsCommandBarOpen(true)}
            onSelectView={handleSelectView}
            onOpenSpaceHero={() => setIsInOSMode(false)}
            activeView={activeView}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0 transition-all">
            {/* Top Micro-Header Bar */}
            <header className="h-14 border-b border-[#E6E2DA] bg-[#F9F8F4]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl text-[#2D3A31]"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84]">
                  <span>Veronica</span>
                  <span>/</span>
                  <span className="text-[#2D3A31] font-bold">{getViewTitle()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsCommandBarOpen(true)}
                  className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-medium text-[#2D3A31] flex items-center gap-2 shadow-sm transition-all"
                >
                  <Search className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span className="hidden sm:inline">Search (Cmd+K)</span>
                </button>

                <button
                  onClick={() => setShowBrain(!showBrain)}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-[#2D3A31] shadow-sm transition-all"
                  title="Toggle 3D Neural Brain"
                >
                  <Brain className="w-3.5 h-3.5 text-[#8C9A84]" />
                </button>
              </div>
            </header>

            {/* View Viewport */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6">
              {activeView === "HOME" && (
                <HomeView
                  user={user}
                  activePersona={activePersona}
                  simulations={simulations}
                  memories={memories}
                  auditEvents={auditEvents}
                  onNavigateView={handleSelectView}
                />
              )}
              {activeView === "AI_GUDOWN" && (
                <AIGudownView
                  user={user}
                  activePersona={activePersona}
                  memories={memories}
                  onNavigateView={handleSelectView}
                />
              )}
              {activeView === "DATA_CENTRE" && (
                <DataCentreView
                  user={user}
                  activePersona={activePersona}
                  memories={memories}
                  onNavigateView={handleSelectView}
                />
              )}
              {activeView === "BOARD_ROOM" && (
                <AIBoardRoomView
                  user={user}
                  activePersona={activePersona}
                  memories={memories}
                  onNavigateView={handleSelectView}
                />
              )}
              {activeView === "CHAT" && (
                <ChatView
                  user={user}
                  activePersona={activePersona}
                  memories={memories}
                  preferences={preferences}
                  currentMode={currentMode}
                  onNavigateView={handleSelectView}
                />
              )}
              {activeView === "SIMULATION" && (
                <SimulationView
                  user={user}
                  activePersona={activePersona}
                  memories={memories}
                  preferences={preferences}
                  patterns={patterns}
                  simulations={simulations}
                />
              )}
              {activeView === "MEMORY" && <MemoryView memories={memories} />}
              {activeView === "PERSONA" && (
                <PersonaView
                  personas={personas}
                  activePersonaId={user.activePersonaId}
                />
              )}
              {activeView === "BEHAVIOR" && (
                <BehaviorView
                  preferences={preferences}
                  patterns={patterns}
                  knowledgeGraph={knowledgeGraph}
                />
              )}
              {(activeView === "COUNCIL" || activeView === "AGENTS") && (
                <CouncilView
                  councilMembers={councilMembers}
                  councilDebates={councilDebates}
                />
              )}
              {activeView === "STUDIO" && (
                <StudioView
                  user={user}
                  activePersona={activePersona}
                  memories={memories}
                />
              )}
              {activeView === "WORLD" && <WorldView windows={windows} />}
              {activeView === "ANALYTICS" && (
                <AnalyticsView
                  user={user}
                  simulations={simulations}
                  reflections={reflections}
                />
              )}
              {activeView === "TRUST" && (
                <TrustView
                  user={user}
                  auditEvents={auditEvents}
                  memories={memories}
                />
              )}
              {activeView === "SELF" && <SelfView user={user} />}
              {activeView === "SETTINGS" && <SettingsView />}
            </div>

            {/* Floating 3D WebGL Digital Brain HUD */}
            {showBrain && (
              <div className="fixed bottom-6 right-6 w-80 h-96 bg-[#FFFFFF]/95 border border-[#E6E2DA] rounded-3xl shadow-2xl z-50 flex flex-col backdrop-blur-md overflow-hidden animate-in fade-in">
                <div className="flex items-center justify-between px-4 py-3 bg-[#F9F8F4] border-b border-[#E6E2DA]">
                  <div className="flex items-center gap-2 text-xs text-[#2D3A31] font-semibold">
                    <Brain className="w-4 h-4 text-[#8C9A84]" />
                    <span>3D Neural Brain</span>
                  </div>
                  <button
                    onClick={() => setShowBrain(false)}
                    className="text-[#2D3A31]/60 hover:text-[#2D3A31] p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 w-full h-full relative">
                  <VeronicaBrain
                    avatarState={avatarState}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Motionsites Signature Space Hero Landing Page */
        <VeronicaSpaceHero
          onEnterOS={() => setIsInOSMode(true)}
        />
      )}
    </main>
  );
}
