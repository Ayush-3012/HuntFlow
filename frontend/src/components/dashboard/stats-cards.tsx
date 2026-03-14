"use client";

import type { ComponentType } from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Clock3, Mic, XCircle } from "lucide-react";
import { Application } from "@/types/application";
import { calculateApplicationStats } from "@/lib/utils/application-stats";

type Props = {
  applications: Application[];
};

type StatItem = {
  title: string;
  value: number;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  iconWrap: string;
  chipClass: string;
};

export default function StatsCards({ applications }: Props) {
  const stats = calculateApplicationStats(applications);

  const items = useMemo<StatItem[]>(
    () => [
      {
        title: "Total Applications",
        value: stats.total,
        subtitle: `${stats.total} this week`,
        icon: BriefcaseBusiness,
        iconWrap:
          "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[0_8px_22px_rgba(59,130,246,0.35)]",
        chipClass: "bg-blue-50 text-blue-700 border-blue-100",
      },
      {
        title: "Awaiting Response",
        value: stats.awaiting,
        subtitle: `${stats.awaiting} this week`,
        icon: Clock3,
        iconWrap:
          "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_8px_22px_rgba(249,115,22,0.32)]",
        chipClass: "bg-orange-50 text-orange-700 border-orange-100",
      },
      {
        title: "Interviews",
        value: stats.interview,
        subtitle: `${stats.interview} this week`,
        icon: Mic,
        iconWrap:
          "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_8px_22px_rgba(168,85,247,0.32)]",
        chipClass: "bg-violet-50 text-violet-700 border-violet-100",
      },
      {
        title: "Rejected",
        value: stats.rejected,
        subtitle: `${stats.rejected} this week`,
        icon: XCircle,
        iconWrap:
          "bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-[0_8px_22px_rgba(239,68,68,0.32)]",
        chipClass: "bg-rose-50 text-rose-700 border-rose-100",
      },
    ],
    [stats.awaiting, stats.interview, stats.rejected, stats.total]
  );

  return (
    <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
      {items.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.34, delay: index * 0.06, ease: "easeOut" }}
            className="rounded-2xl border border-white/45 bg-white/70 p-4 shadow-[0_12px_40px_rgba(76,48,160,0.12)] backdrop-blur-xl sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">{stat.title}</p>
                <h3 className="mt-1 text-4xl font-bold leading-none text-slate-900">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconWrap}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div
              className={`mt-4 flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${stat.chipClass}`}
            >
              <span>{stat.subtitle}</span>
              <span aria-hidden="true">&gt;</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
