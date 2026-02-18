"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/jobs/new")) return "Add New Job";
  if (pathname.includes("/edit")) return "Edit Job";
  if (pathname.startsWith("/jobs/")) return "Job Details";
  if (pathname.startsWith("/jobs")) return "Jobs";
  if (pathname.startsWith("/applications")) return "Application Details";
  return "Dashboard";
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>

      <Link
        href="/jobs/new"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        Add Job
      </Link>
    </header>
  );
}
