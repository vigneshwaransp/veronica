"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = "" }: MarkdownViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  let codeBlockCounter = 0;

  return (
    <div className={`prose prose-stone max-w-none text-xs leading-relaxed text-[#2D3A31] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-serif font-bold text-[#2D3A31] mt-4 mb-2 pb-1 border-b border-[#E6E2DA]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-serif font-bold text-[#2D3A31] mt-3 mb-1.5 pb-0.5 border-b border-[#E6E2DA]/60">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold font-sans text-[#2D3A31] mt-2.5 mb-1">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-[#8C9A84] mt-2 mb-1 uppercase tracking-wider font-mono">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="mb-2 leading-relaxed text-[#2D3A31]/90">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-xs text-[#2D3A31]/85">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-[#8C9A84] pl-3 py-1 my-2.5 bg-[#F2F0EB]/60 rounded-r-xl italic text-[#2D3A31]/80">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-[#E6E2DA] shadow-xs">
              <table className="min-w-full divide-y divide-[#E6E2DA] text-xs font-sans">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#F2F0EB] text-[#2D3A31] font-bold">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-[#E6E2DA] bg-[#FFFFFF]">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-[#F9F8F4] transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3 py-2 text-left font-bold font-mono text-[11px]">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-[11px] text-[#2D3A31]/85">{children}</td>,
          pre: ({ children }: any) => {
            return (
              <div className="relative group my-3 rounded-2xl overflow-hidden border border-[#2D3A31] bg-[#1B241E]">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0F1411] border-b border-[#2D3A31] text-[10px] font-mono text-[#8C9A84]">
                  <span>CODE SNIPPET</span>
                </div>
                <div className="p-3.5 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {children}
                </div>
              </div>
            );
          },
          code: ({ className, children, ...props }: any) => {
            const isMultiLine = String(children).includes("\n");
            const isLanguageBlock = /language-(\w+)/.test(className || "");

            // If it's a block inside <pre>, render code tag without <div> wrappers
            if (isMultiLine || isLanguageBlock) {
              return (
                <code className="font-mono text-xs text-emerald-400" {...props}>
                  {children}
                </code>
              );
            }

            // Inline code inside <p>, <li>, etc.
            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-[#F2F0EB] text-[#2D3A31] font-mono text-[11px] border border-[#E6E2DA]"
                {...props}
              >
                {children}
              </code>
            );
          },
          hr: () => <hr className="my-3 border-[#E6E2DA]" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C9A84] hover:text-[#2D3A31] underline font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
