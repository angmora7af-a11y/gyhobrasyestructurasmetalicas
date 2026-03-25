import { Badge } from "@/components/ui/Badge";
import type { ComponentProps } from "react";

type Props = {
  label: string;
  value: string | number;
  tone?: ComponentProps<typeof Badge>["tone"];
  toneLabel?: string;
};

export function KpiCard({ label, value, tone, toneLabel }: Props) {
  return (
    <div className="border-t-4 border-primary bg-surface-container-lowest p-6 shadow-ambient">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
      <p className="mt-2 font-headline text-3xl font-black text-on-surface">{value}</p>
      {tone && toneLabel ? (
        <div className="mt-3">
          <Badge tone={tone}>{toneLabel}</Badge>
        </div>
      ) : null}
    </div>
  );
}
