"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Mail,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";

type HeaderProps = {
  isDesktopSidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
};

type PageMeta = {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

function getPageMeta(pathname: string): PageMeta {
  if (pathname.startsWith("/applications/new")) {
    return { title: "Generate AI Application", icon: Sparkles };
  }
  if (pathname.startsWith("/jobs/new")) return { title: "Add New Job", icon: Briefcase };
  if (pathname.includes("/edit")) return { title: "Edit Job", icon: Briefcase };
  if (pathname.startsWith("/jobs/")) return { title: "Job Details", icon: Briefcase };
  if (pathname.startsWith("/jobs")) return { title: "Jobs", icon: Briefcase };
  if (pathname.startsWith("/resumes")) return { title: "Resumes", icon: FileText };
  if (pathname.startsWith("/mails")) return { title: "Mails", icon: Mail };
  if (pathname.startsWith("/messages")) return { title: "Messages", icon: MessageSquare };
  if (pathname.startsWith("/applications")) {
    return { title: "Application Details", icon: Workflow };
  }
  return { title: "Dashboard", icon: LayoutDashboard };
}

export default function Header({
  isDesktopSidebarCollapsed,
  onToggleDesktopSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [currentGlobalQuery, setCurrentGlobalQuery] = useState("");
  const [searchParamsString, setSearchParamsString] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") ?? "";

    setCurrentGlobalQuery(initialQuery);
    setGlobalSearch(initialQuery);
    setSearchParamsString(params.toString());
  }, [pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (globalSearch === currentGlobalQuery) return;

      const params = new URLSearchParams(searchParamsString);
      const trimmed = globalSearch.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
      setCurrentGlobalQuery(trimmed);
      setSearchParamsString(queryString);
    }, 250);

    return () => clearTimeout(timeout);
  }, [globalSearch, currentGlobalQuery, pathname, router, searchParamsString]);

  const meta = getPageMeta(pathname);
  const PageIcon = meta.icon;

  return (
    <header className="border-b border-white/40 bg-white/60 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden cursor-pointer rounded-lg border border-slate-200/80 bg-white/80 p-2 text-slate-700 shadow-sm hover:bg-white md:inline-flex"
            aria-label="Toggle sidebar"
            title={isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isDesktopSidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/70 px-3 py-1.5 shadow-[0_8px_28px_rgba(90,70,170,0.12)]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-blue-600 text-white">
              <PageIcon size={15} />
            </span>
            <h1 className="text-sm font-semibold text-slate-800 sm:text-base">{meta.title}</h1>
          </div>
        </div>

        <div className="flex min-w-72 flex-1 items-center justify-end gap-3">
          <label className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Global search across tables..."
              className="w-full rounded-lg border border-slate-200 bg-white/90 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <Link
            href="/applications/new"
            className="shrink-0 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 px-3 py-2 text-xs font-medium text-white hover:from-indigo-700 hover:to-blue-700 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Generate AI Application</span>
            <span className="sm:hidden">Generate</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
