"use client";

import React, { useEffect, useRef, useState } from "react";
import { MemoryNode, Persona } from "@/types/veronica";
import { cn } from "@/lib/utils";
import {
  Leaf,
  Sparkles,
  Wind,
  Sun,
  Layers,
  ArrowRight,
  CheckCircle2,
  X
} from "lucide-react";

interface BotanicalMindFloraProps {
  memories: MemoryNode[];
  activePersona: Persona;
  onSelectNode?: (nodeInfo: { title: string; desc: string; type: string; confidence: number }) => void;
  className?: string;
}

interface FloraNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  category: "VALUE" | "PERSONA" | "MEMORY" | "HABIT";
  color: string;
  textColor: string;
  confidence: number;
  parentIndex?: number;
  swayPhase: number;
  swaySpeed: number;
  blossomSize: number;
  details: string;
}

interface Spore {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const BotanicalMindFlora: React.FC<BotanicalMindFloraProps> = ({
  memories,
  activePersona,
  onSelectNode,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<FloraNode | null>(null);
  const [season, setSeason] = useState<"SPRING" | "SUMMER" | "AUTUMN">("SUMMER");
  const [isPulsing, setIsPulsing] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<FloraNode | null>(null);

  // Nodes generated from actual user preferences & persona
  const nodesRef = useRef<FloraNode[]>([]);
  const sporesRef = useRef<Spore[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 0, y: 0, isDown: false });

  // Generate Organic Flora Network
  const initFlora = (width: number, height: number) => {
    const nodes: FloraNode[] = [];
    const centerX = width / 2;
    const baseY = height - 50;

    // 1. Root / Core Identity (Base)
    nodes.push({
      id: "root_identity",
      x: centerX,
      y: baseY - 30,
      radius: 20,
      label: "User (Core Self)",
      category: "VALUE",
      color: "#2D3A31",
      textColor: "#FFFFFF",
      confidence: 99,
      swayPhase: 0,
      swaySpeed: 0.001,
      blossomSize: 18,
      details: "Foundational identity matrix, sovereign reasoning values, and core thinking principles.",
    });

    // 2. Main Trunk Branches (Personas & Values)
    const trunkBranches = [
      {
        id: "trunk_dev",
        label: activePersona.name || "Arch-Developer",
        category: "PERSONA" as const,
        color: "#8C9A84",
        textColor: "#FFFFFF",
        relX: -90,
        relY: -110,
        confidence: 96,
        details: "Technical rigor, strict types, high-throughput systems, and zero unneeded runtime packages.",
      },
      {
        id: "trunk_values",
        label: "First-Principles Prior",
        category: "VALUE" as const,
        color: "#7C8B74",
        textColor: "#FFFFFF",
        relX: 90,
        relY: -110,
        confidence: 94,
        details: "Deconstructing problems to fundamental truths, avoiding cargo-cult architecture.",
      },
      {
        id: "trunk_synergy",
        label: "Systems Thinking",
        category: "HABIT" as const,
        color: "#A3B19B",
        textColor: "#2D3A31",
        relX: 0,
        relY: -150,
        confidence: 92,
        details: "Holistic architecture connecting frontends, data pipelines, and agent orchestration.",
      },
    ];

    trunkBranches.forEach((tb, idx) => {
      nodes.push({
        id: tb.id,
        x: centerX + tb.relX,
        y: baseY + tb.relY,
        radius: 16,
        label: tb.label,
        category: tb.category,
        color: tb.color,
        textColor: tb.textColor,
        confidence: tb.confidence,
        parentIndex: 0,
        swayPhase: idx * 1.5,
        swaySpeed: 0.0015,
        blossomSize: 14,
        details: tb.details,
      });
    });

    // 3. Canopy Leaves & Blossoms (From Live Memories & Habits)
    const sampleMemories = memories.slice(0, 8);
    const leafAngles = [
      { parent: 1, angle: -0.85, dist: 85, color: "#C27B66" }, // Terracotta blossom
      { parent: 1, angle: -1.35, dist: 95, color: "#8C9A84" }, // Sage leaf
      { parent: 1, angle: -0.4, dist: 75, color: "#D18E7B" },
      { parent: 2, angle: -0.7, dist: 80, color: "#8C9A84" },
      { parent: 2, angle: -0.2, dist: 90, color: "#C27B66" },
      { parent: 2, angle: 0.25, dist: 80, color: "#DCCFC2" },
      { parent: 3, angle: -1.0, dist: 85, color: "#C27B66" },
      { parent: 3, angle: -0.5, dist: 90, color: "#8C9A84" },
    ];

    leafAngles.forEach((la, idx) => {
      const parentNode = nodes[la.parent];
      const mem = sampleMemories[idx];
      const label = mem ? mem.content.slice(0, 24) + "..." : `Cognitive Trace 0${idx + 1}`;
      const desc = mem ? mem.content : "Learned preference prioritizing velocity and clean semantics.";

      nodes.push({
        id: `leaf_${idx}`,
        x: parentNode.x + Math.cos(la.angle) * la.dist,
        y: parentNode.y + Math.sin(la.angle) * la.dist,
        radius: 12,
        label: label,
        category: "MEMORY",
        color: la.color,
        textColor: la.color === "#DCCFC2" ? "#2D3A31" : "#FFFFFF",
        confidence: mem ? mem.confidence : 88,
        parentIndex: la.parent,
        swayPhase: idx * 0.8,
        swaySpeed: 0.002 + idx * 0.0003,
        blossomSize: 10,
        details: desc,
      });
    });

    nodesRef.current = nodes;

    // Generate Spores / Pollen
    const spores: Spore[] = [];
    for (let i = 0; i < 40; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4 + 0.15,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.5,
        color: Math.random() > 0.4 ? "#8C9A84" : "#C27B66",
      });
    }
    sporesRef.current = spores;
  };

  const handlePulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = 420);

    initFlora(width, height);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = 420;
      initFlora(width, height);
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y, isDown: mouseRef.current.isDown };

      // Hit-test nodes
      let found: FloraNode | null = null;
      for (const node of nodesRef.current) {
        const dx = x - node.x;
        const dy = y - node.y;
        if (Math.hypot(dx, dy) <= node.radius + 8) {
          found = node;
          break;
        }
      }
      setHoveredNode(found);
      canvas.style.cursor = found ? "pointer" : "default";
    };

    const handleClick = () => {
      if (hoveredNode) {
        setSelectedNode(hoveredNode);
        if (onSelectNode) {
          onSelectNode({
            title: hoveredNode.label,
            desc: hoveredNode.details,
            type: hoveredNode.category,
            confidence: hoveredNode.confidence,
          });
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Soft Warm Gradient Background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        40,
        width / 2,
        height / 2,
        width / 1.4
      );
      bgGrad.addColorStop(0, "#FDFCFA");
      bgGrad.addColorStop(1, "#F2F0EB");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Floating Spores / Sunlight Pollen
      sporesRef.current.forEach((sp) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        if (sp.x > width) sp.x = 0;
        if (sp.x < 0) sp.x = width;
        if (sp.y > height) sp.y = 0;
        if (sp.y < 0) sp.y = height;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha * 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 3. Draw Organic Botanical Vines & Branches (Bézier curves with gentle sway)
      const nodes = nodesRef.current;
      nodes.forEach((node) => {
        if (node.parentIndex !== undefined) {
          const parent = nodes[node.parentIndex];
          if (!parent) return;

          // Wind sway calculation
          const swayX = Math.sin(time + node.swayPhase) * 6;
          const swayY = Math.cos(time * 0.8 + node.swayPhase) * 3;

          const startX = parent.x;
          const startY = parent.y;
          const endX = node.x + swayX;
          const endY = node.y + swayY;

          // Organic curving Bézier
          const midX = (startX + endX) / 2 + Math.sin(node.swayPhase) * 15;
          const midY = (startY + endY) / 2 - 12;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(midX, midY, endX, endY);
          ctx.strokeStyle = isPulsing ? "#C27B66" : "#A3B19B";
          ctx.lineWidth = node.category === "PERSONA" ? 3.5 : 2;
          ctx.lineCap = "round";
          ctx.stroke();

          // Draw small blooming leaves along the branch
          const leafX = (startX + midX) / 2;
          const leafY = (startY + midY) / 2;
          ctx.beginPath();
          ctx.ellipse(leafX, leafY, 4, 8, Math.PI / 4 + Math.sin(time + node.swayPhase) * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "#8C9A84";
          ctx.globalAlpha = 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      // 4. Draw Botanical Node Buds & Blossoms
      nodes.forEach((node) => {
        const swayX = node.parentIndex !== undefined ? Math.sin(time + node.swayPhase) * 6 : 0;
        const swayY = node.parentIndex !== undefined ? Math.cos(time * 0.8 + node.swayPhase) * 3 : 0;
        const drawX = node.x + swayX;
        const drawY = node.y + swayY;

        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Aura bloom
        if (isHovered || isSelected || isPulsing) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, node.radius + (isHovered ? 12 : 8), 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.18;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Flower Petals / Leaf Ring
        const petalCount = node.category === "VALUE" ? 8 : node.category === "PERSONA" ? 6 : 5;
        for (let p = 0; p < petalCount; p++) {
          const angle = (p / petalCount) * Math.PI * 2 + time * 0.2;
          const px = drawX + Math.cos(angle) * (node.radius + 3);
          const py = drawY + Math.sin(angle) * (node.radius + 3);

          ctx.beginPath();
          ctx.arc(px, py, node.blossomSize * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.75;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Central Core
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = "rgba(45, 58, 49, 0.15)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Delicate inner border
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();

        // Node Label
        ctx.font = node.category === "VALUE" || node.category === "PERSONA" ? "600 11px 'Playfair Display', Georgia, serif" : "500 10px 'Source Sans 3', sans-serif";
        ctx.fillStyle = "#2D3A31";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Display brief label under node
        if (node.category === "VALUE" || node.category === "PERSONA" || isHovered) {
          ctx.fillText(node.label, drawX, drawY + node.radius + 14);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [memories, activePersona, hoveredNode, selectedNode, isPulsing]);

  return (
    <div className={cn("relative w-full h-[420px] rounded-[28px] overflow-hidden border border-[#E6E2DA] shadow-sm select-none", className)}>
      <div ref={containerRef} className="w-full h-full relative">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Top Header HUD: Cognitive State */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 font-sans">
          <div className="flex items-center gap-2 bg-[#FFFFFF]/90 border border-[#E6E2DA] px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm">
            <Leaf className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span className="text-xs font-semibold text-[#2D3A31]">
              The Living Arbor of the Mind
            </span>
            <span className="text-[11px] text-[#8C9A84] border-l border-[#E6E2DA] pl-2 font-medium">
              Cognitive Resonance Active
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handlePulse}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 shadow-sm",
                isPulsing
                  ? "bg-[#C27B66] text-[#FFFFFF] border-[#C27B66] animate-pulse"
                  : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
              )}
              title="Pulse Synaptic Wave"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span className="hidden sm:inline">Pulse Resonance</span>
            </button>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none z-10 text-[11px] font-sans">
          <div className="flex items-center gap-1.5 bg-[#FFFFFF]/90 border border-[#E6E2DA] px-3 py-1 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D3A31]" />
            <span className="text-[#2D3A31] font-medium">Core Values</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFFFFF]/90 border border-[#E6E2DA] px-3 py-1 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C9A84]" />
            <span className="text-[#2D3A31] font-medium">Active Personas</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFFFFF]/90 border border-[#E6E2DA] px-3 py-1 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C27B66]" />
            <span className="text-[#2D3A31] font-medium">Learned Habits</span>
          </div>
        </div>

        {/* Floating Node Inspection Drawer */}
        {selectedNode && (
          <div className="absolute top-16 right-4 bottom-4 w-80 bg-[#FFFFFF] border border-[#E6E2DA] p-5 rounded-[24px] shadow-2xl z-20 overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-right-2 duration-300 font-sans text-[#2D3A31]">
            <div>
              <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9A84]">
                    {selectedNode.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-full text-[#2D3A31]/60 hover:text-[#2D3A31] hover:bg-[#F2F0EB]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-base font-serif font-bold text-[#2D3A31] mb-2 leading-snug">
                {selectedNode.label}
              </h4>

              <p className="text-xs text-[#2D3A31]/80 leading-relaxed mb-4">
                {selectedNode.details}
              </p>

              <div className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#2D3A31]/70">Cognitive Confidence:</span>
                  <span className="font-bold text-[#8C9A84]">{selectedNode.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2D3A31]/70">Resonance Status:</span>
                  <span className="font-semibold text-[#2D3A31]">Synchronized</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E2DA] flex items-center justify-between text-xs text-[#2D3A31]/60">
              <span>Living Mind Flora</span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#8C9A84] hover:text-[#2D3A31] font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
