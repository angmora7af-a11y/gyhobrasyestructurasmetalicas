import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/features/auth/loginSchema";
import { ROLES } from "@/types/role";

const roleLabels: Record<LoginFormValues["role"], string> = {
  cliente: "Cliente",
  aportante_catalogo: "Aportante catálogo",
  admin: "Administrador",
  logistica: "Logística",
  facturacion: "Facturación",
  cartera: "Cartera",
  credito: "Crédito",
};

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    role: "admin",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && key in values) {
          fieldErrors[key as keyof LoginFormValues] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    login(parsed.data.email, parsed.data.password, parsed.data.role);
    const home = parsed.data.role === "cliente" ? "/cliente" : "/admin";
    navigate(home, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card mx-auto w-full max-w-md space-y-6 rounded-xl p-8 shadow-ambient">
      <div>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-on-surface">Acceso</h2>
        <p className="mt-1 text-sm font-medium text-on-surface-variant">
          Credenciales se validarán contra la API (HU-002). Modo actual: sesión local de demostración.
        </p>
      </div>
      <Input
        label="Correo o usuario"
        name="email"
        type="email"
        autoComplete="username"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        error={errors.email}
      />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        error={errors.password}
      />
      <div>
        <label htmlFor="role" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          Rol (demo / pruebas HU-003)
        </label>
        <select
          id="role"
          name="role"
          className="w-full border-0 border-b-2 border-transparent bg-surface-variant px-3 py-2 text-sm focus:border-primary focus:bg-surface-container-lowest focus:outline-none"
          value={values.role}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              role: e.target.value as LoginFormValues["role"],
            }))
          }
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
      </div>
      {submitError ? <p className="text-sm text-error">{submitError}</p> : null}
      <Button type="submit" className="w-full justify-center">
        Ingresar
      </Button>
    </form>
  );
}
