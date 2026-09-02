"use client";

import React, { useState } from "react";
import { VeronicaBrain } from "@/components/veronica/webgl/VeronicaBrain";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Leaf, X } from "lucide-react";

interface VeronicaBecomeSelfProps {
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: "Locking Identity Matrix", desc: "Synthesizing core values, competencies, and communication baseline." },
  { id: 2, title: "Materializing Persona Vectors", desc: "Loading specialized parameter profiles (Developer, Researcher, Designer)." },
  { id: 3, title: "Bridging 6-Tier Memory Synapses", desc: "Indexing episodic, semantic, procedural, and preference nodes." },
  { id: 4, title: "Calibrating Behavioral Priors", desc: "Evaluating Bayesian decision weights and tooling heuristics." },
  { id: 5, title: "Harmonizing 8-Agent Swarm", desc: "Connecting Persona, Memory, Research, Coding, and Safety agents." },
];

export const VeronicaBecomeSelf: React.FC<VeronicaBecomeSelfProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startSequence = () => {
    setIsInitializing(true);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsCompleted(true);
        veronicaStore.initializeSelf();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F8F4] flex flex-col justify-between font-sans p-6 sm:p-12 overflow-y-auto text-[#2D3A31]">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#8C9A84] rounded-full animate-ping" />
          <span className="text-xs font-semibold tracking-wider text-[#8C9A84] uppercase">
            Signature Protocol • Harmonize Digital Twin
          </span>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-[#2D3A31]/70 hover:text-[#2D3A31] px-4 py-1.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full transition-all flex items-center gap-1 shadow-sm"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Sequence</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 max-w-6xl mx-auto w-full items-center">
        {/* Left: 3D Brain Visualizer */}
        <div className="lg:col-span-6 h-[360px] sm:h-[480px] bg-[#04101F] border border-[#E6E2DA] rounded-[32px] overflow-hidden relative shadow-lg">
          <VeronicaBrain
            avatarState={isCompleted ? "SUCCESS" : isInitializing ? "THINKING" : "IDLE"}
            interactive={true}
          />
          {isCompleted && (
            <div className="absolute inset-0 bg-[#2D3A31]/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
              <CheckCircle2 className="w-16 h-16 text-[#8C9A84] mb-4" />
              <h3 className="text-2xl font-serif font-bold text-[#FFFFFF]">
                Digital Twin Synchronized
              </h3>
              <p className="text-xs text-[#FFFFFF]/80 max-w-sm mt-2">
                VERONICA is calibrated with your continuous thinking priors.
              </p>
            </div>
          )}
        </div>

        {/* Right: Step Sequence Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#8C9A84] uppercase">
              Step 0{currentStep} of 05
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3A31] mt-1">
              Initialize Digital Twin
            </h2>
            <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-2 leading-relaxed">
              Constructing a living probabilistic simulation of your workflows, values, and decision heuristics.
            </p>
          </div>

          <div className="space-y-3">
            {STEPS.map((s) => {
              const isPassed = s.id < currentStep || isCompleted;
              const isCurrent = s.id === currentStep && isInitializing;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex items-start gap-4",
                    isPassed
                      ? "bg-[#FFFFFF] border-[#8C9A84] shadow-sm"
                      : isCurrent
                      ? "bg-[#FFFFFF] border-[#2D3A31] ring-2 ring-[#8C9A84]/20 shadow-md"
                      : "bg-[#F9F8F4] border-[#E6E2DA] opacity-50"
                  )}
                >
                  <div className="mt-0.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#8C9A84]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#8C9A84] flex items-center justify-center text-[10px] font-bold text-[#8C9A84]">
                        {s.id}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#2D3A31]">{s.title}</h4>
                    <p className="text-xs text-[#2D3A31]/70 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            {!isInitializing && !isCompleted ? (
              <button
                onClick={startSequence}
                className="w-full botanical-btn-primary py-4 text-xs font-semibold tracking-wider uppercase shadow-md"
              >
                <span>Initiate Calibration Sequence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : isCompleted ? (
              <button
                onClick={onComplete}
                className="w-full botanical-btn-primary py-4 text-xs font-semibold tracking-wider uppercase shadow-md bg-[#8C9A84] hover:bg-[#2D3A31]"
              >
                <span>Enter Harmonized Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="px-6 py-3.5 bg-[#FFFFFF] border border-[#E6E2DA] text-[#8C9A84] rounded-full text-xs font-semibold text-center animate-pulse shadow-sm">
                Synchronizing synapses... ({Math.round((currentStep / 5) * 100)}%)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E6E2DA] pt-4 text-xs text-[#2D3A31]/60 flex justify-between items-center max-w-6xl mx-auto w-full">
        <span>FOSS • Local Execution Guaranteed</span>
        <span>VERONICA v1.0.0</span>
      </div>
    </div>
  );
};
