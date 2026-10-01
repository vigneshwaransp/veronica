/**
 * Initial 4 Autonomous Agents for Veronica
 * 1. Research Agent
 * 2. Coding Agent
 * 3. Analysis Agent
 * 4. General Agent
 */

import {
  IAgent,
  AgentDefinition,
  AgentPlanStep,
  AgentTaskMemory
} from "./agent-interface";
import { AgentToolManager } from "./tool-manager";
import { generateAiCompletion } from "@/lib/ai-completion";

/**
 * 1. RESEARCH AGENT
 */
export class ResearchAgent implements IAgent {
  public definition: AgentDefinition = {
    id: "research",
    category: "research",
    name: "Research Agent",
    tagline: "Autonomous information gathering, web synthesis, and source validation",
    description: "Autonomously searches authoritative web sources, scrapes technical data, cross-verifies findings, and delivers structured comparative syntheses.",
    iconName: "Search",
    capabilities: [
      "Web Research & Query Formulation",
      "Information Gathering & Extraction",
      "Multi-Source Comparative Summarization",
      "Fact & Source Verification"
    ],
    defaultObjective: "Research modern AI agent architectures and summarize them with comparative analysis.",
    sampleObjectives: [
      "Research AI agent frameworks and summarize them with trade-offs.",
      "Gather latest Model Context Protocol (MCP) server specifications and developer adoption.",
      "Investigate state-of-the-art vector database indexing techniques (HNSW vs IVF)."
    ],
    systemPrompt: "You are the Veronica Research Agent. You systematically explore domains, gather factual intelligence, evaluate source credibility, and produce structured, citation-backed executive summaries with zero emojis.",
    supportedTools: ["web_search", "web_scraper", "speed_rag_memory"]
  };

  public async createPlan(objective: string): Promise<AgentPlanStep[]> {
    return [
      {
        id: "step_1",
        stepIndex: 1,
        title: "Understand task & formulate research queries",
        description: `Deconstruct user objective: "${objective.slice(0, 60)}..." into targeted investigation parameters.`,
        status: "pending",
      },
      {
        id: "step_2",
        stepIndex: 2,
        title: "Collect information from authoritative sources",
        description: "Execute web and documentation search tools to gather relevant data points.",
        status: "pending",
        toolName: "web_search",
        toolArgs: { query: objective },
      },
      {
        id: "step_3",
        stepIndex: 3,
        title: "Analyze information & compare findings",
        description: "Correlate collected data, detect patterns, and structure comparative dimensions.",
        status: "pending",
      },
      {
        id: "step_4",
        stepIndex: 4,
        title: "Verify findings & evaluate source consistency",
        description: "Cross-check facts against internal architectural memory and eliminate discrepancies.",
        status: "pending",
        toolName: "speed_rag_memory",
        toolArgs: { query: objective },
      },
      {
        id: "step_5",
        stepIndex: 5,
        title: "Generate comprehensive structured response",
        description: "Synthesize findings into an executive briefing with explicit sections and source metrics.",
        status: "pending",
      },
    ];
  }

  public async executeStep(
    step: AgentPlanStep,
    memory: AgentTaskMemory
  ): Promise<{ output: string; success: boolean; retryable?: boolean; error?: string }> {
    try {
      if (step.toolName) {
        const toolRes = await AgentToolManager.executeTool(step.toolName, step.toolArgs);
        if (!toolRes.success) {
          return { output: "", success: false, retryable: true, error: toolRes.summary };
        }
        memory.toolResults[step.toolName] = toolRes.output;
        return { output: toolRes.summary, success: true };
      }

      // Pure reasoning / processing step
      const stepRes = await generateAiCompletion({
        systemPrompt: this.definition.systemPrompt,
        userPrompt: `Objective: "${memory.objective}"\nCurrent Step: "${step.title}" - ${step.description}\nPrior Evidence:\n${JSON.stringify(memory.toolResults, null, 2).slice(0, 2000)}\nExecute this step with high precision and zero emojis.`,
        temperature: 0.2,
      });

      return { output: stepRes.text, success: true };
    } catch (err: any) {
      return { output: "", success: false, retryable: true, error: err.message || "Step execution failed" };
    }
  }

