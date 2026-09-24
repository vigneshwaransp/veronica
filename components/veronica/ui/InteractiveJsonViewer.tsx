"use client";

import React, { useState, useMemo } from "react";
import {
  Code2,
  Table as TableIcon,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  Layers,
  AlertCircle,
  Info,
  Maximize2,
  Minimize2,
  FileJson,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface InteractiveJsonViewerProps {
  content: string | object;
  title?: string;
  sourceUrl?: string;
  className?: string;
}

interface ParsedJsonPayload {
  data: any;
  preMarkdown: string;
  postMarkdown: string;
  isValidJson: boolean;
}

export const parsePotentialJson = (rawContent: string | object): ParsedJsonPayload => {
  if (typeof rawContent === "object" && rawContent !== null) {
    return {
      data: rawContent,
      preMarkdown: "",
      postMarkdown: "",
      isValidJson: true,
    };
  }

  if (typeof rawContent !== "string") {
    return {
      data: null,
      preMarkdown: "",
      postMarkdown: String(rawContent || ""),
      isValidJson: false,
    };
  }

  const trimmed = rawContent.trim();

  // Case 1: Pure JSON string
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        data: parsed,
        preMarkdown: "",
        postMarkdown: "",
        isValidJson: true,
      };
    } catch {
      // Fall through
    }
  }

  // Case 2: JSON inside markdown code fence ```json ... ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = trimmed.match(codeBlockRegex);

  if (match) {
    const jsonCandidate = match[1].trim();
    if (
      (jsonCandidate.startsWith("{") && jsonCandidate.endsWith("}")) ||
      (jsonCandidate.startsWith("[") && jsonCandidate.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(jsonCandidate);
        const matchIndex = trimmed.indexOf(match[0]);
        const preMarkdown = trimmed.slice(0, matchIndex).trim();
        const postMarkdown = trimmed.slice(matchIndex + match[0].length).trim();
        return {
          data: parsed,
          preMarkdown,
          postMarkdown,
          isValidJson: true,
        };
      } catch {
        // Fall through
      }
    }
  }

  // Case 3: Embedded raw JSON between { ... } or [ ... ]
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonCandidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonCandidate);
      const preMarkdown = trimmed.slice(0, firstBrace).trim();
      const postMarkdown = trimmed.slice(lastBrace + 1).trim();
      return {
        data: parsed,
        preMarkdown,
        postMarkdown,
        isValidJson: true,
      };
    } catch {
      // Fall through
    }
  }

  return {
    data: null,
    preMarkdown: "",
    postMarkdown: trimmed,
    isValidJson: false,
  };
};

