"use client";

import React, { useState } from "react";
import { Persona, PersonaParameterMatrix } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Sliders,
  Save,
  Plus,
  Check,
  Leaf,
  Layers,
  Wrench,
  Target
} from "lucide-react";

interface PersonaViewProps {
  personas: Persona[];
  activePersonaId: string;
}

export const PersonaView: React.FC<PersonaViewProps> = ({
  personas,
  activePersonaId,
}) => {
  const active = personas.find((p) => p.id === activePersonaId) || personas[0];
  const [selectedPersona, setSelectedPersona] = useState<Persona>({ ...active });
  const [isSaved, setIsSaved] = useState(false);

  const handleParamChange = (key: keyof PersonaParameterMatrix, val: number) => {
    setSelectedPersona({
      ...selectedPersona,
      parameters: {
        ...selectedPersona.parameters,
        [key]: val,
      },
    });
  };

  const handleSave = () => {
    veronicaStore.updatePersona(selectedPersona);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleActivate = (personaId: string) => {
    veronicaStore.setActivePersona(personaId);
    const p = personas.find((item) => item.id === personaId);
    if (p) setSelectedPersona({ ...p });
  };

  const PARAMETER_CONFIG: {
    key: keyof PersonaParameterMatrix;
    label: string;
    low: string;
    high: string;
  }[] = [
    { key: "technicalDepth", label: "Technical Depth", low: "High-Level", high: "Compiler Rigor" },
    { key: "communicationStyle", label: "Directness", low: "Elaborative", high: "Ultra-Concise" },
    { key: "formality", label: "Formality", low: "Conversational", high: "Academic" },
    { key: "creativity", label: "Divergent Thinking", low: "Conservative", high: "Novel Synthesis" },
    { key: "riskTolerance", label: "Risk Tolerance", low: "Defensive / Strict", high: "Experimental" },
    { key: "decisionSpeed", label: "Decision Velocity", low: "Deliberate", high: "Heuristic" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Persona <span className="italic text-[#8C9A84]">Architecture</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Dynamic behavioral lenses that shape communication style, technical rigor, and reasoning priors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D3A31]/70">Active Model:</span>
          <span className="px-3 py-1 bg-[#2D3A31] text-[#FFFFFF] rounded-full text-xs font-semibold">
            {active.name}
          </span>
        </div>
      </div>

      {/* Preset Persona Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map((p) => {
          const isCurrentActive = p.id === activePersonaId;
          const isCurrentSelected = p.id === selectedPersona.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPersona({ ...p })}
              className={cn(
                "p-5 rounded-[24px] border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-sm",
                isCurrentSelected
                  ? "bg-[#FFFFFF] border-[#8C9A84] shadow-md ring-2 ring-[#8C9A84]/20"
                  : "bg-[#FFFFFF] border-[#E6E2DA] hover:bg-[#F9F8F4]"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8C9A84] uppercase">
                    {p.parameters.technicalDepth}% Tech
                  </span>
                  {isCurrentActive && (
                    <span className="px-2 py-0.5 bg-[#8C9A84] text-[#FFFFFF] text-[10px] font-semibold rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-[#2D3A31]">{p.name}</h3>
                <p className="text-xs text-[#2D3A31]/70 line-clamp-2 leading-relaxed">{p.tagline}</p>
              </div>

              <div className="pt-3 border-t border-[#E6E2DA]">
                {isCurrentActive ? (
                  <span className="text-xs font-semibold text-[#8C9A84] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Synchronized
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivate(p.id);
                    }}
                    className="w-full py-1.5 bg-[#F2F0EB] hover:bg-[#2D3A31] hover:text-[#FFFFFF] text-[#2D3A31] text-xs font-semibold rounded-full transition-all text-center"
                  >
                    Activate Persona
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Persona Customizer Card */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-3">
          <div>
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
              Tuning Parameters
            </span>
            <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
              {selectedPersona.name} — {selectedPersona.role}
            </h3>
          </div>

          <button
            onClick={handleSave}
            className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Saved & Calibrated</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Parameters</span>
              </>
            )}
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARAMETER_CONFIG.map((param) => {
            const val = selectedPersona.parameters[param.key] || 50;
            return (
              <div key={param.key} className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2D3A31]">{param.label}</span>
                  <span className="text-xs font-bold text-[#8C9A84]">{val}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
                  className="w-full accent-[#8C9A84]"
                />

                <div className="flex items-center justify-between text-[10px] text-[#2D3A31]/50">
                  <span>{param.low}</span>
                  <span>{param.high}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Prompt Addendum */}
        <div className="space-y-2 pt-4 border-t border-[#E6E2DA]">
          <label className="block text-xs font-semibold text-[#2D3A31]">
            System Prompt Persona Addendum
          </label>
          <textarea
            rows={3}
            value={selectedPersona.systemPromptAddendum || ""}
            onChange={(e) =>
              setSelectedPersona({
                ...selectedPersona,
                systemPromptAddendum: e.target.value,
              })
            }
            className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-3 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
          />
        </div>
      </div>
    </div>
  );
};
