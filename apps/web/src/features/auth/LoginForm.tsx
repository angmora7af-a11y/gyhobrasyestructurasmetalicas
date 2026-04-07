import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/features/auth/loginSchema";
import { emailForUiRole } from "@/lib/seedTestUsers";
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
    email: emailForUiRole("admin"),
    password: "",
    role: "admin",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
    setSubmitting(true);
    try {
      const result = await login(parsed.data.email, parsed.data.password);
      if (!result.ok) {
        setSubmitError(result.message);
        return;
      }
      const home = result.role === "cliente" ? "/cliente" : "/admin";
      navigate(home, { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="glass-card mx-auto w-full max-w-md space-y-6 rounded-xl p-8 shadow-ambient">
      <div>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-on-surface">Acceso</h2>
        <p className="mt-1 text-sm font-medium text-on-surface-variant">
          Credenciales contra la API. El perfil efectivo lo define el servidor según los roles del usuario.
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
          Perfil de prueba (rellena correo seed)
        </label>
        <select
          id="role"
          name="role"
          className="w-full border-0 border-b-2 border-transparent bg-surface-variant px-3 py-2 text-sm focus:border-primary focus:bg-surface-container-lowest focus:outline-none"
          value={values.role}
          onChange={(e) => {
            const role = e.target.value as LoginFormValues["role"];
            setValues((v) => ({
              ...v,
              role,
              email: emailForUiRole(role),
            }));
          }}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
      </div>
      {submitError ? <p className="text-sm text-error">{submitError}</p> : null}
      <Button type="submit" className="w-full justify-center" disabled={submitting}>
        {submitting ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
