/**
 * VERONICA — BEYOND THE ASSISTANT
 * Core Type Definitions & System Data Model
 */

export type VeronicaMode =
  | "01 HUMAN"
  | "02 PERSONA"
  | "03 CLONE"
  | "04 SIMULATE"
  | "05 ASSIST"
  | "06 AGENT"
  | "07 AUTONOMOUS"
  | "08 LEARN";

export type AutonomyLevel =
  | "LEVEL 0 - OBSERVE"
  | "LEVEL 1 - RECOMMEND"
  | "LEVEL 2 - PREPARE"
  | "LEVEL 3 - EXECUTE WITH CONFIRMATION"
  | "LEVEL 4 - AUTONOMOUS";

export type AvatarState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "ANALYZING"
  | "PLANNING"
  | "EXECUTING"
  | "LEARNING"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

export type MemoryType =
  | "short_term"
  | "long_term"
  | "episodic"
  | "semantic"
  | "procedural"
  | "preference";

export type ImpactLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  title: string;
  bio: string;
  activePersonaId: string;
  autonomyLevel: AutonomyLevel;
  learningEnabled: boolean;
  modelConfidence: number; // 0-100
  totalMemoriesCount: number;
  totalSimulationsCount: number;
  accuracyRate: number;
  skills: { name: string; level: number; category: string }[];
  interests: string[];
  goals: { id: string; title: string; deadline?: string; progress: number; priority: "LOW" | "MEDIUM" | "HIGH" }[];
  communicationStyle: {
    directness: number; // 0-100
    formality: number; // 0-100
    technicalDepth: number; // 0-100
    humor: number; // 0-100
    responseLength: "concise" | "balanced" | "comprehensive";
  };
  workingStyle: {
    decisionSpeed: "rapid" | "deliberate" | "analytical";
    riskTolerance: "conservative" | "moderate" | "aggressive";
    learningPreference: "hands-on" | "theoretical" | "analogical" | "first-principles";
    collaborationPreference: "autonomous" | "collaborative" | "advisory";
  };
}

export interface PersonaParameterMatrix {
  communicationStyle: number; // 0 (casual) -> 100 (academic)
  technicalDepth: number; // 0 (layman) -> 100 (kernel/math)
  formality: number; // 0 (raw) -> 100 (executive)
  humor: number; // 0 (stoic) -> 100 (witty)
  creativity: number; // 0 (strictly logical) -> 100 (divergent)
  riskTolerance: number; // 0 (fail-safe) -> 100 (exploratory)
  decisionSpeed: number; // 0 (thorough) -> 100 (instantaneous)
  learningStyle: number; // 0 (first-principles) -> 100 (pattern-matching)
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  tagline: string;
  avatarIcon: string;
  isCustom?: boolean;
  isDefault?: boolean;
  parameters: PersonaParameterMatrix;
  preferredTools: string[];
  goals: string[];
  interests: string[];
  systemPromptAddendum: string;
}

export interface MemoryNode {
  id: string;
  type: MemoryType;
  content: string;
  category: string;
  importance: number; // 0-100
  confidence: number; // 0-100
  recency: "HIGH" | "MEDIUM" | "LOW";
  evidenceCount: number;
  source: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  linkedNodeIds: string[];
  position?: [number, number, number]; // 3D coordinates for visualizer
}

export interface UserPreference {
  id: string;
  category: "languages" | "frameworks" | "tools" | "architecture" | "workflow" | "communication";
  name: string;
  value: string;
  confidence: number; // 0-100
  evidenceCount: number;
  lastObserved: string;
  recency: "HIGH" | "MEDIUM" | "LOW";
  alternativesEvaluated: string[];
  status: "active" | "disputed" | "stale";
  notes?: string;
}

export interface BehaviorPattern {
  id: string;
  title: string;
  category: string;
  frequency: string;
  consistencyScore: number; // 0-100
  description: string;
  contextTriggers: string[];
  lastObserved: string;
  exampleInstances: string[];
}

export interface SimulationChoice {
  id: string;
  title: string;
  description: string;
  predictedProbability: number; // 0-100
  pros: string[];
  cons: string[];
  factorsAlignment: number; // 0-100
}

export interface KeyInfluencingFactor {
  name: string;
  weight: number; // 0-100
  description: string;
  direction: "positive" | "negative" | "neutral";
}

