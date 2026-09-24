/**
 * LangGraph & LangChain State Graph Type Definitions
 * Graph-based multi-agent workflows with state persistence and cyclical loops.
 */

export interface LangGraphMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  name?: string;
  timestamp?: string;
}

export interface LangGraphStepTrace {
  stepIndex: number;
  nodeId: string;
  nodeName: string;
  nodeType: "supervisor" | "worker" | "synthesizer" | "critic" | "action" | "tool" | "entry" | "end";
  inputSummary: string;
  outputSummary: string;
  routingDecision: string;
  latencyMs: number;
  modelUsed: string;
  critiqueScore?: number;
  timestamp: string;
}

export interface AgentState {
  objective: string;
  messages: LangGraphMessage[];
  activeNode: string;
  extractedData: Record<string, any>;
  researchFindings?: string;
  draftSolution?: string;
  critiqueScore?: number;
  critiqueFeedback?: string;
  loopCount: number;
  maxLoops: number;
  finalOutput?: string;
  dispatchedAction?: {
    type: string;
    target: string;
    status: string;
    receiptId: string;
  };
  executionTrace: LangGraphStepTrace[];
  isCompleted: boolean;
  totalLatencyMs?: number;
  modelsUsed?: string[];
}

export interface LangGraphNodeDefinition {
  id: string;
  name: string;
  type: "supervisor" | "worker" | "synthesizer" | "critic" | "action" | "tool" | "entry" | "end";
  description: string;
  iconName: string;
  position: { x: number; y: number };
}

export interface LangGraphEdgeDefinition {
  id: string;
  source: string;
  target: string;
  label?: string;
  isConditional?: boolean;
  conditionLabel?: string;
}

export interface GraphTopologyDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "Multi-Agent" | "Code-Refinement" | "Strategic-Synthesis";
  nodes: LangGraphNodeDefinition[];
  edges: LangGraphEdgeDefinition[];
  defaultObjective: string;
}

export interface GraphExecutionResult {
  success: boolean;
  graphId: string;
  graphName: string;
  objective: string;
  finalState: AgentState;
  stepsCount: number;
  totalLatencyMs: number;
  executionTrace: LangGraphStepTrace[];
}
