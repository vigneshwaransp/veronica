import React from "react";
import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  confidence: number; // 0 to 100
  label?: string;
  uncertaintyLevel?: "LOW" | "MEDIUM" | "HIGH";
  showBreakdown?: boolean;
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  label = "Calibrated Confidence",
  uncertaintyLevel = "LOW",
  showBreakdown = false,
  className,
}) => {
  const getLevelColor = () => {
    if (confidence >= 80) return "bg-[#8C9A84] text-[#8C9A84]";
    if (confidence >= 50) return "bg-[#DCCFC2] text-[#2D3A31]";
    return "bg-[#C27B66] text-[#C27B66]";
  };

  return (
    <div className={cn("space-y-3 font-sans text-[#2D3A31]", className)}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
            {label}
          </span>
          <span className="text-2xl font-serif font-bold text-[#2D3A31]">
            {confidence}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#2D3A31]/60 uppercase block">
            Uncertainty
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F2F0EB] border border-[#E6E2DA]">
            {uncertaintyLevel}
          </span>
        </div>
      </div>

      {/* Pill Progress Bar */}
      <div className="w-full h-2.5 bg-[#F2F0EB] rounded-full overflow-hidden border border-[#E6E2DA]">
        <div
          className="h-full bg-[#8C9A84] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
        />
      </div>

      {showBreakdown && (
        <div className="pt-2 text-xs text-[#2D3A31]/70 flex justify-between">
          <span>Prior Alignment: 92%</span>
          <span>Sample Calibration: High</span>
        </div>
      )}
    </div>
  );
};
