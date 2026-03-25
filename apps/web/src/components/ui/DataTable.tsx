import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type Column<T> = {
  header: string;
  accessor: keyof T & string;
  render?: (row: T) => ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
};

export function DataTable<T>({ columns, data, onRowClick, emptyMessage = "Sin registros." }: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest px-6 py-12 text-center">
        <p className="text-sm text-on-surface-variant">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-surface-container-high">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 font-headline text-xs font-bold uppercase tracking-tight text-on-surface"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "transition-colors",
                idx % 2 === 0 ? "bg-surface" : "bg-surface-container-low",
                onRowClick && "cursor-pointer hover:bg-surface-container",
              )}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3">
                  {col.render ? col.render(row) : String(row[col.accessor] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
