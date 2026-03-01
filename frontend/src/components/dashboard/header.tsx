"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>

      <div className="flex items-center gap-2">
        <Link
          href="/applications/new"
          className="bg-blue-600  text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Generate AI Application
        </Link>
        <Link
          href="/jobs/new"
          className="text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
        >
          Add Job
        </Link>
      </div>
    </header>
  );
}
