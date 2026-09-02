import React from "react";
import { cn } from "@/lib/utils";

interface NumberBadgeProps {
  number: string;
  label: string;
  sublabel?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({
  number,
  label,
  sublabel,
  active = false,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-4 border transition-all cursor-pointer select-none",
        active
          ? "bg-[#DFE104] text-black border-[#DFE104]"
          : "bg-[#0D0D11] text-[#FAFAFA] border-[#3F3F46] hover:border-[#DFE104] hover:bg-[#18181B]",
        className
      )}
    >
      <div className="flex items-baseline justify-between">
        <span
          className={cn(
            "giant-number font-black leading-none",
            active ? "text-black" : "text-[#DFE104] group-hover:text-white"
          )}
        >
          {number}
        </span>
        <span
          className={cn(
            "text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 border",
            active
              ? "border-black text-black font-bold"
              : "border-[#3F3F46] text-[#A1A1AA] group-hover:border-[#DFE104] group-hover:text-white"
          )}
        >
          SYS
        </span>
      </div>
      <div className="mt-3">
        <h4 className={cn("text-base md:text-lg font-black tracking-tight uppercase font-mono")}>
          {label}
        </h4>
        {sublabel && (
          <p
            className={cn(
              "text-xs font-mono mt-1 line-clamp-2",
              active ? "text-neutral-800" : "text-[#A1A1AA]"
            )}
          >
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};
