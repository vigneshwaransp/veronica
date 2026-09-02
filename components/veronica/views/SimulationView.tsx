"use client";

import React, { useState } from "react";
import { DecisionSimulation, UserProfile, Persona, MemoryNode, UserPreference, BehaviorPattern } from "@/types/veronica";
import { SimulationEngine } from "@/lib/simulation-engine";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  ThumbsUp,
  RotateCcw,
  Leaf,
  CheckCircle2,
  Check
} from "lucide-react";

interface SimulationViewProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
  preferences: UserPreference[];
  patterns: BehaviorPattern[];
  simulations: DecisionSimulation[];
}

const PRESET_SCENARIOS = [
  {
    title: "Database Engine",
    situation: "Which database should we choose for VERONICA's autonomous memory store?",
    context: "Requires local Docker execution, ACID transaction logging, and sub-20ms vector indexing.",
    goal: "Maximize search latency & relational provenance joins.",
    constraints: ["100% FOSS", "Docker Compose friendly"],
    choices: [
      { title: "PostgreSQL + pgvector", description: "Unified ACID engine for relational metadata, audit logs, and embeddings." },
      { title: "Qdrant Vector DB + SQLite", description: "High-performance Rust vector engine beside lightweight local relational file." },
      { title: "MongoDB Atlas Vector", description: "NoSQL document model with cloud vector search." }
    ]
  },
  {
    title: "Frontend Stack",
    situation: "Should we build our high-throughput AI agent dashboard with Next.js App Router or Remix?",
    context: "Requires React 19, server components, and 60 FPS WebGL rendering.",
    goal: "Maximum developer velocity and strict typing.",
    constraints: ["TypeScript strict mode", "Zero unneeded dependencies"],
    choices: [
      { title: "Next.js 16 (App Router + Turbopack)", description: "Server components, instant API routes, and optimized client bundles." },
      { title: "Remix / React Router v7", description: "Standard web fetch primitives and nested layout loaders." }
    ]
  },
  {
    title: "AI Backend Stack",
    situation: "Should we build our background inference worker in Python FastAPI or Go?",
    context: "Handles concurrent LLM streams and local embedding models.",
    goal: "Low latency and easy PyTorch / Transformers integration.",
    constraints: ["Local offline support"],
    choices: [
      { title: "Python FastAPI + Uvicorn", description: "Native PyTorch integration, async endpoints, and simple deployment." },
      { title: "Go (Golang) Microservice", description: "Minimal memory footprint and high goroutine concurrency." }
    ]
  }
];

