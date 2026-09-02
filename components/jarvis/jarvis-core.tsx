"use client";

import React, { useState } from "react";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import { type JarvisState } from "@/types";
import { Cpu, AlertCircle } from "lucide-react";

interface JarvisCoreProps {
  state: JarvisState;
  onStateChange: (state: JarvisState) => void;
  className?: string;
}

export const JarvisCore: React.FC<JarvisCoreProps> = ({
  state,
  onStateChange,
  className,
}) => {
  const [voiceActive, setVoiceActive] = useState(false);

  // Sync state changes to specific orb hue values directly (avoiding cascading renders)
  const getOrbHue = (state: JarvisState): number => {
    switch (state) {
      case "idle":
        return 240; // Blue
      case "listening":
        return 145; // Emerald Green
      case "thinking":
        return 280; // Purple
      case "planning":
        return 185; // Cyan
      case "confirming":
        return 35; // Amber
      case "executing":
        return 205; // Blue-cyan
      case "observing":
        return 260; // Violet
      case "success":
        return 120; // Bright Green
      case "error":
        return 0; // Bright Red
      case "stopped":
        return 0; // Grayish Red
      default:
        return 240;
    }
  };

  const orbHue = getOrbHue(state);

  const stateProperties = {
    idle: { speed: 0.3, hover: 0.2, label: "Core Standby" },
    listening: { speed: 0.8, hover: 1.2, label: "Capturing Audio Input" },
    thinking: { speed: 1.8, hover: 0.7, label: "Analyzing Intention" },
    planning: { speed: 1.2, hover: 1.0, label: "Formulating Workflow Steps" },
    confirming: { speed: 0.4, hover: 0.9, label: "Awaiting Confirmation" },
    executing: { speed: 2.5, hover: 1.5, label: "Executing Secure Commands" },
    observing: { speed: 0.5, hover: 0.6, label: "Scanning Desktop Interface" },
    success: { speed: 1.0, hover: 1.4, label: "Operation Succeeded" },
    error: { speed: 0.0, hover: 0.0, label: "Execution Failed" },
    stopped: { speed: 0.0, hover: 0.0, label: "System Suspended" },
  };

  const currentProps = stateProperties[state] || stateProperties.idle;

  const statesList: { id: JarvisState; label: string }[] = [
    { id: "idle", label: "Idle" },
    { id: "listening", label: "Listening" },
    { id: "thinking", label: "Thinking" },
    { id: "planning", label: "Planning" },
    { id: "confirming", label: "Confirming" },
    { id: "executing", label: "Executing" },
    { id: "observing", label: "Observing" },
    { id: "success", label: "Success" },
    { id: "error", label: "Error" },
    { id: "stopped", label: "Stopped" },
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className || ""}`}>
      {/* Left Metadata Grid */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-900 pb-2 mb-4">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase">
              AI Core Status
            </h3>
          </div>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex justify-between py-1 border-b border-slate-900/50">
              <span className="text-slate-500">MODEL</span>
              <span className="text-white font-bold">Llama 3.1 8B (Local)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/50">
              <span className="text-slate-500">LLM PROVIDER</span>
              <span className="text-cyan-400 font-bold">OLLAMA</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/50">
              <span className="text-slate-500">ORB STATUS</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/50">
              <span className="text-slate-500">CONTEXT MEMORY</span>
              <span className="text-indigo-400 font-bold">ACTIVE (12k tokens)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/50">
              <span className="text-slate-500">VISION ENGINE</span>
              <span className="text-slate-400 font-bold">READY (Windows UI Automation)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/50">
              <span className="text-slate-500">VOICE CONTROL</span>
              <span className="text-cyan-400 font-bold">READY (WebAudio API)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">INTEGRATED TOOLS</span>
              <span className="text-white font-bold">17 Available</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-900/80 rounded-lg p-3 mt-4">
          <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">
            ACTIVE TASK
          </div>
          <p className="text-[11px] text-slate-300 font-mono">
            {state === "idle" ? "System standing by for query..." : `State Machine: ${currentProps.label}`}
          </p>
        </div>
      </div>

      {/* Central Animated Orb panel */}
      <div className="lg:col-span-2 p-6 rounded-xl bg-slate-950/40 border border-slate-900/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.35)] flex flex-col items-center justify-between min-h-[350px] relative overflow-hidden">
        {/* Glow lights behind the orb */}
        <div
          className="absolute w-64 h-64 rounded-full blur-[100px] opacity-15 pointer-events-none transition-all duration-1000"
          style={{
            backgroundColor: `hsl(${orbHue}, 80%, 50%)`,
          }}
        />

        {/* HUD state overlay */}
        <div className="w-full flex items-center justify-between z-10 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              JARVIS CORE
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {state}
          </span>
        </div>

        {/* WebGL Orb Component container */}
        <div className="w-56 h-56 flex items-center justify-center relative my-4">
          <VoicePoweredOrb
            className="w-full h-full"
            hue={orbHue}
            enableVoiceControl={state === "listening"}
            maxRotationSpeed={currentProps.speed}
            maxHoverIntensity={currentProps.hover}
            onVoiceDetected={setVoiceActive}
          />

          {/* Core HUD rings overlay */}
          <div
            className={`absolute inset-0 border border-slate-800/40 rounded-full scale-105 pointer-events-none transition-all duration-1000 ${
              state === "thinking" || state === "executing"
                ? "animate-[spin_10s_linear_infinite]"
                : ""
            }`}
          />
          <div
            className={`absolute inset-0 border border-dashed border-cyan-800/20 rounded-full scale-110 pointer-events-none transition-all duration-1000 ${
              state === "planning"
                ? "animate-[spin_18s_linear_infinite_reverse]"
                : ""
            }`}
          />

          {state === "confirming" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-full">
              <div className="text-center p-3 border border-amber-800/60 bg-amber-950/20 rounded-xl max-w-[150px] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1 animate-bounce" />
                <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest uppercase">
                  PERMISSION REQUIRED
                </span>
              </div>
            </div>
          )}
        </div>

        {/* State Interactive Test Controls (HUD Bottom Panel) */}
        <div className="w-full z-10 space-y-3">
          <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
              SIMULATE AGENT STATE
            </span>
            {voiceActive && state === "listening" && (
              <span className="text-[9px] text-emerald-400 font-mono animate-pulse">
                🎙 CAPTURING VOLUME
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {statesList.map((st) => (
              <button
                key={st.id}
                onClick={() => onStateChange(st.id)}
                className={`px-2 py-1 text-[9px] font-mono rounded tracking-wider uppercase transition-all duration-300 ${
                  state === st.id
                    ? "bg-cyan-950/40 border border-cyan-500/60 text-cyan-400 font-bold"
                    : "bg-slate-950/60 border border-slate-900/80 text-slate-500 hover:text-slate-300 hover:border-slate-800"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
