import { createContext } from "react";

import type { Role } from "@/types/role";

export type AuthUser = {
  email: string;
  role: Role;
};

export type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, _password: string, role: Role) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
