"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AudioSoundwaveProps {
  isActive?: boolean;
  barsCount?: number;
  color?: string;
  className?: string;
}

export const AudioSoundwave: React.FC<AudioSoundwaveProps> = ({
  isActive = false,
  barsCount = 10,
  color = "#8C9A84",
  className,
}) => {
  const bars = Array.from({ length: barsCount });

  return (
    <div
      className={cn(
        "flex items-center gap-[3px] h-6 px-2.5 py-1 bg-[#F2F0EB] rounded-full border border-[#E6E2DA]",
        className
      )}
    >
      {bars.map((_, i) => {
        const animDuration = `${0.4 + (i % 5) * 0.15}s`;
        const animDelay = `${(i * 0.08).toFixed(2)}s`;
        const staticHeight = `${20 + ((i * 13) % 60)}%`;

        return (
          <div
            key={i}
            className="w-[2.5px] rounded-full transition-all duration-300"
            style={{
              backgroundColor: color,
              height: isActive ? "100%" : staticHeight,
              animation: isActive
                ? `soundwavePulse ${animDuration} ease-in-out ${animDelay} infinite alternate`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
};
