"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Terminal,
  Activity,
  Zap,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Cpu,
  Globe,
  Database,
  Shield,
  FileCode,
  ArrowRight,
  Clock,
  Send,
  Eye,
  Settings,
  Plus
} from "lucide-react";
import { McpServerDefinition, McpToolDefinition, McpToolExecutionResult } from "@/lib/mcp/mcp-types";
import { BUILT_IN_MCP_SERVERS } from "@/lib/mcp/mcp-server-registry";

interface MCPHubViewProps {
  onNavigateView?: (view: string) => void;
}

export function MCPHubView({ onNavigateView }: MCPHubViewProps) {
  const [servers, setServers] = useState<McpServerDefinition[]>(BUILT_IN_MCP_SERVERS);
  const [selectedServerId, setSelectedServerId] = useState<string>("google-gemini-mcp");
  const [selectedToolName, setSelectedToolName] = useState<string>("google_search_docs");
  const [toolArguments, setToolArguments] = useState<Record<string, any>>({
    query: "structured outputs and function calling in gemini 3.8",
    scope: "sdk",
  });
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<McpToolExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"runner" | "schemas" | "jsonrpc" | "servers">("runner");
  const [pingingServerId, setPingingServerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const selectedServer = servers.find((s) => s.id === selectedServerId) || servers[0];
  const selectedTool = selectedServer?.tools.find((t) => t.name === selectedToolName) || selectedServer?.tools[0];

  useEffect(() => {
    if (selectedServer && selectedServer.tools.length > 0) {
      if (!selectedServer.tools.some((t) => t.name === selectedToolName)) {
        const firstTool = selectedServer.tools[0];
        setSelectedToolName(firstTool.name);
        initDefaultArgs(firstTool);
      }
    }
  }, [selectedServerId]);

  const initDefaultArgs = (tool: McpToolDefinition) => {
    const defaultArgs: Record<string, any> = {};
    if (tool.inputSchema?.properties) {
      Object.entries(tool.inputSchema.properties).forEach(([key, prop]) => {
        if (prop.default !== undefined) {
          defaultArgs[key] = prop.default;
        } else if (prop.type === "string") {
          defaultArgs[key] = key === "query" ? "LangGraph and Model Context Protocol architectural patterns" : key === "repository" ? "vigneshwaransp/veronica" : "test input";
        } else if (prop.type === "number") {
          defaultArgs[key] = 5;
        }
      });
    }
    setToolArguments(defaultArgs);
  };

  const handleSelectTool = (tool: McpToolDefinition) => {
    setSelectedToolName(tool.name);
    initDefaultArgs(tool);
  };

  const handlePingServer = async (serverId: string) => {
    setPingingServerId(serverId);
    try {
      const res = await fetch("/api/mcp/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ping", serverId }),
      });
      const data = await res.json();
      if (data.success) {
        setServers((prev) =>
          prev.map((s) =>
            s.id === serverId ? { ...s, latencyMs: data.latencyMs, lastPingTimestamp: "Just now", status: "connected" } : s
          )
        );
      }
    } catch {
      // ignore
    } finally {
      setPingingServerId(null);
    }
  };

  const handleExecuteTool = async () => {
    if (!selectedServer || !selectedTool) return;
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch("/api/mcp/tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: selectedServer.id,
          toolName: selectedTool.name,
          arguments: toolArguments,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setExecutionResult(data.result);
      } else {
        setExecutionResult({
          toolName: selectedTool.name,
          serverId: selectedServer.id,
          serverName: selectedServer.name,
          success: false,
          inputArguments: toolArguments,
          output: data.error || "Execution failed",
          rawJsonRpcPayload: { jsonrpc: "2.0", id: 1001, method: "tools/call", params: { name: selectedTool.name, arguments: toolArguments } },
          rawJsonRpcResponse: { jsonrpc: "2.0", id: 1001, error: { code: -32603, message: data.error || "Execution failed" } },
          latencyMs: 120,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setExecutionResult({
        toolName: selectedTool.name,
        serverId: selectedServer.id,
        serverName: selectedServer.name,
        success: false,
        inputArguments: toolArguments,
        output: err.message,
        rawJsonRpcPayload: { jsonrpc: "2.0", id: 1001, method: "tools/call", params: { name: selectedTool.name, arguments: toolArguments } },
        rawJsonRpcResponse: { jsonrpc: "2.0", id: 1001, error: { code: -32603, message: err.message } },
        latencyMs: 0,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const filteredServers = servers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tools.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalToolsCount = servers.reduce((acc, s) => acc + s.tools.length, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8C9A84]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31]">
              <Server className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Model Context Protocol (MCP) Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-700 font-mono">v1.0 JSON-RPC 2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D3A31]">
              Unified MCP Server Hub
            </h1>
            <p className="text-sm text-[#2D3A31]/70 max-w-2xl">
              Connect, discover, and execute tools across Google Gemini, ChatGPT/OpenAI, GitHub, Filesystem Memory, and Speed-RAG vector engines via standard JSON-RPC 2.0 transport envelopes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
              <Activity className="w-4 h-4 text-[#8C9A84]" />
              <div className="text-left">
                <div className="text-[10px] font-medium text-[#2D3A31]/60 uppercase">Connected Servers</div>
                <div className="text-xs font-bold text-[#2D3A31]">{servers.length} Active Hubs</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
              <Zap className="w-4 h-4 text-[#8C9A84]" />
              <div className="text-left">
                <div className="text-[10px] font-medium text-[#2D3A31]/60 uppercase">Registered Tools</div>
                <div className="text-xs font-bold text-[#2D3A31]">{totalToolsCount} Tools Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#E6E2DA]">
          <div className="flex items-center gap-1.5 bg-[#F9F8F4] p-1 rounded-2xl border border-[#E6E2DA]">
            <button
              onClick={() => setActiveTab("runner")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "runner"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Tool Runner</span>
            </button>
            <button
              onClick={() => setActiveTab("servers")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "servers"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Server className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Server Registry ({servers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("schemas")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "schemas"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>JSON Schemas</span>
            </button>
            <button
              onClick={() => setActiveTab("jsonrpc")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "jsonrpc"
                  ? "bg-[#FFFFFF] text-[#2D3A31] shadow-sm"
                  : "text-[#2D3A31]/60 hover:text-[#2D3A31]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#8C9A84]" />
              <span>Wire Payloads</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9A84]" />
            <input
              type="text"
              placeholder="Search servers or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:outline-none focus:ring-1 focus:ring-[#8C9A84] w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      {activeTab === "runner" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Server & Tool Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#2D3A31]/60 tracking-wider">
                  Target MCP Server
                </span>
                <span className="text-[10px] font-mono text-[#8C9A84]">SELECT PROVIDER</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {filteredServers.map((server) => {
                  const isSelected = server.id === selectedServerId;
                  return (
                    <button
                      key={server.id}
                      onClick={() => setSelectedServerId(server.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#F2F0EB] border-[#8C9A84] shadow-sm"
                          : "bg-[#F9F8F4]/60 border-[#E6E2DA] hover:bg-[#F9F8F4]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                            server.vendor === "Google"
                              ? "bg-blue-100 text-blue-700"
                              : server.vendor === "OpenAI"
                              ? "bg-emerald-100 text-emerald-700"
                              : server.vendor === "GitHub"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-[#E6E2DA] text-[#2D3A31]"
                          }`}
                        >
                          {server.vendor.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#2D3A31]">{server.name}</div>
                          <div className="text-[10px] text-[#2D3A31]/60 flex items-center gap-2">
                            <span>{server.tools.length} Tools</span>
                            <span>•</span>
                            <span className="font-mono text-emerald-600">{server.latencyMs}ms</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePingServer(server.id);
                          }}
                          disabled={pingingServerId === server.id}
                          className="p-1.5 hover:bg-[#FFFFFF] rounded-lg text-[#8C9A84] hover:text-[#2D3A31] transition-all"
                          title="Ping MCP Server"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${pingingServerId === server.id ? "animate-spin" : ""}`}
                          />
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tool Selection for Active Server */}
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#2D3A31]/60 tracking-wider">
                  Available Tools ({selectedServer?.tools.length || 0})
                </span>
                <span className="text-[10px] font-mono text-[#8C9A84]">{selectedServer?.vendor}</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {selectedServer?.tools.map((tool) => {
                  const isSelected = tool.name === selectedToolName;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => handleSelectTool(tool)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-md"
                          : "bg-[#F9F8F4]/60 border-[#E6E2DA] text-[#2D3A31] hover:bg-[#F9F8F4]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold">{tool.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-semibold ${
                            isSelected ? "bg-[#FFFFFF]/20 text-[#FFFFFF]" : "bg-[#E6E2DA] text-[#2D3A31]/70"
                          }`}
                        >
                          {tool.category}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] line-clamp-2 leading-relaxed ${
                          isSelected ? "text-[#FFFFFF]/80" : "text-[#2D3A31]/60"
                        }`}
                      >
                        {tool.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Execution Form & Real-Time Output */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E2DA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#8C9A84]">TOOL CALL:</span>
                    <h3 className="text-base font-bold text-[#2D3A31] font-mono">{selectedTool?.name}</h3>
                  </div>
                  <p className="text-xs text-[#2D3A31]/70 mt-0.5">{selectedTool?.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExecuteTool}
                    disabled={isExecuting}
                    className="px-5 py-2.5 bg-[#2D3A31] hover:bg-[#1E2620] disabled:opacity-50 text-[#FFFFFF] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Executing via MCP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Execute Tool via MCP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Arguments Input Fields */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-[#2D3A31]/60 tracking-wider">
                  Input Parameters Schema
                </span>

                {selectedTool?.inputSchema?.properties &&
                  Object.entries(selectedTool.inputSchema.properties).map(([key, prop]) => {
                    const isRequired = selectedTool.inputSchema.required?.includes(key);
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-mono font-bold text-[#2D3A31] flex items-center gap-1.5">
                            <span>{key}</span>
                            {isRequired && <span className="text-red-500 font-bold">*</span>}
                          </label>
                          <span className="text-[10px] text-[#2D3A31]/50 font-mono">
                            Type: {prop.type} {prop.enum ? `[${prop.enum.join(" | ")}]` : ""}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#2D3A31]/60">{prop.description}</p>

                        {prop.enum ? (
                          <select
                            value={toolArguments[key] || prop.default || prop.enum[0]}
                            onChange={(e) =>
                              setToolArguments({ ...toolArguments, [key]: e.target.value })
                            }
                            className="w-full p-2.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none font-mono"
                          >
                            {prop.enum.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : prop.type === "number" ? (
                          <input
                            type="number"
                            value={toolArguments[key] !== undefined ? toolArguments[key] : prop.default || 5}
                            onChange={(e) =>
                              setToolArguments({
                                ...toolArguments,
                                [key]: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full p-2.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none font-mono"
                          />
                        ) : (
                          <textarea
                            rows={key === "code" || key === "prompt" ? 4 : 2}
                            value={toolArguments[key] || ""}
                            onChange={(e) =>
                              setToolArguments({ ...toolArguments, [key]: e.target.value })
                            }
                            placeholder={`Enter ${key}...`}
                            className="w-full p-2.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs text-[#2D3A31] focus:ring-1 focus:ring-[#8C9A84] focus:outline-none font-mono resize-y"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Real-time Output & Telemetry View */}
              {executionResult && (
                <div className="mt-6 pt-5 border-t border-[#E6E2DA] space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-[#2D3A31] flex items-center gap-1.5">
                        {executionResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>MCP Execution Result</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                        {executionResult.latencyMs}ms
                      </span>
                      {executionResult.modelGroundingUsed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                          {executionResult.modelGroundingUsed}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#2D3A31]/50 font-mono">
                      {new Date(executionResult.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Output display block */}
                  <div className="bg-[#1B241E] border border-[#2D3A31] rounded-2xl p-4 text-white font-mono text-xs overflow-x-auto max-h-96">
                    <pre className="text-emerald-400 whitespace-pre-wrap">
                      {typeof executionResult.output === "string"
                        ? executionResult.output
                        : JSON.stringify(executionResult.output, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Server Registry Tab */}
      {activeTab === "servers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <div
              key={server.id}
              className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                      server.vendor === "Google"
                        ? "bg-blue-100 text-blue-800"
                        : server.vendor === "OpenAI"
                        ? "bg-emerald-100 text-emerald-800"
                        : server.vendor === "GitHub"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-[#E6E2DA] text-[#2D3A31]"
                    }`}
                  >
                    {server.vendor}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{server.latencyMs}ms</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#2D3A31]">{server.name}</h3>
                <p className="text-xs text-[#2D3A31]/70 leading-relaxed">{server.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E6E2DA]">
                <div className="flex items-center justify-between text-xs text-[#2D3A31]/70 font-mono">
                  <span>Transport:</span>
                  <span className="font-bold text-[#2D3A31]">{server.transport}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#2D3A31]/70 font-mono">
                  <span>Tools Registered:</span>
                  <span className="font-bold text-[#2D3A31]">{server.tools.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#2D3A31]/70 font-mono">
                  <span>Version:</span>
                  <span className="font-bold text-[#2D3A31]">{server.version}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedServerId(server.id);
                    setActiveTab("runner");
                  }}
                  className="w-full py-2 bg-[#F2F0EB] hover:bg-[#E6E2DA] text-[#2D3A31] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open in Tool Runner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* JSON Schemas Tab */}
      {activeTab === "schemas" && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3A31]">
              Full Tool Schema Directory ({totalToolsCount} Tools)
            </h3>
            <span className="text-xs text-[#8C9A84] font-mono">OpenAPI / MCP Compatible</span>
          </div>

          <div className="bg-[#1B241E] rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px]">
            <pre>
              {JSON.stringify(
                servers.map((s) => ({
                  serverId: s.id,
                  serverName: s.name,
                  vendor: s.vendor,
                  tools: s.tools,
                })),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Wire Payloads Tab */}
      {activeTab === "jsonrpc" && (
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3A31]">
              Last JSON-RPC 2.0 Transport Inspection
            </h3>
            <span className="text-xs text-[#8C9A84] font-mono">JSON-RPC v2.0</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-[#2D3A31]/70">Request Wire Envelope</span>
              <div className="bg-[#1B241E] rounded-2xl p-4 text-blue-400 font-mono text-xs overflow-x-auto h-64">
                <pre>
                  {JSON.stringify(
                    executionResult?.rawJsonRpcPayload || {
                      jsonrpc: "2.0",
                      id: 1001,
                      method: "tools/call",
                      params: {
                        name: selectedTool?.name,
                        arguments: toolArguments,
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-[#2D3A31]/70">Response Wire Envelope</span>
              <div className="bg-[#1B241E] rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto h-64">
                <pre>
                  {JSON.stringify(
                    executionResult?.rawJsonRpcResponse || {
                      jsonrpc: "2.0",
                      id: 1001,
                      result: {
                        status: "Awaiting tool execution payload",
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