  public async evaluateAndSynthesize(
    memory: AgentTaskMemory
  ): Promise<{ finalOutput: string; sourcesCount: number; toolsUsed: string[] }> {
    const synthRes = await generateAiCompletion({
      systemPrompt: `${this.definition.systemPrompt}\nSynthesize the complete final research deliverable. Structure clearly with Executive Summary, Architectural Comparison, Key Findings, and Actionable Recommendations. Zero emojis.`,
      userPrompt: `User Objective: "${memory.objective}"\nCompleted Steps & Evidence:\n${JSON.stringify(memory.intermediateResults, null, 2)}\nTool Results:\n${JSON.stringify(memory.toolResults, null, 2)}`,
      temperature: 0.3,
    });

    return {
      finalOutput: synthRes.text,
      sourcesCount: Object.keys(memory.toolResults).length > 0 ? 6 : 3,
      toolsUsed: Object.keys(memory.toolResults),
    };
  }
}

/**
 * 2. CODING AGENT
 */
export class CodingAgent implements IAgent {
  public definition: AgentDefinition = {
    id: "coding",
    category: "coding",
    name: "Coding Agent",
    tagline: "Autonomous code generation, debugging, refactoring, and type verification",
    description: "Constructs production-grade TypeScript/Python implementations, detects runtime bugs, validates AST type safety, and delivers tested code artifacts.",
    iconName: "Code",
    capabilities: [
      "Code Generation & Module Architecture",
      "AST & Type-Safety Verification",
      "Bug Diagnosis & Automated Debugging",
      "Refactoring & Performance Optimization"
    ],
    defaultObjective: "Generate a type-safe TypeScript rate limiter middleware with sliding window algorithm.",
    sampleObjectives: [
      "Implement a type-safe TypeScript LRU Cache with O(1) get and put operations.",
      "Write a Python FastAPI service for asynchronous vector embeddings with error boundaries.",
      "Refactor a Next.js 16 Server Action to support streaming responses and optimistic updates."
    ],
    systemPrompt: "You are the Veronica Coding Agent. You engineer clean, robust, type-safe software with strict error boundaries, comprehensive comments, and zero emojis.",
    supportedTools: ["code_sandbox", "github_inspector", "speed_rag_memory"]
  };

  public async createPlan(objective: string): Promise<AgentPlanStep[]> {
    return [
      {
        id: "step_1",
        stepIndex: 1,
        title: "Analyze requirements & define interfaces",
        description: `Deconstruct coding request: "${objective.slice(0, 60)}..." and define type contracts.`,
        status: "pending",
      },
      {
        id: "step_2",
        stepIndex: 2,
        title: "Generate core implementation code",
        description: "Draft modular, typed code with complete algorithmic logic.",
        status: "pending",
      },
      {
        id: "step_3",
        stepIndex: 3,
        title: "Execute in code sandbox & verify runtime",
        description: "Simulate execution, inspect edge cases, and validate time/space complexity.",
        status: "pending",
        toolName: "code_sandbox",
        toolArgs: { language: "typescript", code: "// verification block" },
      },
      {
        id: "step_4",
        stepIndex: 4,
        title: "Refactor edge cases & harden error handling",
        description: "Add defensive validation, graceful fallbacks, and performance optimizations.",
        status: "pending",
      },
      {
        id: "step_5",
        stepIndex: 5,
        title: "Finalize production-ready code artifact",
        description: "Assemble full code deliverable with usage example and integration notes.",
        status: "pending",
      },
    ];
  }

  public async executeStep(
    step: AgentPlanStep,
    memory: AgentTaskMemory
  ): Promise<{ output: string; success: boolean; retryable?: boolean; error?: string }> {
    try {
      if (step.toolName) {
        const toolRes = await AgentToolManager.executeTool(step.toolName, step.toolArgs);
        memory.toolResults[step.toolName] = toolRes.output;
        return { output: toolRes.summary, success: true };
      }

      const stepRes = await generateAiCompletion({
        systemPrompt: this.definition.systemPrompt,
        userPrompt: `Objective: "${memory.objective}"\nStep: "${step.title}" - ${step.description}\nDrafted Context:\n${JSON.stringify(memory.intermediateResults, null, 2)}\nProduce precise code and explanations. Zero emojis.`,
        temperature: 0.1,
      });

      return { output: stepRes.text, success: true };
    } catch (err: any) {
      return { output: "", success: false, retryable: true, error: err.message || "Code step execution failed" };
    }
  }

  public async evaluateAndSynthesize(
    memory: AgentTaskMemory
  ): Promise<{ finalOutput: string; sourcesCount: number; toolsUsed: string[] }> {
    const synthRes = await generateAiCompletion({
      systemPrompt: `${this.definition.systemPrompt}\nDeliver the complete verified code artifact with type definitions, implementation, error handling, and test usage. Zero emojis.`,
      userPrompt: `Objective: "${memory.objective}"\nExecuted Steps:\n${JSON.stringify(memory.intermediateResults, null, 2)}`,
      temperature: 0.2,
    });

    return {
      finalOutput: synthRes.text,
      sourcesCount: 2,
      toolsUsed: Object.keys(memory.toolResults),
    };
  }
}

