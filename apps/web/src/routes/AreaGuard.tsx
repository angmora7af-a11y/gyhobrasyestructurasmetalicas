import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

type Area = "admin" | "cliente";

type Props = {
  area: Area;
  children: ReactNode;
};

/**
 * Separa portal cliente vs shell administrativo según rol (HU-003, sitemap PDR).
 */
export function AreaGuard({ area, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (area === "admin" && user.role === "cliente") {
    return <Navigate to="/cliente" replace />;
  }

  if (area === "cliente" && user.role !== "cliente") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
