import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-colors",
  secondary:
    "bg-surface-container-high text-on-surface px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-colors",
  ghost: "text-on-surface-variant hover:text-primary transition-colors",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className, variant = "primary", type = "button", ...props }: Props) {
  return <button type={type} className={cn("inline-flex items-center justify-center gap-2", variants[variant], className)} {...props} />;
}
