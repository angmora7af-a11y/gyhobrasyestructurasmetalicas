import { createContext } from "react";

import type { Role } from "@/types/role";

export type AuthUser = {
  email: string;
  role: Role;
};

export type LoginResult = { ok: true; role: Role } | { ok: false; message: string };

export type AuthContextValue = {
  user: AuthUser | null;
  /** false until the first /auth/me bootstrap finishes */
  authReady: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
