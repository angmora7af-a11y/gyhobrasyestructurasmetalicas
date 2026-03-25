import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import type { NavItem } from "@/navigation/navConfig";

type Props = {
  children: ReactNode;
  sidebarItems: NavItem[];
  topBarTitle?: string;
};

export function AppShell({ children, sidebarItems, topBarTitle }: Props) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar items={sidebarItems} />
      <main className="ml-64 min-h-screen">
        <TopBar title={topBarTitle} />
        <div className="industrial-scroll space-y-8 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
