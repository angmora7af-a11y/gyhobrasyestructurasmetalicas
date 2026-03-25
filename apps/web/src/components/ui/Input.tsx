import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, error, className, id, ...props }, ref) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full border-0 border-b-2 border-transparent bg-surface-variant px-3 py-2 text-sm transition-colors",
          "placeholder:text-on-surface-variant/60",
          "focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-0",
          error && "border-error",
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
});
