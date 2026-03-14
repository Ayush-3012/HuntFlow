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
  Orbit,
  Settings,
  Sparkles,
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
  icon: ComponentType<{ size?: number; className?: string }>;
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
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] md:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-indigo-200/35 bg-[linear-gradient(160deg,#1f2452_0%,#2f2f6a_42%,#3f3b86_72%,#5b4ca7_100%)] p-4 text-white shadow-[0_18px_48px_rgba(20,18,60,0.45)] transition-transform duration-200 md:hidden ${
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
        className={`relative hidden h-full border-r border-indigo-200/35 bg-[linear-gradient(160deg,#1f2452_0%,#2f2f6a_42%,#3f3b86_72%,#5b4ca7_100%)] p-4 text-white shadow-[0_14px_40px_rgba(25,20,70,0.38)] transition-all duration-200 md:flex md:flex-col ${
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
  const showCollapsedTooltip = collapsed && !mobileMode;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -right-16 bottom-8 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative mb-7 flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2"
          onClick={onNavigate}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Orbit size={18} className="text-indigo-100" />
          </span>
          {collapsed && !mobileMode ? null : (
            <span className="text-2xl font-semibold tracking-tight text-white">HuntFlow</span>
          )}
        </Link>

        {mobileMode ? (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-indigo-50 hover:bg-white/20"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {collapsed && !mobileMode ? null : (
        <div className="relative mb-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-indigo-100">
          <Sparkles size={14} className="text-cyan-200" />
          Space mode active
        </div>
      )}

      <nav className="relative space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href ? pathname.startsWith(item.href) : false;

          if (item.comingSoon) {
            return (
              <div key={item.name} className="group relative">
                <button
                  type="button"
                  disabled
                  title={item.name}
                  className={`w-full rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-2 text-indigo-100/70 ${
                    collapsed && !mobileMode
                      ? "flex items-center justify-center"
                      : "flex items-center justify-between gap-3"
                  } cursor-not-allowed`}
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10">
                      <Icon size={16} />
                    </span>
                    {collapsed && !mobileMode ? null : item.name}
                  </span>
                  {collapsed && !mobileMode ? null : (
                    <span className="text-[10px] uppercase tracking-wide text-indigo-200/75">
                      Coming soon
                    </span>
                  )}
                </button>

                {showCollapsedTooltip ? (
                  <HoverLabel label={item.name} />
                ) : null}
              </div>
            );
          }

          return (
            <div key={item.name} className="group relative">
              <Link
                href={item.href}
                onClick={onNavigate}
                title={item.name}
                className={`rounded-xl px-3 py-2 transition-all duration-150 ${
                  collapsed && !mobileMode
                    ? "flex items-center justify-center"
                    : "flex items-center gap-3"
                } ${
                  active
                    ? "bg-white/20 text-white ring-1 ring-white/35 shadow-[0_10px_24px_rgba(12,10,38,0.28)]"
                    : "text-indigo-100 hover:bg-white/12 hover:text-white"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                    active
                      ? "bg-white/28 text-white"
                      : "bg-white/10 text-indigo-100 group-hover:bg-white/20"
                  }`}
                >
                  <Icon size={16} />
                </span>
                {collapsed && !mobileMode ? null : (
                  <span className="text-[15px] font-medium tracking-tight">{item.name}</span>
                )}
              </Link>

              {showCollapsedTooltip ? <HoverLabel label={item.name} /> : null}
            </div>
          );
        })}
      </nav>
    </>
  );
}

function HoverLabel({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 rounded-lg border border-white/25 bg-[#221f4d]/95 px-2.5 py-1.5 text-xs font-medium text-indigo-50 opacity-0 shadow-[0_10px_28px_rgba(8,6,20,0.45)] transition duration-150 group-hover:opacity-100 whitespace-nowrap">
      {label}
    </span>
  );
}
