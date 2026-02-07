"use client";

import { useEffect, useState } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import InsightBanner from "@/components/dashboard/insight-banner";
import ApplicationsTable from "@/components/dashboard/applications-table";
import RightPanel from "@/components/dashboard/right-panel";
import { fetchApplications } from "@/lib/api/application";
import { Application } from "@/types/application";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <StatsCards applications={applications} />
        <InsightBanner />
        <ApplicationsTable />
      </div>

      {/* RIGHT */}
      <RightPanel />
    </div>
  );
}
