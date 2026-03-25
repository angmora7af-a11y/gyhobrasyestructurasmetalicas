import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const requestSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
});

const confirmSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm: z.string().min(1, "Confirme contraseña"),
}).refine((d) => d.password === d.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"],
});

type RequestValues = z.infer<typeof requestSchema>;
type ConfirmValues = z.infer<typeof confirmSchema>;

export function PasswordResetPage() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [requestForm, setRequestForm] = useState<RequestValues>({ email: "" });
  const [confirmForm, setConfirmForm] = useState<ConfirmValues>({ token: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    const parsed = requestSchema.safeParse(requestForm);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/auth/password-reset/request", parsed.data);
      setMessage("Si el correo está registrado, recibirá instrucciones.");
      setStep("confirm");
    } catch (e) {
      setErrors({ email: e instanceof ApiError ? e.message : "Error de conexión" });
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault();
    const parsed = confirmSchema.safeParse(confirmForm);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/auth/password-reset/confirm", {
        token: parsed.data.token,
        password: parsed.data.password,
      });
      setMessage("Contraseña actualizada. Puede iniciar sesión.");
    } catch (e) {
      setErrors({ token: e instanceof ApiError ? e.message : "Error de conexión" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-low px-4 py-16">
      <div className="mb-10 text-center">
        <p className="font-headline text-sm font-bold uppercase tracking-[0.3em] text-primary">G&amp;H Obras</p>
        <h1 className="mt-2 font-headline text-4xl font-black uppercase tracking-tighter text-on-surface">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">HU-005 — Restablecimiento de credenciales.</p>
      </div>

      <div className="glass-card mx-auto w-full max-w-md space-y-6 rounded-xl p-8 shadow-ambient">
        {message && (
          <div className="bg-surface-container-lowest p-4 text-sm text-on-surface">
            <MaterialIcon name="check_circle" className="mr-1 text-sm text-tertiary" />
            {message}
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleRequest} className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              Ingrese su correo para recibir un enlace de recuperación.
            </p>
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={requestForm.email}
              onChange={(e) => setRequestForm({ email: e.target.value })}
              error={errors.email}
            />
            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Enviando…" : "Enviar enlace"}
            </Button>
          </form>
        )}

        {step === "confirm" && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              Ingrese el token recibido y su nueva contraseña.
            </p>
            <Input
              label="Token"
              name="token"
              value={confirmForm.token}
              onChange={(e) => setConfirmForm((f) => ({ ...f, token: e.target.value }))}
              error={errors.token}
            />
            <Input
              label="Nueva contraseña"
              name="password"
              type="password"
              value={confirmForm.password}
              onChange={(e) => setConfirmForm((f) => ({ ...f, password: e.target.value }))}
              error={errors.password}
            />
            <Input
              label="Confirmar contraseña"
              name="confirm"
              type="password"
              value={confirmForm.confirm}
              onChange={(e) => setConfirmForm((f) => ({ ...f, confirm: e.target.value }))}
              error={errors.confirm}
            />
            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Procesando…" : "Cambiar contraseña"}
            </Button>
          </form>
        )}

        <div className="flex justify-between text-sm">
          {step === "confirm" && (
            <button type="button" onClick={() => setStep("request")} className="text-primary hover:underline">
              Reenviar correo
            </button>
          )}
          <Link to="/login" className="text-primary hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
