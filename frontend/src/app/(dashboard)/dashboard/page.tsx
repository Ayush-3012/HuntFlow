"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCards from "@/components/dashboard/stats-cards";
import ApplicationsTable from "@/components/dashboard/applications-table";
import { deleteApplication, fetchApplications } from "@/lib/api/application";
import { Application } from "@/types/application";
import HourglassLoader from "@/components/ui/hourglass-loader";
import { toast } from "@/lib/toast";
import { useViewMode } from "@/hooks/use-view-mode";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { viewMode, setViewMode } = useViewMode("dashboard-applications-view");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch {
        setLoadError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleDelete = async (application: Application) => {
    const shouldDelete = window.confirm(
      `Delete application for ${application.jobId.jobCompany} - ${application.jobId.jobProfile}? This will also remove related mails/messages/timeline and linked resume version if not used elsewhere.`
    );
    if (!shouldDelete) return;

    setDeletingId(application._id);
    setActionError(null);
    try {
      await deleteApplication(application._id);
      setApplications((prev) =>
        prev.filter((item) => item._id !== application._id)
      );
      toast.success("Application deleted successfully.");
    } catch {
      setActionError("Failed to delete application.");
      toast.error("Failed to delete application.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <HourglassLoader label="Loading dashboard..." />;
  }

  if (loadError) {
    return <div className="p-6 text-sm text-red-600">{loadError}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/45 bg-[#eef0ff] p-4 shadow-[0_24px_80px_rgba(88,88,168,0.2)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.20),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.18),transparent_28%),radial-gradient(circle_at_30%_88%,rgba(251,146,60,0.18),transparent_30%),radial-gradient(circle_at_88%_76%,rgba(59,130,246,0.16),transparent_26%)]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative space-y-6"
      >
        {actionError ? (
          <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur">
            {actionError}
          </div>
        ) : null}

        <StatsCards applications={applications} />

        <ApplicationsTable
          applications={applications}
          onDelete={handleDelete}
          deletingId={deletingId}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </motion.div>
    </div>
  );
}