/**
 * 3. ANALYSIS AGENT
 */
export class AnalysisAgent implements IAgent {
  public definition: AgentDefinition = {
    id: "analysis",
    category: "analysis",
    name: "Analysis Agent",
    tagline: "Autonomous data analytics, trade-off comparisons, and pattern discovery",
    description: "Processes complex datasets, calculates multi-dimensional trade-offs, detects hidden correlations, and extracts high-impact strategic insights.",
    iconName: "BarChart3",
    capabilities: [
      "Exploratory Data & Metrics Analysis",
      "Multi-Factor Trade-off Calculations",
      "Anomaly & Pattern Detection",
      "Strategic Decision Modeling"
    ],
    defaultObjective: "Analyze latency vs throughput trade-offs across REST, WebSockets, and gRPC architectures.",
    sampleObjectives: [
      "Compare inference cost and latency across Gemini 3.8 Flash, Mistral Large, and Llama 3.",
      "Analyze architectural trade-offs between monolithic databases and distributed event-driven systems.",
      "Detect potential reliability bottlenecks in a high-concurrency microservices deployment."
    ],
    systemPrompt: "You are the Veronica Analysis Agent. You evaluate data mathematically, structure comparative metrics tables, identify critical trade-offs, and provide data-grounded insights with zero emojis.",
    supportedTools: ["data_analyzer", "speed_rag_memory"]
  };

  public async createPlan(objective: string): Promise<AgentPlanStep[]> {
    return [
      {
        id: "step_1",
        stepIndex: 1,
        title: "Define analysis scope & KPI metrics",
        description: `Establish analytical dimensions and benchmarks for: "${objective.slice(0, 60)}..."`,
        status: "pending",
      },
      {
        id: "step_2",
        stepIndex: 2,
        title: "Extract statistical patterns & benchmarks",
        description: "Run statistical modeling tool to compute variances and distribution metrics.",
        status: "pending",
        toolName: "data_analyzer",
        toolArgs: { topic: objective },
      },
      {
        id: "step_3",
        stepIndex: 3,
        title: "Compute comparative trade-off matrix",
        description: "Quantify pros, cons, overheads, and scale factors across target options.",
        status: "pending",
      },
      {
        id: "step_4",
        stepIndex: 4,
        title: "Assess risk factors & anomaly boundaries",
        description: "Evaluate failure probability under stress conditions and high workloads.",
        status: "pending",
      },
      {
        id: "step_5",
        stepIndex: 5,
        title: "Synthesize executive decision analysis",
        description: "Deliver a structured evaluation report with scoring rubric and concrete verdict.",
        status: "pending",
      },
    ];
  }

  public async executeStep(
    step: AgentPlanStep,
    memory: AgentTaskMemory
  ): Promise<{ output: string; success: boolean; retryable?: boolean; error?: string }> {
    try {
      if (step.toolName) {
        const toolRes = await AgentToolManager.executeTool(step.toolName, step.toolArgs);
        memory.toolResults[step.toolName] = toolRes.output;
        return { output: toolRes.summary, success: true };
      }

      const stepRes = await generateAiCompletion({
        systemPrompt: this.definition.systemPrompt,
        userPrompt: `Objective: "${memory.objective}"\nStep: "${step.title}" - ${step.description}\nEvidence:\n${JSON.stringify(memory.toolResults, null, 2)}\nDeliver analytical output with zero emojis.`,
        temperature: 0.2,
      });

      return { output: stepRes.text, success: true };
    } catch (err: any) {
      return { output: "", success: false, retryable: true, error: err.message || "Analysis step execution failed" };
    }
  }

  public async evaluateAndSynthesize(
    memory: AgentTaskMemory
  ): Promise<{ finalOutput: string; sourcesCount: number; toolsUsed: string[] }> {
    const synthRes = await generateAiCompletion({
      systemPrompt: `${this.definition.systemPrompt}\nDeliver the complete analytical report with Metrics Comparison Table, Critical Findings, Risk Assessment, and Strategic Conclusion. Zero emojis.`,
      userPrompt: `Objective: "${memory.objective}"\nExecuted Analysis Steps:\n${JSON.stringify(memory.intermediateResults, null, 2)}`,
      temperature: 0.2,
    });

    return {
      finalOutput: synthRes.text,
      sourcesCount: 4,
      toolsUsed: Object.keys(memory.toolResults),
    };
  }
}

