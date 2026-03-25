import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-headline text-4xl font-black text-on-surface">404</h1>
      <p className="text-on-surface-variant">Ruta no definida en el router MVP.</p>
      <Link to="/login">
        <Button type="button" variant="secondary">
          Volver al login
        </Button>
      </Link>
    </div>
  );
}
