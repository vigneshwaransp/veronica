import React from "react";
import { cn } from "@/lib/utils";

interface BrutalistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  headerTitle?: string;
  badge?: string;
  badgeVariant?: "default" | "accent" | "danger" | "warning";
  accentBorder?: boolean;
  withCrosshair?: boolean;
  className?: string;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  headerTitle,
  badge,
  badgeVariant = "default",
  accentBorder = false,
  withCrosshair = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] shadow-[0_10px_25px_-3px_rgba(45,58,49,0.04)] hover:shadow-[0_18px_35px_-5px_rgba(45,58,49,0.08)] transition-all overflow-hidden text-[#2D3A31]",
        accentBorder && "border-[#8C9A84]",
        className
      )}
      {...props}
    >
      {(headerTitle || badge) && (
        <div className="flex items-center justify-between border-b border-[#E6E2DA] px-5 py-3.5 bg-[#F9F8F4]">
          {headerTitle && (
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#2D3A31] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#8C9A84] rounded-full inline-block" />
              {headerTitle}
            </span>
          )}
          {badge && (
            <span
              className={cn(
                "px-2.5 py-0.5 text-[11px] font-sans rounded-full font-semibold",
                badgeVariant === "accent" && "bg-[#8C9A84] text-[#FFFFFF]",
                badgeVariant === "default" && "bg-[#F2F0EB] text-[#2D3A31] border border-[#E6E2DA]",
                badgeVariant === "danger" && "bg-[#C27B66] text-[#FFFFFF]",
                badgeVariant === "warning" && "bg-[#DCCFC2] text-[#2D3A31]"
              )}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
};