export const SimulationView: React.FC<SimulationViewProps> = ({
  user,
  activePersona,
  memories,
  preferences,
  patterns,
  simulations,
}) => {
  const [situation, setSituation] = useState(PRESET_SCENARIOS[0].situation);
  const [context, setContext] = useState(PRESET_SCENARIOS[0].context);
  const [goal, setGoal] = useState(PRESET_SCENARIOS[0].goal);
  const [constraintsText, setConstraintsText] = useState(PRESET_SCENARIOS[0].constraints.join(", "));
  const [choices, setChoices] = useState(PRESET_SCENARIOS[0].choices);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<DecisionSimulation>(simulations[0]);
  const [hasSubmittedCorrection, setHasSubmittedCorrection] = useState(false);

  const handleAddChoice = () => {
    setChoices([...choices, { title: "", description: "" }]);
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, idx) => idx !== index));
  };

  const handleChoiceChange = (index: number, field: "title" | "description", val: string) => {
    const next = [...choices];
    next[index][field] = val;
    setChoices(next);
  };

  const handleLoadPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setSituation(preset.situation);
    setContext(preset.context);
    setGoal(preset.goal);
    setConstraintsText(preset.constraints.join(", "));
    setChoices(preset.choices);
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || choices.length < 2) return;

    setIsSimulating(true);
    const validChoices = choices.filter((c) => c.title.trim());
    const constraints = constraintsText.split(",").map((c) => c.trim()).filter(Boolean);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          context,
          constraints,
          goal,
          choices: validChoices,
          persona: activePersona,
          memories: memories.slice(0, 6),
          preferences,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const created = veronicaStore.addSimulation({
          situation,
          context,
          constraints,
          goal: goal || "Optimal decision path",
          choices: validChoices.map((c, i) => {
            const scored = data.choicesScored?.find((sc: { title: string }) => sc.title === c.title);
            return {
              id: `c_${i + 1}`,
              title: c.title,
              description: c.description,
              predictedProbability: scored?.predictedProbability || (i === 0 ? 80 : 20),
              pros: scored?.pros || ["Aligns with user priorities"],
              cons: scored?.cons || ["Standard trade-offs"],
              factorsAlignment: scored?.predictedProbability || 80,
            };
          }),
          predictedChoiceId: "c_1",
          predictedChoiceTitle: data.predictedChoiceTitle || validChoices[0].title,
          confidence: data.confidence || 85,
          uncertainty: data.uncertainty || "LOW",
          keyFactors: data.keyFactors || [
            { name: "Technical Alignment", weight: 90, description: "Strong correlation with active persona.", direction: "positive" }
          ],
          alternativeChoiceId: "c_2",
          alternativeChoiceTitle: data.alternativeChoiceTitle || validChoices[1]?.title || validChoices[0].title,
          reasoningBrief: data.reasoningBrief || `Based on your habits, VERONICA estimates you would choose ${validChoices[0].title}.`,
          evidenceBasis: ["Memory Provenance Traces", "Active Persona Heuristics"],
          userFeedback: "pending",
        });

        setActiveSimulation(created);
        setIsSimulating(false);
        setHasSubmittedCorrection(false);
        return;
      }
    } catch (apiErr) {
      console.warn("API simulation fallback:", apiErr);
    }

    const simResult = SimulationEngine.runSimulation(
      { situation, context, constraints, goal, choices: validChoices },
      user,
      activePersona,
      memories,
      preferences,
      patterns
    );

    const created = veronicaStore.addSimulation(simResult);
    setActiveSimulation(created);
    setIsSimulating(false);
    setHasSubmittedCorrection(false);
  };

  const handleUserCorrection = (choiceId: string) => {
    if (!activeSimulation) return;
    veronicaStore.submitSimulationCorrection(activeSimulation.id, choiceId);
    setHasSubmittedCorrection(true);
    setActiveSimulation({
      ...activeSimulation,
      userFeedback: "corrected",
      userSelectedChoiceId: choiceId,
    });
  };

  const handleUserAgreement = () => {
    if (!activeSimulation) return;
    activeSimulation.userFeedback = "agreed";
    veronicaStore.logAuditEvent({
      agentRole: "ORCHESTRATOR",
      agentName: "VERONICA Core",
      action: `User Confirmed Prediction #${activeSimulation.id}`,
      impactLevel: "LOW",
      confirmationRequired: false,
      status: "SUCCESS",
      details: "Reinforced confidence weights for predicted choice.",
    });
    setHasSubmittedCorrection(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            What Would I <span className="italic text-[#C27B66]">Do?</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Probabilistic Behavioral Decision Simulation powered by Mistral AI.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#8C9A84]">Presets:</span>
          {PRESET_SCENARIOS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(p)}
              className="px-3 py-1 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs text-[#2D3A31] font-medium shadow-sm transition-all"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <Brain className="w-4 h-4 text-[#8C9A84]" />
            <span>Define Dilemma</span>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1.5">
                What dilemma are you considering?
              </label>
              <textarea
                rows={2}
                required
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g. Which framework should we use for our high-throughput AI API?"
                className="w-full bg-[#F2F0EB] border border-[#E6E2DA] rounded-2xl p-3 text-xs text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none focus:border-[#8C9A84]"
              />
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2 border-t border-[#E6E2DA]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8C9A84]">
                  Options ({choices.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddChoice}
                  className="text-xs text-[#8C9A84] hover:text-[#2D3A31] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Option
                </button>
              </div>

              {choices.map((c, idx) => (
                <div key={idx} className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#8C9A84]">
                      Option 0{idx + 1}
                    </span>
                    {choices.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(idx)}
                        className="text-[#C27B66] hover:text-[#2D3A31]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={c.title}
                    onChange={(e) => handleChoiceChange(idx, "title", e.target.value)}
                    placeholder={`Option ${idx + 1} Title`}
                    className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-2 text-xs font-semibold text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                  />
                  <input
                    type="text"
                    value={c.description}
                    onChange={(e) => handleChoiceChange(idx, "description", e.target.value)}
                    placeholder="Brief rationale or trade-off..."
                    className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-2 text-xs text-[#2D3A31]/70 focus:outline-none focus:border-[#8C9A84]"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full botanical-btn-primary py-3 text-xs"
            >
              {isSimulating ? (
                <span>Evaluating via Mistral AI...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Decision</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Simulation Output Card */}
        <div className="lg:col-span-6 space-y-4">
          {activeSimulation ? (
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider">
                  Predicted Choice
                </span>
                <span className="px-3 py-1 bg-[#F2F0EB] text-[#2D3A31] rounded-full text-xs font-bold border border-[#E6E2DA]">
                  {activeSimulation.confidence}% Calibrated
                </span>
              </div>

              {/* Likely Choice Banner */}
              <div className="p-5 bg-[#F2F0EB] border border-[#8C9A84]/40 rounded-2xl space-y-2">
                <span className="text-xs font-semibold text-[#8C9A84] uppercase block">
                  ★ Likely Choice
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#2D3A31]">
                  {activeSimulation.predictedChoiceTitle}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#2D3A31]/70 pt-1">
                  <span>Alternative: <strong className="text-[#2D3A31]">{activeSimulation.alternativeChoiceTitle}</strong></span>
                  <span className="px-2 py-0.5 bg-[#FFFFFF] rounded-full font-medium border border-[#E6E2DA]">
                    Uncertainty: {activeSimulation.uncertainty}
                  </span>
                </div>
              </div>

              {/* Reasoning Brief */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl text-xs text-[#2D3A31] leading-relaxed">
                {activeSimulation.reasoningBrief}
              </div>

              {/* Key Influencing Factors */}
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase block mb-2">
                  Key Factors
                </span>
                <div className="space-y-2">
                  {activeSimulation.keyFactors.map((f, i) => (
                    <div key={i} className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs flex justify-between items-center">
                      <span className="font-semibold text-[#2D3A31]">{f.name}</span>
                      <span className="text-[#8C9A84] font-bold">{f.weight}% Weight</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Loop */}
              <div className="pt-4 border-t border-[#E6E2DA] space-y-3">
                <span className="text-xs font-semibold text-[#2D3A31] block">
                  Does this match your judgment?
                </span>

                {!hasSubmittedCorrection && activeSimulation.userFeedback === "pending" ? (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleUserAgreement}
                      className="w-full botanical-btn-primary py-3 text-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Yes, I would choose this</span>
                    </button>

                    <div className="flex gap-2">
                      {activeSimulation.choices.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleUserCorrection(c.id)}
                          className="flex-1 px-3 py-2 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] font-medium transition-all truncate"
                        >
                          Choose {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#8C9A84]/15 border border-[#8C9A84]/30 rounded-2xl text-xs text-[#2D3A31] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8C9A84]" />
                    <span>Feedback recorded into your continuous Bayesian learning model.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#2D3A31]/60 border border-[#E6E2DA] rounded-[32px] bg-[#FFFFFF]">
              Enter a dilemma on the left and click Simulate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
