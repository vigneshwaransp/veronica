"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeLang = "";

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
        return (
          <em key={index} className="italic text-[#C27B66]">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="px-2 py-0.5 bg-[#F2F0EB]/80 text-[#2D3A31] font-mono text-[11px] rounded-md border border-[#E6E2DA]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${idx}`} className="my-3 p-4 bg-[#F2F0EB] border border-[#E6E2DA] rounded-2xl font-mono text-xs overflow-x-auto text-[#2D3A31]">
            {codeLang && <div className="text-[10px] text-[#8C9A84] font-bold uppercase mb-1">{codeLang}</div>}
            <pre className="whitespace-pre">{codeBlockContent.join("\n")}</pre>
          </div>
        );
        codeBlockContent = [];
        inCodeBlock = false;
        codeLang = "";
      } else {
        inCodeBlock = true;
        codeLang = trimmed.replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={idx} className="text-sm font-serif font-bold mt-3 mb-1">
          {renderInline(trimmed.replace("### ", ""))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={idx} className="text-base font-serif font-bold mt-3.5 mb-1.5">
          {renderInline(trimmed.replace("## ", ""))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={idx} className="text-lg font-serif font-bold mt-4 mb-2">
          {renderInline(trimmed.replace("# ", ""))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const itemText = trimmed.replace(/^[-*•]\s+/, "");
      elements.push(
        <li key={idx} className="ml-4 list-disc text-xs sm:text-sm leading-relaxed my-0.5">
          {renderInline(itemText)}
        </li>
      );
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, "");
      elements.push(
        <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm leading-relaxed my-0.5">
          {renderInline(itemText)}
        </li>
      );
      return;
    }

    if (!trimmed) {
      elements.push(<div key={idx} className="h-1.5" />);
      return;
    }

    elements.push(
      <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  });

  return <div className={cn("space-y-1 font-sans", className)}>{elements}</div>;
};
