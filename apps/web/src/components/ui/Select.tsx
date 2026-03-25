import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Option = {
  value: string;
  label: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Option[];
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, options, className, id, ...props },
  ref,
) {
  const selectId = id ?? props.name;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
        >
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "w-full border-0 border-b-2 border-transparent bg-surface-variant px-3 py-2 text-sm transition-colors",
          "focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-0",
          error && "border-error",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
});
