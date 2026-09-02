"use client";

import React, { useState } from "react";
import { UserProfile, AuditEvent, MemoryNode } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { MemoryEngine } from "@/lib/memory-engine";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Download,
  Trash2,
  Play,
  Pause,
  AlertTriangle,
  FileJson,
  CheckCircle,
  Eye,
  Leaf
} from "lucide-react";

interface TrustViewProps {
  user: UserProfile;
  auditEvents: AuditEvent[];
  memories: MemoryNode[];
}

export const TrustView: React.FC<TrustViewProps> = ({
  user,
  auditEvents,
  memories,
}) => {
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleExportData = () => {
    const data = MemoryEngine.exportMemoryArchive(memories);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veronica-digital-self-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetModel = () => {
    veronicaStore.resetModel();
    setIsResetConfirmOpen(false);
  };

  const filteredEvents = auditEvents.filter((evt) => {
    if (filterRole === "ALL") return true;
    return evt.agentRole === filterRole;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Trust & <span className="italic text-[#8C9A84]">Sovereignty</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Data ownership, continuous audit logs, and complete model explainability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="botanical-btn-secondary py-2 px-4 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Export Archive (JSON)</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#C27B66] hover:text-[#FFFFFF] text-[#C27B66] border border-[#E6E2DA] hover:border-[#C27B66] text-xs font-semibold rounded-full transition-all shadow-sm flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Learned Weights</span>
          </button>
        </div>
      </div>

      {/* 3 Trust Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#8C9A84]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#2D3A31]">
            Provenance & Attribution
          </h3>
          <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
            Every predicted decision and simulated statement links directly to specific memory traces and user feedback.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] flex items-center justify-center">
            <Eye className="w-5 h-5 text-[#8C9A84]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#2D3A31]">
            Right to Forget
          </h3>
          <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
            Delete individual memories, reset behavioral priors, or purge specific interaction clusters at any time.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] flex items-center justify-center">
            <FileJson className="w-5 h-5 text-[#8C9A84]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#2D3A31]">
            Sovereign Data Export
          </h3>
          <p className="text-xs text-[#2D3A31]/70 leading-relaxed">
            Export all cognitive models, memories, and decision history into portable JSON formats. Zero vendor lock-in.
          </p>
        </div>
      </div>

      {/* Audit Log Table Card */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-3">
          <div>
            <span className="text-xs font-semibold text-[#8C9A84] uppercase">
              Immutable Provenance
            </span>
            <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
              System Audit Stream
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2D3A31]/70">Filter:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#F9F8F4] border border-[#E6E2DA] rounded-full px-3 py-1 text-xs text-[#2D3A31] focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="ORCHESTRATOR">Orchestrator</option>
              <option value="SAFETY AGENT">Safety Agent</option>
              <option value="MEMORY AGENT">Memory Agent</option>
              <option value="SIMULATION AGENT">Simulation Agent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6E2DA] text-[#8C9A84] font-semibold">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Agent</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Impact</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F0EB]">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#F9F8F4] transition-colors">
                  <td className="py-3 text-[#2D3A31]/60 whitespace-nowrap">
                    {new Date(evt.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 font-semibold text-[#2D3A31] whitespace-nowrap">
                    {evt.agentName}
                  </td>
                  <td className="py-3 text-[#2D3A31]">{evt.action}</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        evt.impactLevel === "CRITICAL"
                          ? "bg-[#C27B66] text-[#FFFFFF]"
                          : evt.impactLevel === "MEDIUM"
                          ? "bg-[#DCCFC2] text-[#2D3A31]"
                          : "bg-[#F2F0EB] text-[#8C9A84]"
                      )}
                    >
                      {evt.impactLevel}
                    </span>
                  </td>
                  <td className="py-3 text-[#8C9A84] font-semibold">{evt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-[#2D3A31]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="w-12 h-12 bg-[#C27B66]/15 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#C27B66]" />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                Reset Learned Representation?
              </h3>
              <p className="text-xs text-[#2D3A31]/70 mt-2 leading-relaxed">
                This will reset your model weights, confidence priors, and decision feedback loops back to default factory baseline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 botanical-btn-secondary py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetModel}
                className="flex-1 py-2.5 bg-[#C27B66] hover:bg-[#2D3A31] text-[#FFFFFF] text-xs font-semibold rounded-full transition-all shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