export const InteractiveJsonViewer: React.FC<InteractiveJsonViewerProps> = ({
  content,
  title,
  sourceUrl,
  className,
}) => {
  const [viewMode, setViewMode] = useState<"VISUAL_CARDS" | "TREE" | "TABLE" | "RAW">("VISUAL_CARDS");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const { data, preMarkdown, postMarkdown, isValidJson } = useMemo(() => {
    return parsePotentialJson(content);
  }, [content]);

  // If not valid JSON, render standard markdown
  if (!isValidJson || !data) {
    return (
      <div className={cn("p-5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl text-xs text-[#2D3A31] font-sans leading-relaxed whitespace-pre-wrap overflow-x-auto", className)}>
        <MarkdownRenderer content={typeof content === "string" ? content : JSON.stringify(content, null, 2)} />
      </div>
    );
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyValue = (val: string, path: string) => {
    navigator.clipboard.writeText(val);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1800);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

  const isSectionExpanded = (key: string) => expandedSections[key] !== false;

  const expandAll = () => {
    if (typeof data === "object" && data !== null) {
      const next: Record<string, boolean> = {};
      Object.keys(data).forEach((k) => (next[k] = true));
      setExpandedSections(next);
    }
  };

  const collapseAll = () => {
    if (typeof data === "object" && data !== null) {
      const next: Record<string, boolean> = {};
      Object.keys(data).forEach((k) => (next[k] = false));
      setExpandedSections(next);
    }
  };

  // Find array collections for Table mode
  const tabularCollections = useMemo(() => {
    const collections: { key: string; items: any[] }[] = [];
    if (Array.isArray(data)) {
      collections.push({ key: "Root List", items: data });
    } else if (typeof data === "object" && data !== null) {
      Object.entries(data).forEach(([k, v]) => {
        if (Array.isArray(v) && v.length > 0) {
          collections.push({ key: k, items: v });
        } else if (typeof v === "object" && v !== null) {
          Object.entries(v).forEach(([subK, subV]) => {
            if (Array.isArray(subV) && subV.length > 0) {
              collections.push({ key: `${k}.${subK}`, items: subV });
            }
          });
        }
      });
    }
    return collections;
  }, [data]);

  // Extract quick metadata highlights
  const metadataHighlights = useMemo(() => {
    if (typeof data !== "object" || data === null) return null;
    const meta = data.extraction_metadata || data.metadata || data.meta || data;
    return {
      sourceUrl: meta.source_url || meta.target_url || meta.url || sourceUrl,
      confidence: meta.confidence_score !== undefined ? `${Math.round(meta.confidence_score * 100)}%` : null,
      recordsParsed: meta.records_parsed !== undefined ? meta.records_parsed : null,
      timestamp: meta.timestamp || meta.extracted_at || null,
      status: meta.status || data.cresentx_core_metadata?.operational_status || data.operational_status || "Online",
    };
  }, [data, sourceUrl]);

  return (
    <div className={cn("space-y-4 font-sans text-[#2D3A31]", className)}>
      {/* Optional Pre-Markdown note */}
      {preMarkdown && (
        <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl text-xs text-[#2D3A31]">
          <MarkdownRenderer content={preMarkdown} />
        </div>
      )}

      {/* Main Interactive JSON Frame */}
      <div className="bg-[#FFFFFF] border-2 border-[#8C9A84]/30 rounded-[28px] overflow-hidden shadow-sm">
        {/* Top Control Header */}
        <div className="p-4 sm:p-5 bg-[#F9F8F4] border-b border-[#E6E2DA] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2D3A31] text-[#FFFFFF] rounded-xl shadow-sm">
              <FileJson className="w-4 h-4 text-[#8C9A84]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#2D3A31]">
                  {title || "Interactive Structured JSON Explorer"}
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] rounded-full">
                  INTERACTIVE FORMAT
                </span>
              </div>
              <span className="text-[11px] text-[#8C9A84] block font-mono">
                {typeof data === "object" && data !== null
                  ? Array.isArray(data)
                    ? `${data.length} Array Records Parsed`
                    : `${Object.keys(data).length} Root Attribute Nodes`
                  : "Structured Payload"}
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <div className="flex items-center bg-[#FFFFFF] p-1 rounded-xl border border-[#E6E2DA] text-xs font-semibold shadow-sm">
              {[
                { id: "VISUAL_CARDS", label: "Visual Cards", icon: Sparkles },
                { id: "TREE", label: "Tree Inspector", icon: Layers },
                { id: "TABLE", label: "Table Grid", icon: TableIcon },
                { id: "RAW", label: "Raw JSON", icon: Code2 },
              ].map((m) => {
                const Icon = m.icon;
                const isActive = viewMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id as typeof viewMode)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer",
                      isActive
                        ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                        : "text-[#2D3A31]/70 hover:text-[#2D3A31] hover:bg-[#F2F0EB]"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions: Copy & Download */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1.5 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs font-medium text-[#2D3A31] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                title="Copy full JSON"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[11px] font-bold text-[#10B981]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8C9A84]" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadJson}
                className="p-1.5 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-[#2D3A31] shadow-sm transition-all cursor-pointer"
                title="Download .json file"
              >
                <Download className="w-3.5 h-3.5 text-[#8C9A84]" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Search & Filter Bar */}
        <div className="px-5 py-3 bg-[#FFFFFF] border-b border-[#E6E2DA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9A84]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys or values in JSON..."
              className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8C9A84]">
            <button
              onClick={expandAll}
              className="hover:text-[#2D3A31] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Expand All</span>
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="hover:text-[#2D3A31] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>

        {/* Top Metadata Highlights Banner (If Available) */}
        {metadataHighlights && (
          <div className="px-5 py-3 bg-[#F4F9F4] border-b border-[#10B981]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {metadataHighlights.sourceUrl && (
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#8C9A84] uppercase block">Target Source</span>
                <a
                  href={metadataHighlights.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#2D3A31] hover:text-[#10B981] font-bold flex items-center gap-1 truncate"
                >
                  <ExternalLink className="w-3 h-3 text-[#10B981] shrink-0" />
                  <span className="truncate">{metadataHighlights.sourceUrl}</span>
                </a>
              </div>
            )}
            {metadataHighlights.confidence && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#8C9A84] uppercase block">Extraction Confidence</span>
                <span className="font-mono text-[11px] font-bold text-[#10B981]">
                  {metadataHighlights.confidence}
                </span>
              </div>
            )}
            {metadataHighlights.recordsParsed !== null && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#8C9A84] uppercase block">Records Parsed</span>
                <span className="font-mono text-[11px] font-bold text-[#2D3A31]">
                  {metadataHighlights.recordsParsed} Record(s)
                </span>
              </div>
            )}
            {metadataHighlights.status && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#8C9A84] uppercase block">Operational Status</span>
                <span className="font-mono text-[11px] font-bold text-[#10B981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>{metadataHighlights.status}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* View Mode 1: Visual Interactive Cards (Default) */}
        {viewMode === "VISUAL_CARDS" && (
          <div className="p-5 sm:p-6 space-y-5 bg-[#FFFFFF]">
            {typeof data === "object" && data !== null ? (
              Object.entries(data).map(([sectionKey, sectionVal]) => {
                const isExpanded = isSectionExpanded(sectionKey);
                const isErrorOrNote =
                  sectionKey.toLowerCase().includes("placeholder") ||
                  sectionKey.toLowerCase().includes("error") ||
                  sectionKey.toLowerCase().includes("failed");

                // Filter check
                if (searchQuery) {
                  const stringified = JSON.stringify({ [sectionKey]: sectionVal }).toLowerCase();
                  if (!stringified.includes(searchQuery.toLowerCase())) return null;
                }

                return (
                  <div
                    key={sectionKey}
                    className={cn(
                      "rounded-2xl border transition-all overflow-hidden shadow-sm",
                      isErrorOrNote
                        ? "bg-[#FFF9F6] border-[#C27B66]/40"
                        : "bg-[#F9F8F4] border-[#E6E2DA]"
                    )}
                  >
                    {/* Card Header */}
                    <div
                      onClick={() => toggleSection(sectionKey)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-[#FFFFFF]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#8C9A84]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#8C9A84]" />
                        )}
                        <span className="font-serif font-bold text-sm text-[#2D3A31] capitalize">
                          {sectionKey.replace(/_/g, " ")}
                        </span>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full text-[#8C9A84]">
                          {Array.isArray(sectionVal)
                            ? `${sectionVal.length} item(s)`
                            : typeof sectionVal === "object" && sectionVal !== null
                            ? `${Object.keys(sectionVal).length} fields`
                            : typeof sectionVal}
                        </span>
                      </div>

                      {isErrorOrNote && (
                        <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 bg-[#C27B66]/15 text-[#C27B66] rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Diagnostic Notice</span>
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#E6E2DA]/60 space-y-3 bg-[#FFFFFF]">
                        <RenderInteractiveNode
                          data={sectionVal}
                          path={sectionKey}
                          searchQuery={searchQuery}
                          onCopyValue={handleCopyValue}
                          copiedPath={copiedPath}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 font-mono text-xs text-[#2D3A31]">{String(data)}</div>
            )}
          </div>
        )}

        {/* View Mode 2: Interactive Tree Explorer */}
        {viewMode === "TREE" && (
          <div className="p-5 font-mono text-xs space-y-1 max-h-[600px] overflow-y-auto bg-[#FFFFFF]">
            <RenderJsonTree
              data={data}
              path="root"
              searchQuery={searchQuery}
              onCopyValue={handleCopyValue}
              copiedPath={copiedPath}
            />
          </div>
        )}

        {/* View Mode 3: Table Grid View */}
        {viewMode === "TABLE" && (
          <div className="p-5 space-y-6 bg-[#FFFFFF]">
            {tabularCollections.length > 0 ? (
              tabularCollections.map((col, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-2">
                    <span className="font-serif font-bold text-sm text-[#2D3A31] capitalize">
                      {col.key.replace(/_/g, " ")} ({col.items.length} Rows)
                    </span>
                    <span className="font-mono text-[10px] text-[#8C9A84]">Table Format</span>
                  </div>
                  <div className="overflow-x-auto border border-[#E6E2DA] rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F9F8F4] text-[11px] font-bold text-[#8C9A84] uppercase border-b border-[#E6E2DA]">
                        <tr>
                          <th className="p-2.5 font-mono">#</th>
                          {getDistinctKeys(col.items).map((k) => (
                            <th key={k} className="p-2.5 capitalize whitespace-nowrap">
                              {k.replace(/_/g, " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E2DA] font-sans">
                        {col.items.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#F9F8F4]/60 transition-colors">
                            <td className="p-2.5 font-mono text-[10px] text-[#8C9A84]">{rIdx + 1}</td>
                            {getDistinctKeys(col.items).map((k) => {
                              const cellVal = typeof row === "object" && row !== null ? row[k] : row;
                              return (
                                <td key={k} className="p-2.5 text-xs text-[#2D3A31]">
                                  {typeof cellVal === "object" && cellVal !== null ? (
                                    <pre className="text-[10px] font-mono bg-[#F2F0EB] p-1 rounded max-w-xs truncate">
                                      {JSON.stringify(cellVal)}
                                    </pre>
                                  ) : typeof cellVal === "string" && cellVal.startsWith("http") ? (
                                    <a
                                      href={cellVal}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#10B981] font-bold hover:underline flex items-center gap-1"
                                    >
                                      <span className="truncate max-w-[200px]">{cellVal}</span>
                                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                    </a>
                                  ) : (
                                    <span>{String(cellVal ?? "-")}</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#2D3A31]/60">
                No list/array collections found in this JSON. Switch to <strong>Visual Cards</strong> or <strong>Tree Inspector</strong>.
              </div>
            )}
          </div>
        )}

        {/* View Mode 4: Formatted Raw JSON */}
        {viewMode === "RAW" && (
          <div className="relative">
            <pre className="p-5 bg-[#2D3A31] text-[#E6E2DA] font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Optional Post-Markdown Commentary / Notes (e.g. Hacker News explanation) */}
      {postMarkdown && (
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl shadow-sm space-y-2 text-xs text-[#2D3A31]">
          <div className="flex items-center gap-1.5 font-bold text-[#8C9A84] border-b border-[#E6E2DA] pb-2 text-[11px] uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Agent Analysis & Notes</span>
          </div>
          <MarkdownRenderer content={postMarkdown} />
        </div>
      )}
    </div>
  );
};

// Helper: Extract distinct table keys
const getDistinctKeys = (items: any[]): string[] => {
  const keys = new Set<string>();
  items.forEach((item) => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach((k) => keys.add(k));
    } else {
      keys.add("Value");
    }
  });
  return Array.from(keys);
};

// Helper: Render Interactive Node for Visual Cards
const RenderInteractiveNode: React.FC<{
  data: any;
  path: string;
  searchQuery: string;
  onCopyValue: (val: string, path: string) => void;
  copiedPath: string | null;
}> = ({ data, path, searchQuery, onCopyValue, copiedPath }) => {
  if (data === null || data === undefined) {
    return <span className="text-gray-400 font-mono italic">null</span>;
  }

  // Primitive strings, numbers, booleans
  if (typeof data !== "object") {
    const strVal = String(data);
    const isUrl = typeof data === "string" && data.startsWith("http");

    return (
      <div className="flex items-center justify-between p-2 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl text-xs gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {isUrl ? (
            <a
              href={data}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#10B981] font-mono hover:underline font-bold flex items-center gap-1 truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{data}</span>
            </a>
          ) : (
            <span className="font-sans text-[#2D3A31] break-words">{strVal}</span>
          )}
        </div>
        <button
          onClick={() => onCopyValue(strVal, path)}
          className="p-1 text-[#8C9A84] hover:text-[#2D3A31] transition-colors shrink-0 cursor-pointer"
          title="Copy value"
        >
          {copiedPath === path ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    );
  }

  // Array of items
  if (Array.isArray(data)) {
    // Array of simple strings (e.g. key_features: ["A", "B", "C"])
    const isAllPrimitives = data.every((item) => typeof item !== "object" || item === null);

    if (isAllPrimitives) {
      return (
        <div className="flex flex-wrap gap-2 pt-1">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-1 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl text-xs font-medium text-[#2D3A31] shadow-sm flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C9A84]" />
              <span>{String(item)}</span>
            </div>
          ))}
        </div>
      );
    }

    // Array of complex objects (e.g. extracted_entities, navigation)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-1.5">
              <span className="font-mono text-[10px] font-bold text-[#8C9A84] uppercase">
                {item.type || item.label || item.topic || item.name || `Item ${idx + 1}`}
              </span>
              {item.type && (
                <span className="font-mono text-[9px] px-2 py-0.5 bg-[#8C9A84]/15 text-[#8C9A84] rounded-full">
                  {item.type}
                </span>
              )}
            </div>
            <RenderInteractiveNode
              data={item.value !== undefined ? item.value : item}
              path={`${path}[${idx}]`}
              searchQuery={searchQuery}
              onCopyValue={onCopyValue}
              copiedPath={copiedPath}
            />
          </div>
        ))}
      </div>
    );
  }

  // Standard Key-Value Object
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
      {Object.entries(data).map(([k, v]) => {
        const subPath = `${path}.${k}`;
        const isComplex = typeof v === "object" && v !== null;

        return (
          <div
            key={k}
            className={cn(
              "p-3 rounded-xl border space-y-1",
              isComplex ? "col-span-1 sm:col-span-2 bg-[#F9F8F4] border-[#E6E2DA]" : "bg-[#FFFFFF] border-[#E6E2DA]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase tracking-wider capitalize">
                {k.replace(/_/g, " ")}
              </span>
              <span className="font-mono text-[9px] text-[#8C9A84]">
                {Array.isArray(v) ? `Array [${v.length}]` : typeof v}
              </span>
            </div>
            <RenderInteractiveNode
              data={v}
              path={subPath}
              searchQuery={searchQuery}
              onCopyValue={onCopyValue}
              copiedPath={copiedPath}
            />
          </div>
        );
      })}
    </div>
  );
};

// Helper: Render Collapsible JSON Tree Node
const RenderJsonTree: React.FC<{
  data: any;
  path: string;
  searchQuery: string;
  onCopyValue: (val: string, path: string) => void;
  copiedPath: string | null;
}> = ({ data, path, searchQuery, onCopyValue, copiedPath }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (data === null || data === undefined) {
    return <span className="text-gray-400">null</span>;
  }

  if (typeof data !== "object") {
    const isString = typeof data === "string";
    const isNumber = typeof data === "number";
    const isBool = typeof data === "boolean";

    return (
      <span className="inline-flex items-center gap-1 group">
        <span
          className={cn(
            isString && "text-[#10B981]",
            isNumber && "text-[#3B82F6]",
            isBool && "text-[#8B5CF6]"
          )}
        >
          {isString ? `"${data}"` : String(data)}
        </span>
        <button
          onClick={() => onCopyValue(String(data), path)}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-black transition-opacity cursor-pointer"
        >
          {copiedPath === path ? <Check className="w-2.5 h-2.5 text-[#10B981]" /> : <Copy className="w-2.5 h-2.5" />}
        </button>
      </span>
    );
  }

  const isArray = Array.isArray(data);
  const keys = Object.keys(data);

  return (
    <div className="pl-3 border-l border-[#E6E2DA] my-0.5">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100/50 py-0.5 rounded px-1 -ml-1 text-[11px]"
      >
        {isOpen ? <ChevronDown className="w-3 h-3 text-[#8C9A84]" /> : <ChevronRight className="w-3 h-3 text-[#8C9A84]" />}
        <span className="font-bold text-[#2D3A31]">{isArray ? `Array [${data.length}]` : `{${keys.length} keys}`}</span>
      </div>

      {isOpen && (
        <div className="space-y-0.5 pt-0.5">
          {keys.map((k) => (
            <div key={k} className="flex items-start gap-1 py-0.5">
              <span className="text-[#C27B66] font-semibold">{isArray ? `[${k}]` : `"${k}":`}</span>
              <RenderJsonTree
                data={data[k]}
                path={`${path}.${k}`}
                searchQuery={searchQuery}
                onCopyValue={onCopyValue}
                copiedPath={copiedPath}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
