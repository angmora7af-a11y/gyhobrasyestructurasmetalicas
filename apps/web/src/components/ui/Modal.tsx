import { useEffect, type ReactNode } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

type Props = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card relative z-10 w-full max-w-xl rounded-xl bg-white/85 p-8 shadow-ambient backdrop-blur-[20px]">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-on-surface">{title}</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant transition-colors hover:text-primary">
            <MaterialIcon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
