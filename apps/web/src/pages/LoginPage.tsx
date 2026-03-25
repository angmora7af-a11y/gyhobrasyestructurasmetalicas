import { LoginForm } from "@/features/auth/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-low px-4 py-16">
      <div className="mb-10 text-center">
        <p className="font-headline text-sm font-bold uppercase tracking-[0.3em] text-primary">G&amp;H Obras</p>
        <h1 className="mt-2 font-headline text-4xl font-black uppercase tracking-tighter text-on-surface">Industrial Ledger</h1>
        <p className="mt-2 max-w-lg text-on-surface-variant">
          Plataforma alineada a <code className="text-xs">pdr/PDR-05</code> y diseño <code className="text-xs">gyhdesign/industrial_grid</code>.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
