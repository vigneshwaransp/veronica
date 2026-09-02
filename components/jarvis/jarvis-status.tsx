"use client";

import React, { useEffect, useState } from "react";
import { Cpu, HardDrive, Thermometer, Shield, Wifi } from "lucide-react";
import { type SystemMetrics } from "@/types";

interface SystemStatusProps {
  className?: string;
}

export const JarvisStatus: React.FC<SystemStatusProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 28,
    gpu: 34,
    ram: 52,
    disk: 44,
    network: 15,
    temperature: 42,
  });

  useEffect(() => {
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const fluctuate = (val: number, min = 1, max = 99, step = 4) => {
          const delta = (Math.random() - 0.5) * step;
          return Math.max(min, Math.min(max, Math.round(val + delta)));
        };

        return {
          cpu: fluctuate(prev.cpu, 15, 85, 8),
          gpu: fluctuate(prev.gpu, 10, 90, 6),
          ram: fluctuate(prev.ram, 48, 58, 2),
          disk: prev.disk, // Disk stays stable
          network: fluctuate(prev.network, 5, 80, 15),
          temperature: fluctuate(prev.temperature, 38, 65, 3),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      label: "CPU Utilization",
      value: `${metrics.cpu}%`,
      percentage: metrics.cpu,
      icon: Cpu,
      color: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6,182,212,0.3)",
    },
    {
      label: "GPU Utilization",
      value: `${metrics.gpu}%`,
      percentage: metrics.gpu,
      icon: Shield,
      color: "from-purple-500 to-indigo-600",
      glowColor: "rgba(168,85,247,0.3)",
    },
    {
      label: "Memory (RAM)",
      value: `${metrics.ram}%`,
      percentage: metrics.ram,
      icon: HardDrive,
      color: "from-blue-500 to-indigo-600",
      glowColor: "rgba(59,130,246,0.3)",
    },
    {
      label: "System Temp",
      value: `${metrics.temperature}°C`,
      percentage: (metrics.temperature / 100) * 100,
      icon: Thermometer,
      color: "from-amber-500 to-rose-600",
      glowColor: "rgba(245,158,11,0.3)",
    },
  ];

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>System Status</span>
        </h2>
        <div className="flex items-center space-x-2">
          <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-mono">12.4 Mbps</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-slate-950/40 border border-slate-900/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 hover:border-slate-800"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xl font-bold text-white mb-3 font-mono">
                {card.value}
              </div>

              {/* Progress bar container */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out`}
                  style={{
                    width: `${card.percentage}%`,
                    boxShadow: `0 0 8px ${card.glowColor}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Activity: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
