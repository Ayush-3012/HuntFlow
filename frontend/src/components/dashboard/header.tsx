"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, PanelLeftClose } from "lucide-react";

type HeaderProps = {
  isDesktopSidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/applications/new")) return "Generate AI Application";
  if (pathname.startsWith("/jobs/new")) return "Add New Job";
  if (pathname.includes("/edit")) return "Edit Job";
  if (pathname.startsWith("/jobs/")) return "Job Details";
  if (pathname.startsWith("/jobs")) return "Jobs";
  if (pathname.startsWith("/resumes")) return "Resumes";
  if (pathname.startsWith("/mails")) return "Mails";
  if (pathname.startsWith("/messages")) return "Messages";
  if (pathname.startsWith("/applications")) return "Application Details";
  return "Dashboard";
}

export default function Header({
  isDesktopSidebarCollapsed,
  onToggleDesktopSidebar,
  onOpenMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="h-16 border-b bg-white px-4 sm:px-6">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-md border px-2 py-2 cursor-pointer  text-gray-700 hover:bg-gray-50 md:hidden"
            aria-label="Open sidebar"
          >
            <PanelLeft size={18} />
          </button>

          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden rounded-md border px-2 py-2 text-gray-700 cursor-pointer hover:bg-gray-50 md:inline-flex"
            aria-label="Toggle sidebar"
            title={isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isDesktopSidebarCollapsed ? (
              <PanelLeft size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <h1 className="text-base font-semibold sm:text-lg">{getPageTitle(pathname)}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications/new"
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Generate AI Application</span>
            <span className="sm:hidden">Generate</span>
          </Link>
          <Link
            href="/jobs/new"
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">Add Job</span>
            <span className="sm:hidden">+ Job</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
