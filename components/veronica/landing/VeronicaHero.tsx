"use client";

import React from "react";
import { VeronicaBrain } from "@/components/veronica/webgl/VeronicaBrain";
import { KineticMarquee } from "@/components/veronica/ui/KineticMarquee";
import { NumberBadge } from "@/components/veronica/ui/NumberBadge";
import { ArrowUpRight, Sparkles, Terminal, Shield, Zap, Cpu } from "lucide-react";

interface VeronicaHeroProps {
  onEnterOS: () => void;
  onExploreSelf: () => void;
}

export const VeronicaHero: React.FC<VeronicaHeroProps> = ({
  onEnterOS,
  onExploreSelf,
}) => {
  return (
    <section className="relative w-full bg-[#09090B] text-[#FAFAFA] border-b border-[#3F3F46] overflow-hidden">
      {/* Top Ticker Marquee */}
      <KineticMarquee
        items={[
          "VERONICA",
          "BEYOND THE ASSISTANT",
          "COMPUTATIONAL DIGITAL SELF",
          "BEHAVIORAL SIMULATION ENGINE",
          "PERSONA ARCHITECTURE",
          "PROBABILISTIC JUDGMENT",
          "MULTI-AGENT SWARM",
          "AUTONOMY GATES L0-L4",
          "FOSS-FIRST AI OS",
        ]}
        speed="fast"
      />

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#3F3F46]">
        {/* Left Column: Viewport Massive Typography & Pitch */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#3F3F46] bg-[#09090B]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121215] border border-[#3F3F46] mb-6 font-mono text-xs text-[#DFE104] uppercase font-bold tracking-widest">
              <span className="w-2 h-2 bg-[#DFE104] animate-ping inline-block"></span>
              DIGITAL TWIN & VIRTUAL HUMAN OS
            </div>

            <h1 className="hero-clamp-text text-[#FAFAFA] select-none tracking-tighter">
              VERONICA
            </h1>

            <div className="text-3xl sm:text-5xl lg:text-6xl font-black font-space tracking-tight text-[#A1A1AA] uppercase mt-2 leading-none">
              BEYOND<br />
              <span className="text-[#FAFAFA]">THE ASSISTANT.</span>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-[#A1A1AA] font-mono mt-8 max-w-2xl leading-relaxed">
              An AI operating system that learns how you think, predicts how you behave, and evolves with you.{" "}
              <strong className="text-white font-bold">
                &ldquo;Don&apos;t just assist the user. Understand how the user operates.&rdquo;
              </strong>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              onClick={onEnterOS}
              className="brutalist-btn-accent px-8 py-4 text-sm sm:text-base flex items-center gap-3 font-bold group"
            >
              <span>ENTER VERONICA OS</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <button
              onClick={onExploreSelf}
              className="brutalist-btn px-8 py-4 text-sm sm:text-base flex items-center gap-3 font-bold"
            >
              <span>INITIALIZE DIGITAL SELF</span>
              <Cpu className="w-5 h-5 text-[#DFE104]" />
            </button>
          </div>

          {/* Live Telemetry Footer */}
          <div className="mt-14 pt-6 border-t border-[#3F3F46] grid grid-cols-3 gap-4 font-mono text-xs text-[#A1A1AA]">
            <div>
              <span className="block text-[10px] uppercase text-[#71717A]">PREDICTION CONFIDENCE</span>
              <span className="text-base font-black text-[#DFE104]">86.4%</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-[#71717A]">ACTIVE MEMORIES</span>
              <span className="text-base font-black text-white">1,248 NODES</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-[#71717A]">AUTONOMY LEVEL</span>
              <span className="text-base font-black text-white">L2 PREPARE</span>
            </div>
          </div>
        </div>

        {/* Right Column: WebGL Interactive Digital Brain */}
        <div className="lg:col-span-5 relative bg-[#0D0D11] min-h-[480px] lg:min-h-[600px] flex flex-col justify-between p-4">
          <div className="flex items-center justify-between font-mono text-xs border-b border-[#3F3F46] pb-3 px-2">
            <span className="text-[#DFE104] font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#DFE104] animate-pulse"></span>
              COMPUTATIONAL BRAIN MODEL
            </span>
            <span className="text-[#A1A1AA]">RAYCAST INTERACTIVE</span>
          </div>

          <div className="w-full h-full flex-1 my-2">
            <VeronicaBrain avatarState="THINKING" interactive={true} />
          </div>

          <div className="font-mono text-[11px] text-[#A1A1AA] border-t border-[#3F3F46] pt-3 px-2 flex justify-between">
            <span>HOVER / ROTATE TO INSPECT CLUSTERS</span>
            <span className="text-[#DFE104]">60 FPS NEURAL PIPELINE</span>
          </div>
        </div>
      </div>

      {/* Massive Graphic Number Indicator Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b border-[#3F3F46]">
        <NumberBadge
          number="01"
          label="IDENTITY"
          sublabel="Core values, technical proficiency & working styles"
        />
        <NumberBadge
          number="02"
          label="MEMORY"
          sublabel="6-tier episodic, procedural & semantic cosmos"
        />
        <NumberBadge
          number="03"
          label="PERSONA"
          sublabel="Customizable multi-axis behavioral vectors"
        />
        <NumberBadge
          number="04"
          label="BEHAVIOR"
          sublabel="Probabilistic decision patterns & tool bias"
        />
        <NumberBadge
          number="05"
          label="SIMULATION"
          sublabel="Signature 'What Would I Do?' laboratory"
        />
        <NumberBadge
          number="06"
          label="AGENCY"
          sublabel="8-agent swarm with 5-tier safety gates"
        />
      </div>

      {/* Secondary Slower Marquee */}
      <KineticMarquee
        items={[
          "NOT A CHATBOT — A COMPUTATIONAL MIRROR",
          "TRANSPARENT PROBABILISTIC REASONING",
          "WHAT WOULD I DO?",
          "FULL DATA SOVEREIGNTY & AUDIT TRAIL",
          "CALIBRATED UNCERTAINTY",
          "HIGH-ENERGY KINETIC BRUTALISM",
        ]}
        speed="slow"
        reverse={true}
      />
    </section>
  );
};