export interface DecisionSimulation {
  id: string;
  situation: string;
  context?: string;
  constraints: string[];
  goal: string;
  choices: SimulationChoice[];
  predictedChoiceId: string;
  predictedChoiceTitle: string;
  confidence: number; // 0-100
  uncertainty: "LOW" | "MEDIUM" | "HIGH";
  keyFactors: KeyInfluencingFactor[];
  alternativeChoiceId: string;
  alternativeChoiceTitle: string;
  reasoningBrief: string;
  evidenceBasis: string[];
  userFeedback: "agreed" | "corrected" | "pending";
  userSelectedChoiceId?: string;
  correctionNote?: string;
  timestamp: string;
}

export interface PredictionCardData {
  id: string;
  options: { name: string; percentage: number }[];
  predictedChoice: string;
  evidence: string[];
  confidence: number;
  isChallenged?: boolean;
  challengeChoice?: string;
  challengeNote?: string;
  showEvidenceDrawer?: boolean;
}

export interface AICouncilIntervention {
  id: string;
  detectedConfidence: number; // 0-100 (low confidence < 75%)
  isLowConfidence: boolean;
  ambiguityReason: string;
  originalInput: string;
  correctedPrompt: string;
  efficiencyGains: {
    rigorIncrease: string;
    latencyReduction: string;
    typeSafetyScore: string;
  };
  councilFindings: {
    agentName: string;
    role: string;
    verdict: string;
    recommendation: string;
  }[];
  appliedStatus: "pending" | "applied" | "dismissed";
}

export type AgentRole =
  | "PERSONA AGENT"
  | "MEMORY AGENT"
  | "RESEARCH AGENT"
  | "CODING AGENT"
  | "PLANNING AGENT"
  | "EXECUTION AGENT"
  | "CRITIC AGENT"
  | "SAFETY AGENT";

export interface AgentInstance {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  status: "IDLE" | "ACTIVE" | "WAITING" | "COMPLETED" | "BLOCKED" | "ERROR";
  currentTask?: string;
  lastAction?: string;
  successRate: number; // 0-100
  tasksCompleted: number;
}

