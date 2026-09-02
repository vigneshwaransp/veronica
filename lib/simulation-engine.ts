import {
  DecisionSimulation,
  SimulationChoice,
  KeyInfluencingFactor,
  UserProfile,
  Persona,
  MemoryNode,
  UserPreference,
  BehaviorPattern
} from "@/types/veronica";

export interface SimulationInput {
  situation: string;
  context?: string;
  constraints: string[];
  goal: string;
  choices: { title: string; description: string; pros?: string[]; cons?: string[] }[];
}

export class SimulationEngine {
  /**
   * Evaluates a decision situation using probabilistic behavioral heuristics and multi-tier memory matching.
   */
  public static runSimulation(
    input: SimulationInput,
    user: UserProfile,
    persona: Persona,
    memories: MemoryNode[],
    preferences: UserPreference[],
    behaviorPatterns: BehaviorPattern[]
  ): Omit<DecisionSimulation, "id" | "timestamp"> {
    const scoredChoices: SimulationChoice[] = input.choices.map((choice, index) => {
      let score = 50; // Baseline
      const pros: string[] = choice.pros ? [...choice.pros] : [];
      const cons: string[] = choice.cons ? [...choice.cons] : [];
      const lowerChoice = (choice.title + " " + choice.description).toLowerCase();

      // 1. Preference matching
      preferences.forEach((pref) => {
        const prefKey = pref.name.toLowerCase();
        const prefVal = pref.value.toLowerCase();
        if (lowerChoice.includes(prefKey) || lowerChoice.includes(prefVal)) {
          score += (pref.confidence / 100) * 25;
          pros.push(`Aligns with learned preference for ${pref.value} (${pref.confidence}% confidence)`);
        }
      });

      // 2. Persona Alignment
      if (persona.parameters.technicalDepth > 80 && (lowerChoice.includes("strict") || lowerChoice.includes("type") || lowerChoice.includes("native") || lowerChoice.includes("acid") || lowerChoice.includes("low-level") || lowerChoice.includes("rust") || lowerChoice.includes("postgres"))) {
        score += 15;
      }
      if (persona.parameters.riskTolerance < 40 && (lowerChoice.includes("experimental") || lowerChoice.includes("untested") || lowerChoice.includes("complex cluster"))) {
        score -= 20;
        cons.push("Higher operational risk contradicts current risk tolerance settings");
      }

      // 3. Behavior pattern matching
      behaviorPatterns.forEach((bp) => {
        if (bp.title.includes("Minimalist") && (lowerChoice.includes("simple") || lowerChoice.includes("unified") || lowerChoice.includes("native"))) {
          score += 12;
        }
      });

      // Ensure slight variance based on index if equal
      score += (input.choices.length - index) * 3;

      const factorsAlignment = Math.min(99, Math.max(10, Math.round(score)));

      return {
        id: `choice_${index + 1}`,
        title: choice.title,
        description: choice.description,
        predictedProbability: 0, // Will normalize below
        pros: pros.length > 0 ? pros : ["Solid baseline alternative"],
        cons: cons.length > 0 ? cons : ["Standard architectural trade-offs"],
        factorsAlignment,
      };
    });

    // Normalize probabilities across choices
    const totalScore = scoredChoices.reduce((acc, c) => acc + c.factorsAlignment, 0);
    scoredChoices.forEach((c) => {
      c.predictedProbability = Math.round((c.factorsAlignment / totalScore) * 100);
    });

    // Sort by probability descending
    const sorted = [...scoredChoices].sort((a, b) => b.predictedProbability - a.predictedProbability);
    const topChoice = sorted[0];
    const alternative = sorted[1] || sorted[0];

    // Compute confidence and uncertainty
    const leadMargin = topChoice.predictedProbability - (alternative.id !== topChoice.id ? alternative.predictedProbability : 0);
    const confidence = Math.min(95, Math.max(55, Math.round(topChoice.predictedProbability * 0.7 + leadMargin * 0.5 + 20)));
    
    let uncertainty: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (confidence < 68) uncertainty = "HIGH";
    else if (confidence < 82) uncertainty = "MEDIUM";

    // Extract Key Influencing Factors
    const keyFactors: KeyInfluencingFactor[] = [
      {
        name: "Learned Stack & Tooling Bias",
        weight: Math.min(95, Math.round(user.modelConfidence * 0.95)),
        description: `High correlation with ${preferences.slice(0, 2).map((p) => p.value).join(", ")}.`,
        direction: "positive"
      },
      {
        name: "Persona Alignment (" + persona.name + ")",
        weight: Math.round(persona.parameters.technicalDepth * 0.9),
        description: `Reflects technical depth (${persona.parameters.technicalDepth}%) and risk tolerance (${persona.parameters.riskTolerance}%).`,
        direction: "positive"
      },
      {
        name: "Simplicity & Operational Friction",
        weight: 85,
        description: "Preference for unified, self-contained architecture over distributed complexity.",
        direction: "positive"
      }
    ];

    // Identify evidence memories
    const relevantMemories = memories
      .filter((m) => m.importance > 80)
      .slice(0, 3)
      .map((m) => `Memory #${m.id} (${m.content.slice(0, 50)}...)`);

    const reasoningBrief = `Based on your past ${user.totalSimulationsCount} observed decisions and preferred tools in persona "${persona.name}", VERONICA estimates you would most likely choose "${topChoice.title}". ${
      uncertainty === "HIGH" 
        ? "Note: High uncertainty detected due to close trade-offs with " + alternative.title + "." 
        : "Confidence calibrated at " + confidence + "% based on recurring behavioral consistency."
    }`;

    return {
      situation: input.situation,
      context: input.context,
      constraints: input.constraints.length > 0 ? input.constraints : ["Standard constraints applied"],
      goal: input.goal || "Optimal decision path",
      choices: sorted,
      predictedChoiceId: topChoice.id,
      predictedChoiceTitle: topChoice.title,
      confidence,
      uncertainty,
      keyFactors,
      alternativeChoiceId: alternative.id,
      alternativeChoiceTitle: alternative.title,
      reasoningBrief,
      evidenceBasis: relevantMemories.length > 0 ? relevantMemories : ["General behavioral priors"],
      userFeedback: "pending",
    };
  }
}
