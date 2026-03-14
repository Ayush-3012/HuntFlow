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
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  Workflow,
} from "lucide-react";

type HeaderProps = {
  isDesktopSidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileSidebar: () => void;
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
  onOpenMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const meta = getPageMeta(pathname);
  const PageIcon = meta.icon;

  return (
    <header className="border-b border-white/40 bg-white/60 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="inline-flex cursor-pointer rounded-lg border border-slate-200/80 bg-white/80 p-2 text-slate-700 shadow-sm hover:bg-white md:hidden"
            aria-label="Open sidebar"
          >
            <PanelLeft size={18} />
          </button>

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

        <div className="flex items-center gap-4">
          <Link
            href="/applications/new"
            className="rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 px-3 py-2 text-xs font-medium text-white hover:from-indigo-700 hover:to-blue-700 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Generate AI Application</span>
            <span className="sm:hidden">Generate</span>
          </Link>
          <Link
            href="/jobs/new"
            className="rounded-lg border bg-linear-to-r border-slate-200 from-bg-white/85 to-white px-3 py-2 text-xs font-medium text-slate-700 hover:from-white hover:to-slate-100 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Add Job</span>
            <span className="sm:hidden">+ Job</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
