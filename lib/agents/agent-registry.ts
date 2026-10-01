/**
 * Veronica Agent Registry
 * Extensible registry for all autonomous agents.
 */

import { IAgent, AgentDefinition } from "./agent-interface";
import { ResearchAgent, CodingAgent, AnalysisAgent, GeneralAgent } from "./initial-agents";

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, IAgent> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private registerDefaults(): void {
    const research = new ResearchAgent();
    const coding = new CodingAgent();
    const analysis = new AnalysisAgent();
    const general = new GeneralAgent();

    this.agents.set(research.definition.id, research);
    this.agents.set(coding.definition.id, coding);
    this.agents.set(analysis.definition.id, analysis);
    this.agents.set(general.definition.id, general);
  }

  public getAgent(id: string): IAgent | undefined {
    return this.agents.get(id);
  }

  public getAllAgents(): IAgent[] {
    return Array.from(this.agents.values());
  }

  public getAllDefinitions(): AgentDefinition[] {
    return Array.from(this.agents.values()).map((a) => a.definition);
  }

  public registerCustomAgent(agent: IAgent): void {
    this.agents.set(agent.definition.id, agent);
  }
}

export const agentRegistry = AgentRegistry.getInstance();
