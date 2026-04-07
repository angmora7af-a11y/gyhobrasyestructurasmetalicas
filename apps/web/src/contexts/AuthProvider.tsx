import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { AuthContext, type AuthUser, type LoginResult } from "@/contexts/auth-context";
import { mapApiRolesToUiRole } from "@/lib/mapApiRoleToUi";
import { API_V1_BASE } from "@/lib/api";
import type { Role } from "@/types/role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const bootstrap = useCallback(async () => {
    try {
      const res = await fetch(`${API_V1_BASE}/auth/me`, { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as { email: string; roles: string[] };
      setUser({
        email: data.email,
        role: mapApiRolesToUiRole(data.roles),
      });
    } catch {
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const res = await fetch(`${API_V1_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let message = "Credenciales inválidas";
      try {
        const body = (await res.json()) as { detail?: string };
        if (typeof body.detail === "string") message = body.detail;
      } catch {
        /* ignore */
      }
      return { ok: false, message };
    }

    const me = await fetch(`${API_V1_BASE}/auth/me`, { credentials: "include" });
    if (!me.ok) {
      return { ok: false, message: "No se pudo cargar el perfil tras el ingreso." };
    }
    const data = (await me.json()) as { email: string; roles: string[] };
    const role: Role = mapApiRolesToUiRole(data.roles);
    setUser({
      email: data.email,
      role,
    });
    return { ok: true, role };
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_V1_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, authReady, login, logout }),
    [user, authReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
