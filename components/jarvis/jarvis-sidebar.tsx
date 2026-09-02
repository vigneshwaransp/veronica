"use client";

import React from "react";
import {
  LayoutDashboard,
  Cpu,
  MessageSquare,
  Eye,
  MousePointer,
  Zap,
  Brain,
  Wrench,
  Terminal,
  Folder,
  Activity,
  ShieldCheck,
  Settings,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const JarvisSidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
}) => {
  const navItems = [
    { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
    { id: "core", label: "AI Core", icon: Cpu },
    { id: "chat", label: "Conversations", icon: MessageSquare },
    { id: "vision", label: "Computer Vision", icon: Eye },
    { id: "control", label: "Computer Control", icon: MousePointer },
    { id: "tasks", label: "Tasks", icon: Zap },
    { id: "memory", label: "Memory", icon: Brain },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "terminal", label: "Terminal", icon: Terminal },
    { id: "files", label: "Files", icon: Folder },
    { id: "monitor", label: "System Monitor", icon: Activity },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-black/40 backdrop-blur-md flex flex-col justify-between h-full p-4 select-none">
      <div>
        <div className="flex items-center space-x-3 px-3 py-4 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse">
            <span className="text-white font-bold text-lg tracking-wider">J</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-widest uppercase">
              Jarvis OS
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">
              v1.0.0-Beta
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-950/40 to-indigo-950/20 border border-cyan-800/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/50 border border-slate-900 rounded-lg">
          <span className="text-[10px] text-slate-500 font-mono">CONNECTION</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase">
              Local Mode
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
