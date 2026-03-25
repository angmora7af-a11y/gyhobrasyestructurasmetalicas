import { cn } from "@/lib/cn";

type Props = {
  name: string;
  className?: string;
};

export function MaterialIcon({ name, className }: Props) {
  return (
    <span className={cn("material-symbols-outlined align-middle", className)} aria-hidden>
      {name}
    </span>
  );
}