export interface AgentExecutionPipeline {
  id: string;
  taskTitle: string;
  mode: VeronicaMode;
  autonomyLevel: AutonomyLevel;
  steps: {
    id: string;
    stepIndex: number;
    agentRole: AgentRole;
    agentName: string;
    action: string;
    status: "pending" | "running" | "completed" | "warning" | "error" | "awaiting_confirmation";
    requiresConfirmation: boolean;
    impactLevel: ImpactLevel;
    output?: string;
    timestamp: string;
  }[];
  overallStatus: "planning" | "in_progress" | "paused_for_approval" | "completed" | "failed";
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  agentRole: AgentRole | "ORCHESTRATOR" | "USER";
  agentName: string;
  action: string;
  impactLevel: ImpactLevel;
  confirmationRequired: boolean;
  status: "SUCCESS" | "WARNING" | "ERROR" | "PENDING";
  details: string;
  influencedByMemories?: string[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "USER" | "PERSONA" | "PROJECT" | "SKILL" | "TECH" | "PREF" | "TASK" | "GOAL" | "DECISION" | "TOOL";
  category?: string;
  properties: Record<string, string | number>;
  position?: [number, number, number];
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: "KNOWS" | "PREFERS" | "WORKS_ON" | "COMPLETED" | "CHOSE" | "INFLUENCES" | "CONTAINS";
  weight: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface VirtualDesktopWindow {
  id: "terminal" | "code" | "browser" | "notes" | "calendar" | "database" | "console";
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface SystemMetricsState {
  neuralLoad: number; // 0-100
  synapseActivity: number; // 0-100
  memoryUtilization: number; // 0-100
  confidenceCalibration: number; // 0-100
  fps: number;
  uptime: string;
}

export interface LearningReflection {
  id: string;
  timestamp: string;
  summary: string;
  detectedShift: string;
  affectedPreferences: string[];
  appliedWeightChange: string;
}

export type CouncilArchetype =
  | "LOGIC_RAG"
  | "GAN_ADVERSARIAL"
  | "RNN_TEMPORAL"
  | "RLHF_ALIGNMENT"
  | "EXECUTIVE_SYNTHESIS";

export interface CouncilMember {
  id: string;
  name: string;
  title: string;
  archetype: CouncilArchetype;
  role: string;
  motto: string;
  avatarColor: string;
  aiCore: "SPEED_RAG" | "GAN" | "RNN" | "RLHF" | "SYNTHESIZER";
  aiCoreDescription: string;
  weight: number; // 0-100
  accuracyScore: number;
}

export interface CouncilMemberVerdict {
  memberId: string;
  memberName: string;
  archetype: CouncilArchetype;
  confidence: number; // 0-100
  verdict: "ENDORSE" | "SCRUTINIZE" | "ADAPT" | "ALIGN" | "SYNTHESIZE";
  argument: string;
  keyMetric: string;
  aiEngineDetail: string;
}

export interface CouncilDebateResult {
  id: string;
  question: string;
  context: string;
  timestamp: string;
  consensusScore: number; // 0-100
  finalVerdict: "APPROVED" | "CONDITIONAL" | "REJECTED";
  synthesisSummary: string;
  verdicts: CouncilMemberVerdict[];
  speedRagRetrievalTimeMs: number;
  ganDiscriminatorScore: number;
  rnnTemporalPredictability: number;
  rlhfRewardAlignment: number;
}

export type StudioToolType = "IMAGE" | "AUDIO" | "PDF" | "PPT" | "GMAIL";

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  imageUrl: string;
  createdAt: string;
}

export interface GeneratedAudioItem {
  id: string;
  title: string;
  text: string;
  voice: string;
  speed: number;
  duration: string;
  createdAt: string;
}

export interface GeneratedDocItem {
  id: string;
  title: string;
  type: "PDF" | "PPT";
  pageCount: number;
  summary: string;
  slides?: { slideNumber: number; title: string; bullets: string[]; note?: string }[];
  content?: string;
  createdAt: string;
}

export interface GmailDispatchItem {
  id: string;
  to: string;
  subject: string;
  body: string;
  priority: "NORMAL" | "HIGH" | "URGENT";
  status: "SENT" | "DRAFT" | "QUEUED";
  sentAt: string;
  aiTone: string;
}

export type BoardDirectorId = "SPEED_RAG" | "RLHF" | "GAN" | "RNN" | "DAG_EXEC";

export interface BoardDirector {
  id: BoardDirectorId;
  title: string;
  role: string;
  tagline: string;
  initialSpeech: string;
  focusArea: string;
  engineMetric: string;
  metricValue: string;
}

export type AgenticRoomAgentId =
  | "WHATSAPP_AUTO"
  | "EMAIL_OUTREACH"
  | "LINKEDIN_GROWTH"
  | "GITHUB_REVIEW"
  | "CALENDAR_SCHEDULER"
  | "WEB_SCRAPER"
  | "SOCIAL_PUBLISHER"
  | "PDF_OCR_SUMMARIZER"
  | "FINANCIAL_TRACKER"
  | "SUPPORT_RESOLVER"
  | "SEO_OPTIMIZER"
  | "DEVOPS_SENTINEL"
  | "RESEARCH_SYNTHESIZER"
  | "CRM_QUALIFIER"
  | "STANDUP_TASKMASTER";

export interface AgenticRoomAgent {
  id: AgenticRoomAgentId;
  name: string;
  category: "MESSAGING" | "ENGINEERING" | "GROWTH" | "OPERATIONS" | "PRODUCTIVITY";
  role: string;
  tagline: string;
  description: string;
  status: "ACTIVE" | "IDLE" | "RUNNING" | "STANDBY";
  triggerType: "WEBHOOK" | "CRON" | "EVENT" | "MANUAL";
  triggerDetail: string;
  samplePrompt: string;
  initialSpeech: string;
  executionSteps: string[];
  metrics: {
    tasksCompleted: number;
    successRate: number; // 0-100
    avgLatency: string;
    timeSavedHours: number;
  };
  sampleOutput: {
    title: string;
    payloadType: "JSON" | "MARKDOWN" | "STATUS_CARD";
    content: string;
  };
}

export type MLModelId =
  | "SVM"
  | "KNN"
  | "LINEAR_REGRESSION"
  | "K_MEANS"
  | "RANDOM_FOREST"
  | "GRADIENT_BOOSTING"
  | "NAIVE_BAYES"
  | "DECISION_TREE"
  | "PCA"
  | "NEURAL_PERCEPTRON";

export interface MLModelDefinition {
  id: MLModelId;
  name: string;
  category: "CLASSIFICATION" | "REGRESSION" | "CLUSTERING" | "DIMENSIONALITY_REDUCTION" | "NEURAL";
  tagline: string;
  description: string;
  hyperparameters: { name: string; value: string | number; description: string }[];
  metrics: { name: string; value: string; trend?: string }[];
  accuracy: number; // 0-100
  trainingLatency: string;
  status: "TRAINED" | "TRAINING" | "IDLE";
  featureImportance?: { feature: string; weight: number }[];
  pythonCode?: {
    train: string;
    infer: string;
    snsPlot: string;
  };
}

export interface ChatTrainingSample {
  id: string;
  timestamp: string;
  role: "user" | "assistant";
  text: string;
  category: string;
  technicalRigor: number; // 0-100
  tokenCount: number;
  sentimentScore: number; // -1 to +1
  ingestedStatus: "INDEXED" | "QUEUED";
}

export interface TurnAnalysisMetric {
  turnIndex: number;
  role: "user" | "assistant";
  textSnippet: string;
  tokenCount: number;
  technicalRigor: number; // 0-100
  complexityIndex: number; // 0-100
  coherenceScore: number; // 0-100
  sentimentScore: number; // -1 to +1
  trajectoryStatus: "IMPROVING" | "OPTIMAL" | "STABLE" | "DEGRADING";
}

export interface ConversationTrajectoryReport {
  id: string;
  timestamp: string;
  overallStatus: "IMPROVING" | "STABLE" | "DEGRADING";
  trajectorySlope: number; // e.g. +2.84
  trajectoryChangePercent: number; // e.g. +15.4
  qualityScore: number; // 0-100
  semanticDensity: number; // 0-10
  cognitiveConsistency: number; // 0-100
  degradationRisk: number; // 0-100
  gatheredTurnsCount: number;
  turns: TurnAnalysisMetric[];
  diagnosticSummary: string;
  modelFindings: {
    modelId: MLModelId;
    modelName: string;
    verdict: string;
    metric: string;
    confidence: number;
    impact: "POSITIVE" | "NEUTRAL" | "WARNING";
  }[];
}
export type CoreLoopStage =
  | "OBSERVE"
  | "UNDERSTAND"
  | "REMEMBER"
  | "REASON"
  | "PREDICT"
  | "SIMULATE"
  | "ACT"
  | "LEARN"
  | "ADAPT";

export interface CoreLoopStepDetail {
  stage: CoreLoopStage;
  label: string;
  description: string;
  latencyMs: number;
  status: "COMPLETED" | "ACTIVE" | "PENDING";
  evidenceSnippet?: string;
}

export interface GeneratedDataRecord {
  id: string;
  timestamp: string;
  features: Record<string, number | string>;
  target?: string | number;
  metadata?: {
    clusterId?: number;
    anomalyScore?: number;
    entropy?: number;
    confidence?: number;
  };
}

export type SyntheticDataDomain =
  | "ML_CLASSIFICATION"
  | "ML_REGRESSION"
  | "ML_CLUSTERING"
  | "SYSTEM_TELEMETRY"
  | "NLP_CONVERSATION"
  | "ANOMALY_DETECTION"
  | "VECTOR_EMBEDDINGS";

export type SyntheticDataDistribution =
  | "GAUSSIAN_MIXTURE"
  | "UNIFORM"
  | "MARKOVIAN_DRIFT"
  | "BETA_DISTRIBUTION"
  | "POWER_LAW";

export interface SyntheticDataset {
  id: string;
  title: string;
  domain: SyntheticDataDomain;
  distribution: SyntheticDataDistribution;
  sampleCount: number;
  featureCount: number;
  featureNames: string[];
  targetName: string;
  records: GeneratedDataRecord[];
  createdAt: string;
  metrics: {
    meanEntropy: number;
    classBalanceRatio?: string;
    anomalyRatio?: number;
    missingValues: number;
  };
}

export interface ModelTrainingConfig {
  modelId: string;
  modelName: string;
  datasetId: string;
  targetColumn: string;
  featureColumns: string[];
  hyperparameters: {
    epochs: number;
    learningRate: number;
    trainTestSplit: number; // e.g. 0.8
    regularization: number;
    batchSize: number;
    kernelOrEstimators?: string | number;
  };
}

export interface ModelTrainingRun {
  id: string;
  modelId: string;
  modelName: string;
  timestamp: string;
  status: "IDLE" | "TRAINING" | "COMPLETED" | "FAILED";
  progress: number; // 0-100
  currentEpoch: number;
  totalEpochs: number;
  history: {
    epoch: number;
    trainLoss: number;
    valLoss: number;
    trainAcc: number;
    valAcc: number;
  }[];
  metrics: {
    accuracy: number;
    f1Score: number;
    precision: number;
    recall: number;
    rocAuc: number;
    mse?: number;
    p99LatencyMs: number;
  };
  featureImportances: { name: string; importance: number }[];
  confusionMatrix?: {
    labels: string[];
    matrix: number[][];
  };
}

export interface DigitalTwinState {
  currentContext: string;
  activeProject: string;
  cognitiveLoad: number; // 0-100
  sentimentPolarity: number; // -1 to +1
  emotionalTone: string;
  activeGoals: string[];
  twinMode: "HUMAN" | "AI_COPILOT" | "SIMULATION";
  currentLoopStage: CoreLoopStage;
  autonomyLevel: AutonomyLevel;
  totalMemories: number;
  totalLearnedPatterns: number;
  accuracyRate: number;
  lastAdaptationSummary: string;
}