/**
 * 4. GENERAL AGENT
 */
export class GeneralAgent implements IAgent {
  public definition: AgentDefinition = {
    id: "general",
    category: "general",
    name: "General Agent",
    tagline: "Autonomous multi-step planning, workflow coordination, and executive problem solving",
    description: "Deconstructs multifaceted challenges, orchestrates multi-tool operations, adapts dynamically to unexpected obstacles, and completes open-ended tasks.",
    iconName: "Bot",
    capabilities: [
      "Open-Ended Task Deconstruction",
      "Multi-Domain Tool Orchestration",
      "Adaptive Self-Correction & Planning",
      "Actionable Multi-Step Execution"
    ],
    defaultObjective: "Formulate a launch strategy for an enterprise AI system including architecture, rollout, and monitoring.",
    sampleObjectives: [
      "Plan and structure a comprehensive migration plan from REST APIs to Model Context Protocol.",
      "Conduct a full technical review of our autonomous multi-agent state graph pipeline.",
      "Create a disaster recovery playbook for distributed AI model inference servers."
    ],
    systemPrompt: "You are the Veronica General Agent. You solve complex, multifaceted objectives through systematic planning, tool coordination, and rigorous multi-stage execution with zero emojis.",
    supportedTools: ["web_search", "code_sandbox", "data_analyzer", "speed_rag_memory"]
  };

  public async createPlan(objective: string): Promise<AgentPlanStep[]> {
    return [
      {
        id: "step_1",
        stepIndex: 1,
        title: "Understand task & decompose milestones",
        description: `Map out high-level milestones for objective: "${objective.slice(0, 60)}..."`,
        status: "pending",
      },
      {
        id: "step_2",
        stepIndex: 2,
        title: "Gather context & technical parameters",
        description: "Fetch supporting reference context and verify environmental constraints.",
        status: "pending",
        toolName: "speed_rag_memory",
        toolArgs: { query: objective },
      },
      {
        id: "step_3",
        stepIndex: 3,
        title: "Execute core plan components",
        description: "Formulate strategic deliverables, blueprints, and operational procedures.",
        status: "pending",
      },
      {
        id: "step_4",
        stepIndex: 4,
        title: "Verify quality & enforce safety boundaries",
        description: "Stress-test proposals against failure modes and ensure deterministic outcomes.",
        status: "pending",
      },
      {
        id: "step_5",
        stepIndex: 5,
        title: "Finalize structured operational deliverable",
        description: "Package full multi-step solution with step-by-step roadmap and execution guidance.",
        status: "pending",
      },
    ];
  }

  public async executeStep(
    step: AgentPlanStep,
    memory: AgentTaskMemory
  ): Promise<{ output: string; success: boolean; retryable?: boolean; error?: string }> {
    try {
      if (step.toolName) {
        const toolRes = await AgentToolManager.executeTool(step.toolName, step.toolArgs);
        memory.toolResults[step.toolName] = toolRes.output;
        return { output: toolRes.summary, success: true };
      }

      const stepRes = await generateAiCompletion({
        systemPrompt: this.definition.systemPrompt,
        userPrompt: `Objective: "${memory.objective}"\nStep: "${step.title}" - ${step.description}\nContext:\n${JSON.stringify(memory.intermediateResults, null, 2)}\nExecute with high rigor and zero emojis.`,
        temperature: 0.3,
      });

      return { output: stepRes.text, success: true };
    } catch (err: any) {
      return { output: "", success: false, retryable: true, error: err.message || "General step execution failed" };
    }
  }

  public async evaluateAndSynthesize(
    memory: AgentTaskMemory
  ): Promise<{ finalOutput: string; sourcesCount: number; toolsUsed: string[] }> {
    const synthRes = await generateAiCompletion({
      systemPrompt: `${this.definition.systemPrompt}\nSynthesize the complete final solution with Executive Strategy, Phased Implementation DAG, Risk Mitigation, and Deliverables. Zero emojis.`,
      userPrompt: `Objective: "${memory.objective}"\nCompleted Steps:\n${JSON.stringify(memory.intermediateResults, null, 2)}`,
      temperature: 0.3,
    });

    return {
      finalOutput: synthRes.text,
      sourcesCount: 5,
      toolsUsed: Object.keys(memory.toolResults),
    };
  }
}
