import React from "react";
import { cn } from "@/lib/utils";

interface KineticMarqueeProps {
  items: string[];
  speed?: "fast" | "slow";
  reverse?: boolean;
  accentSeparator?: boolean;
  className?: string;
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  items,
  speed = "fast",
  reverse = false,
  accentSeparator = true,
  className,
}) => {
  const content = items.join(" • ") + " • ";
  const animationClass = reverse
    ? "animate-marquee-reverse"
    : speed === "slow"
    ? "animate-marquee-slow"
    : "animate-marquee-fast";

  return (
    <div className={cn("overflow-hidden whitespace-nowrap border-y border-[#3F3F46] bg-[#09090B] py-2.5", className)}>
      <div className={cn("inline-flex select-none font-mono uppercase text-xs md:text-sm font-bold tracking-widest", animationClass)}>
        <span className="text-[#FAFAFA] flex items-center gap-3">
          {items.map((item, idx) => (
            <React.Fragment key={`m1-${idx}`}>
              <span>{item}</span>
              {accentSeparator && <span className="text-[#DFE104] font-black">✦</span>}
            </React.Fragment>
          ))}
        </span>
        <span className="text-[#FAFAFA] flex items-center gap-3 ml-3">
          {items.map((item, idx) => (
            <React.Fragment key={`m2-${idx}`}>
              <span>{item}</span>
              {accentSeparator && <span className="text-[#DFE104] font-black">✦</span>}
            </React.Fragment>
          ))}
        </span>
      </div>
    </div>
  );
};
