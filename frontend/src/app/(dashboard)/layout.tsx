"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={desktopSidebarCollapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          isDesktopSidebarCollapsed={desktopSidebarCollapsed}
          onToggleDesktopSidebar={() =>
            setDesktopSidebarCollapsed((prev) => !prev)
          }
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
