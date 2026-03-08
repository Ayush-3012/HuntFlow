"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Resumes", href: "/resumes", icon: FileText },
  { name: "Mails", href: "/mails", icon: Mail },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "", icon: Settings, comingSoon: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-full p-4">
      <div className="text-xl font-semibold mb-6">
        <Link href="/dashboard">HuntFlow</Link>
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
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed border border-dashed"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.name}
                </span>
                <span className="text-[10px] uppercase tracking-wide">Coming soon</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                pathname.startsWith(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
