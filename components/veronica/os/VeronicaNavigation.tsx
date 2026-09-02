"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  LayoutDashboard,
  User,
  Database,
  Sparkles,
  Activity,
  Brain,
  GitBranch,
  Globe,
  LineChart,
  ShieldCheck,
  Settings
} from "lucide-react";

interface VeronicaNavigationProps {
  activeView: string;
  onSelectView: (view: string) => void;
}

const NAV_ITEMS = [
  { id: "CHAT", number: "01", label: "CHAT & TWIN", icon: MessageSquare },
  { id: "HOME", number: "02", label: "OVERVIEW", icon: LayoutDashboard },
  { id: "SIMULATION", number: "03", label: "SIMULATE", icon: Brain },
  { id: "MEMORY", number: "04", label: "MEMORY", icon: Database },
  { id: "PERSONA", number: "05", label: "PERSONA", icon: Sparkles },
  { id: "BEHAVIOR", number: "06", label: "BEHAVIOR", icon: Activity },
  { id: "SELF", number: "07", label: "IDENTITY", icon: User },
  { id: "AGENTS", number: "08", label: "AGENTS", icon: GitBranch },
  { id: "WORLD", number: "09", label: "DESKTOP", icon: Globe },
  { id: "ANALYTICS", number: "10", label: "ANALYTICS", icon: LineChart },
  { id: "TRUST", number: "11", label: "TRUST", icon: ShieldCheck },
  { id: "SETTINGS", number: "12", label: "SETTINGS", icon: Settings },
];

export const VeronicaNavigation: React.FC<VeronicaNavigationProps> = ({
  activeView,
  onSelectView,
}) => {
  return (
    <nav className="w-full bg-[#0D0D11] border-b border-[#3F3F46] font-mono overflow-x-auto whitespace-nowrap select-none sticky top-[49px] z-30 shadow-md">
      <div className="flex items-stretch min-w-max">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={cn(
                "px-3.5 sm:px-4 py-2.5 sm:py-3 border-r border-[#3F3F46] flex items-center gap-2 text-xs uppercase font-bold tracking-wider transition-all",
                isActive
                  ? "bg-[#DFE104] text-black border-b-2 border-b-black shadow-inner"
                  : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-white"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-black",
                  isActive ? "text-black" : "text-[#DFE104]"
                )}
              >
                {item.number}
              </span>
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
