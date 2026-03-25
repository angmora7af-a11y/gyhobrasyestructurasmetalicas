import { useCallback, useMemo, useState, type ReactNode } from "react";

import { AuthContext, type AuthUser } from "@/contexts/auth-context";
import type { Role } from "@/types/role";
import { isRole } from "@/types/role";

const STORAGE_KEY = "gyh.auth.session";

function readStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") return null;
    const email = (data as { email?: string }).email;
    const role = (data as { role?: string }).role;
    if (typeof email !== "string" || typeof role !== "string" || !isRole(role)) return null;
    return { email, role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStored());

  const login = useCallback((email: string, _password: string, role: Role) => {
    const next: AuthUser = { email, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
