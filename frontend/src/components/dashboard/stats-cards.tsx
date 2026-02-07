"use client";

import { Application } from "@/types/application";
import { calculateApplicationStats } from "@/lib/utils/application-stats";

type Props = {
  applications: Application[];
};

export default function StatsCards({ applications }: Props) {
  const stats = calculateApplicationStats(applications);

  const items = [
    { title: "Total Applications", value: stats.total },
    { title: "Awaiting Response", value: stats.awaiting },
    { title: "Interviews", value: stats.interview },
    { title: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((stat) => (
        <div
          key={stat.title}
          className="bg-white border rounded-xl p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{stat.title}</p>
          <h3 className="text-2xl font-semibold mt-2">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
