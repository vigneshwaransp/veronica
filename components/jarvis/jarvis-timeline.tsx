"use client";

import React from "react";
import { CheckCircle2, Circle, Play, AlertTriangle, XCircle } from "lucide-react";
import { type TimelineEvent } from "@/types";

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const JarvisTimeline: React.FC<TimelineProps> = ({ events, className }) => {
  return (
    <div className={`p-4 rounded-xl bg-slate-950/40 border border-slate-900/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] ${className || ""}`}>
      <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
        <h3 className="text-white font-semibold text-xs tracking-wider uppercase">
          Live Execution Timeline
        </h3>
        <span className="text-[9px] text-cyan-400 font-mono bg-cyan-950/30 border border-cyan-800/30 px-1.5 py-0.5 rounded">
          Active Thread
        </span>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-xs text-slate-500 font-mono">No active timeline tasks.</span>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-slate-800/80 space-y-4 ml-2">
            {events.map((event) => {
              const IconMap = {
                completed: CheckCircle2,
                running: Play,
                pending: Circle,
                warning: AlertTriangle,
                error: XCircle,
              };
              const StatusIcon = IconMap[event.status] || Circle;

              const statusColor = {
                completed: "text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]",
                running: "text-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.4)]",
                pending: "text-slate-600",
                warning: "text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]",
                error: "text-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]",
              };

              return (
                <div key={event.id} className="relative mb-4 last:mb-0">
                  {/* Timeline point indicator */}
                  <span className="absolute -left-[31px] top-0.5 bg-black rounded-full p-0.5 z-10">
                    <StatusIcon
                      className={`w-4 h-4 ${statusColor[event.status]}`}
                    />
                  </span>

                  <div className="flex flex-col space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${
                          event.status === "running"
                            ? "text-cyan-400 font-bold"
                            : event.status === "completed"
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {event.title}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {event.timestamp}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
