"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

type NavItem = {
  name: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
  comingSoon?: boolean;
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Resumes", href: "/resumes", icon: FileText },
  { name: "Mails", href: "/mails", icon: Mail },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "", icon: Settings, comingSoon: true },
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-white p-4 transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          collapsed={false}
          pathname={pathname}
          onNavigate={onCloseMobile}
          mobileMode
        />
      </aside>

      <aside
        className={`hidden h-full border-r bg-white p-4 transition-all duration-200 md:flex md:flex-col ${
          collapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <SidebarContent collapsed={collapsed} pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarContent({
  collapsed,
  pathname,
  onNavigate,
  mobileMode = false,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
  mobileMode?: boolean;
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link href="/dashboard" className="text-xl font-semibold" onClick={onNavigate}>
          {collapsed && !mobileMode ? "HF" : "HuntFlow"}
        </Link>
        {mobileMode ? (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <button
                key={item.name}
                type="button"
                disabled
                title={item.name}
                className={`w-full rounded-lg border border-dashed px-3 py-2 text-gray-400 ${
                  collapsed && !mobileMode
                    ? "flex items-center justify-center"
                    : "flex items-center justify-between gap-3"
                } cursor-not-allowed`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {collapsed && !mobileMode ? null : item.name}
                </span>
                {collapsed && !mobileMode ? null : (
                  <span className="text-[10px] uppercase tracking-wide">Coming soon</span>
                )}
              </button>
            );
          }

          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              title={item.name}
              className={`rounded-lg px-3 py-2 transition ${
                collapsed && !mobileMode
                  ? "flex items-center justify-center"
                  : "flex items-center gap-3"
              } ${
                active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {collapsed && !mobileMode ? null : item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}



