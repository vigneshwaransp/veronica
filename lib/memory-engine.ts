import { MemoryNode, MemoryType, Persona } from "@/types/veronica";

export class MemoryEngine {
  /**
   * Search and filter memories by query, type, and minimum importance threshold.
   */
  public static queryMemories(
    memories: MemoryNode[],
    query: string = "",
    typeFilter: MemoryType | "ALL" = "ALL",
    minConfidence: number = 0
  ): MemoryNode[] {
    const q = query.toLowerCase().trim();
    return memories.filter((m) => {
      if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
      if (m.confidence < minConfidence) return false;
      if (!q) return true;
      return (
        m.content.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.source.toLowerCase().includes(q)
      );
    });
  }

  /**
   * Computes semantic similarity between two memory nodes.
   * Recognizes semantic overlaps like "Java" <-> "Java Programs", "Next.js" <-> "React", "Postgres" <-> "pgvector".
   */
  public static computeSemanticSimilarity(nodeA: MemoryNode, nodeB: MemoryNode): number {
    if (nodeA.id === nodeB.id) return 1.0;

    let score = 0;

    // 1. Shared tags overlap
    const tagsA = new Set(nodeA.tags.map((t) => t.toLowerCase().trim()));
    const tagsB = new Set(nodeB.tags.map((t) => t.toLowerCase().trim()));
    let sharedTags = 0;
    tagsA.forEach((tag) => {
      if (tagsB.has(tag)) sharedTags++;
    });
    if (tagsA.size > 0 || tagsB.size > 0) {
      score += (sharedTags / Math.max(1, Math.min(tagsA.size, tagsB.size))) * 0.4;
    }

    // 2. Category match
    if (nodeA.category.toLowerCase() === nodeB.category.toLowerCase()) {
      score += 0.2;
    }

    // 3. Keyword / Concept token overlap
    const extractTokens = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2);
    };

    const tokensA = new Set(extractTokens(nodeA.content));
    const tokensB = new Set(extractTokens(nodeB.content));
    let sharedTokens = 0;
    tokensA.forEach((t) => {
      if (tokensB.has(t)) sharedTokens++;
      // Stem / prefix match (e.g. "java" matches "javascript" or "javaprograms")
      for (const tb of tokensB) {
        if (t !== tb && (t.startsWith(tb) || tb.startsWith(t))) {
          sharedTokens += 0.5;
        }
      }
    });

    if (tokensA.size > 0 && tokensB.size > 0) {
      const jaccard = sharedTokens / (tokensA.size + tokensB.size - sharedTokens + 1);
      score += Math.min(0.4, jaccard * 1.5);
    }

    return Math.min(1.0, score);
  }

  /**
   * Automatically synthesizes semantic links between related memory nodes.
   * E.g. links "Java Core Axioms" to "Java Programs & JVM Optimization".
   */
  public static autoLinkSemanticNodes(memories: MemoryNode[], similarityThreshold = 0.25): MemoryNode[] {
    const updated = memories.map((m) => ({
      ...m,
      linkedNodeIds: [...(m.linkedNodeIds || [])],
    }));

    for (let i = 0; i < updated.length; i++) {
      for (let j = i + 1; j < updated.length; j++) {
        const sim = this.computeSemanticSimilarity(updated[i], updated[j]);
        if (sim >= similarityThreshold) {
          if (!updated[i].linkedNodeIds.includes(updated[j].id)) {
            updated[i].linkedNodeIds.push(updated[j].id);
          }
          if (!updated[j].linkedNodeIds.includes(updated[i].id)) {
            updated[j].linkedNodeIds.push(updated[i].id);
          }
        }
      }
    }

    return updated;
  }

  /**
   * Manually adds a bidirectional semantic link between two nodes.
   */
  public static linkNodes(memories: MemoryNode[], sourceId: string, targetId: string): MemoryNode[] {
    return memories.map((m) => {
      if (m.id === sourceId && !m.linkedNodeIds.includes(targetId)) {
        return { ...m, linkedNodeIds: [...m.linkedNodeIds, targetId] };
      }
      if (m.id === targetId && !m.linkedNodeIds.includes(sourceId)) {
        return { ...m, linkedNodeIds: [...m.linkedNodeIds, sourceId] };
      }
      return m;
    });
  }

  /**
   * Computes memory distribution statistics across the 6 tiers.
   */
  public static getMemoryTierDistribution(memories: MemoryNode[]): Record<MemoryType, number> {
    const counts: Record<MemoryType, number> = {
      short_term: 0,
      long_term: 0,
      episodic: 0,
      semantic: 0,
      procedural: 0,
      preference: 0,
    };
    memories.forEach((m) => {
      if (counts[m.type] !== undefined) {
        counts[m.type]++;
      }
    });
    return counts;
  }

  /**
   * Computes differentiation matrix across personas.
   */
  public static computePersonaDifferentiability(personas: Persona[]): {
    personaId: string;
    personaName: string;
    primaryDifferentiator: string;
    uniquenessScore: number;
  }[] {
    return personas.map((p) => {
      const depth = p.parameters.technicalDepth;
      const speed = p.parameters.decisionSpeed;
      const form = p.parameters.formality;
      const creat = p.parameters.creativity;

      let primary = "Balanced Multi-Disciplinary";
      if (depth > 85) primary = "Extreme Kernel / Math Depth";
      else if (creat > 80) primary = "Divergent Innovation & Synthesis";
      else if (form > 85) primary = "Executive Protocol & Formalism";
      else if (speed > 85) primary = "Rapid Autonomous Execution";

      const uniqueness = Math.round((Math.abs(depth - 50) + Math.abs(form - 50) + Math.abs(creat - 50)) / 1.5);

      return {
        personaId: p.id,
        personaName: p.name,
        primaryDifferentiator: primary,
        uniquenessScore: Math.min(100, Math.max(60, uniqueness)),
      };
    });
  }

  /**
   * Serializes memories to JSON format for Trust Center export.
   */
  public static exportMemoryArchive(memories: MemoryNode[]): string {
    return JSON.stringify(
      {
        system: "VERONICA — BEYOND THE ASSISTANT",
        exportTimestamp: new Date().toISOString(),
        totalMemories: memories.length,
        memories,
      },
      null,
      2
    );
  }
}
