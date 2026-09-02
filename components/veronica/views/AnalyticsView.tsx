"use client";

import React from "react";
import { UserProfile, DecisionSimulation, LearningReflection } from "@/types/veronica";
import { ConfidenceMeter } from "@/components/veronica/ui/ConfidenceMeter";
import {
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Leaf
} from "lucide-react";

interface AnalyticsViewProps {
  user: UserProfile;
  simulations: DecisionSimulation[];
  reflections: LearningReflection[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  user,
  simulations,
  reflections,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            Calibration & <span className="italic text-[#8C9A84]">Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Empirical accuracy curves, Bayesian uncertainty tracking, and continuous learning reflections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D3A31]/70">Evaluated Runs:</span>
          <span className="px-3 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-bold text-[#2D3A31]">
            {user.totalSimulationsCount} Simulations
          </span>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-[#8C9A84] uppercase block">
            Prediction Accuracy
          </span>
          <span className="text-3xl font-serif font-bold text-[#2D3A31]">{user.accuracyRate}%</span>
          <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">
            Alignment rate against direct user decisions across test scenarios.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-[#8C9A84] uppercase block">
            Model Confidence
          </span>
          <span className="text-3xl font-serif font-bold text-[#8C9A84]">{user.modelConfidence}%</span>
          <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">
            Calibrated probabilistic confidence interval with low drift.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-[#8C9A84] uppercase block">
            Indexed Memories
          </span>
          <span className="text-3xl font-serif font-bold text-[#2D3A31]">{user.totalMemoriesCount}</span>
          <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">
            Episodic, semantic, procedural, and preference nodes.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-6 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-[#8C9A84] uppercase block">
            Learning Reflections
          </span>
          <span className="text-3xl font-serif font-bold text-[#2D3A31]">{reflections.length}</span>
          <p className="text-xs text-[#2D3A31]/70 mt-1 leading-relaxed">
            Continuous Bayesian parameter adaptations.
          </p>
        </div>
      </div>

      {/* Calibration Progress Meter */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
          <span className="text-xs font-semibold text-[#8C9A84] uppercase">
            Confidence Calibration Curve
          </span>
          <span className="text-xs font-bold text-[#2D3A31]">Bayesian Prior Active</span>
        </div>

        <ConfidenceMeter
          confidence={user.modelConfidence}
          label="Estimated Alignment Probability"
          uncertaintyLevel="LOW"
          showBreakdown={true}
        />
      </div>

      {/* Reflections Log List */}
      <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
          <span className="text-xs font-semibold text-[#8C9A84] uppercase">
            Continuous Learning Reflections
          </span>
          <span className="text-xs text-[#2D3A31]/70">
            {reflections.length} reflections recorded
          </span>
        </div>

        <div className="space-y-3">
          {reflections.map((ref) => (
            <div
              key={ref.id}
              className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#2D3A31]">{ref.summary}</span>
                  <span className="text-[10px] text-[#8C9A84] px-2 py-0.5 bg-[#FFFFFF] rounded-full border border-[#E6E2DA] font-semibold">
                    {ref.detectedShift}
                  </span>
                </div>
                <p className="text-xs text-[#2D3A31]/80 mt-1">
                  Affected: {ref.affectedPreferences.join(", ")}
                </p>
              </div>

              <span className="text-xs font-bold text-[#8C9A84] px-2.5 py-1 bg-[#FFFFFF] rounded-full border border-[#E6E2DA] whitespace-nowrap">
                {ref.appliedWeightChange}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
