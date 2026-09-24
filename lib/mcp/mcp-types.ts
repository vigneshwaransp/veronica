/**
 * Model Context Protocol (MCP) Type Definitions
 * Strict JSON-RPC 2.0 specifications with multi-provider server configurations.
 */

export type McpTransportType = "stdio" | "sse" | "http-jsonrpc" | "in-memory";

export interface McpToolParameterProperty {
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  enum?: string[];
  default?: any;
}

export interface McpToolInputSchema {
  type: "object";
  properties: Record<string, McpToolParameterProperty>;
  required?: string[];
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: McpToolInputSchema;
  category: "search" | "code" | "reasoning" | "filesystem" | "git" | "rag" | "vision" | "custom";
}

export interface McpResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface McpPromptDefinition {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface McpServerDefinition {
  id: string;
  name: string;
  vendor: "Google" | "OpenAI" | "GitHub" | "System" | "Web" | "Community";
  version: string;
  transport: McpTransportType;
  endpointUrl?: string;
  status: "connected" | "connecting" | "idle" | "error";
  latencyMs: number;
  description: string;
  capabilities: {
    tools?: boolean;
    resources?: boolean;
    prompts?: boolean;
    logging?: boolean;
  };
  tools: McpToolDefinition[];
  resources?: McpResourceDefinition[];
  prompts?: McpPromptDefinition[];
  lastPingTimestamp?: string;
}

export interface McpJsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

export interface McpJsonRpcResponse<T = any> {
  jsonrpc: "2.0";
  id: string | number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface McpToolExecutionResult {
  toolName: string;
  serverId: string;
  serverName: string;
  success: boolean;
  inputArguments: Record<string, any>;
  output: any;
  rawJsonRpcPayload: McpJsonRpcRequest;
  rawJsonRpcResponse: McpJsonRpcResponse;
  latencyMs: number;
  timestamp: string;
  modelGroundingUsed?: string;
}
