"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCylinderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressCylinderProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const pct = Math.min(max, Math.max(0, value)) / max * 100;

    return (
      <div
        ref={ref}
        className={cn("progress-cylinder-container", className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        {...props}
      >
        <div className="progress-cylinder-inner">
          <div
            className="progress-cylinder-liquid"
            style={{ height: `${pct}%` }}
          />
        </div>
        <div className="progress-cylinder-label">
          {Math.floor(pct)}%
        </div>
      </div>
    );
  }
);
Progress.displayName = "ProgressCylinder";

export { Progress };
