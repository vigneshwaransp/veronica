import { MemoryNode, MemoryType } from "@/types/veronica";

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
