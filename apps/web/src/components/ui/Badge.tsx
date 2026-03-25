import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "draft" | "pending" | "process" | "done";

const tones: Record<Tone, string> = {
  draft: "bg-secondary-container text-on-secondary-container",
  pending: "bg-transparent text-outline",
  process: "bg-primary-container text-on-primary",
  done: "bg-tertiary-fixed text-on-tertiary-fixed",
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

/** Hi-Vis según `gyhdesign/industrial_grid/DESIGN.md` §5 */
export function Badge({ children, tone = "draft", className }: Props) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", tones[tone], className)}>
      {children}
    </span>
  );
}
