import { Navigate, Route, Routes } from "react-router-dom";

import { ShellLayout } from "@/components/layout/ShellLayout";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { ClienteHomePage } from "@/pages/ClienteHomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AreaGuard } from "@/routes/AreaGuard";

import { CatalogPage } from "@/features/catalog/CatalogPage";
import { ImportPage } from "@/features/catalog/ImportPage";
import { ClientsPage } from "@/features/clients/ClientsPage";
import { CreditPage } from "@/features/credit/CreditPage";
import { TicketsPage } from "@/features/tickets/TicketsPage";
import { ShipmentsPage } from "@/features/shipments/ShipmentsPage";
import { DirectSalePage } from "@/features/shipments/DirectSalePage";
import { KardexPage } from "@/features/reports/KardexPage";
import { BillingPage } from "@/features/billing/BillingPage";
import { InvoicesPage } from "@/features/ar/InvoicesPage";
import { PaymentsPage } from "@/features/ar/PaymentsPage";
import { UsersPage } from "@/features/admin/UsersPage";
import { AuditLogPage } from "@/features/admin/AuditLogPage";
import { SettingsPage } from "@/features/admin/SettingsPage";
import { PasswordResetPage } from "@/features/auth/PasswordResetPage";

function IndexRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "cliente") return <Navigate to="/cliente" replace />;
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/reset" element={<PasswordResetPage />} />
      <Route path="/" element={<IndexRedirect />} />

      {/* Portal cliente */}
      <Route
        path="/cliente"
        element={
          <AreaGuard area="cliente">
            <ShellLayout />
          </AreaGuard>
        }
      >
        <Route index element={<ClienteHomePage />} />
        <Route path="solicitudes" element={<TicketsPage />} />
        <Route path="movimientos" element={<ShipmentsPage />} />
      </Route>

      {/* Shell administrativo */}
      <Route
        path="/admin"
        element={
          <AreaGuard area="admin">
            <ShellLayout />
          </AreaGuard>
        }
      >
        <Route index element={<AdminDashboardPage />} />

        {/* Catálogo */}
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/import" element={<ImportPage />} />

        {/* Clientes & Crédito */}
        <Route path="clients" element={<ClientsPage />} />
        <Route path="credit" element={<CreditPage />} />

        {/* Tickets */}
        <Route path="tickets" element={<TicketsPage />} />

        {/* Remisiones */}
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="shipments/direct-sales" element={<DirectSalePage />} />

        {/* Reportes */}
        <Route path="reports/kardex" element={<KardexPage />} />

        {/* Facturación */}
        <Route path="billing" element={<BillingPage />} />

        {/* Cartera (Finanzas) */}
        <Route path="finance/invoices" element={<InvoicesPage />} />
        <Route path="finance/payments" element={<PaymentsPage />} />

        {/* Administración */}
        <Route path="users" element={<UsersPage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
