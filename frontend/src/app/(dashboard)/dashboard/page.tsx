"use client";

import { useEffect, useState } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import ApplicationsTable from "@/components/dashboard/applications-table";
import { deleteApplication, fetchApplications } from "@/lib/api/application";
import { Application } from "@/types/application";
import HourglassLoader from "@/components/ui/hourglass-loader";
import { toast } from "@/lib/toast";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  if (loading) {
    return <HourglassLoader label="Loading dashboard..." />;
  }

  if (loadError) {
    return <div className="p-6 text-sm text-red-600">{loadError}</div>;
  }

  const handleDelete = async (application: Application) => {
    const shouldDelete = window.confirm(
      `Delete application for ${application.jobId.jobCompany} - ${application.jobId.jobProfile}? This will also remove related mails/messages/timeline and linked resume version if not used elsewhere.`
    );
    if (!shouldDelete) return;

    setDeletingId(application._id);
    setActionError(null);
    try {
      await deleteApplication(application._id);
      setApplications((prev) => prev.filter((item) => item._id !== application._id));
      toast.success("Application deleted successfully.");
    } catch {
      setActionError("Failed to delete application.");
      toast.error("Failed to delete application.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}
      <StatsCards applications={applications} />
      <ApplicationsTable
        applications={applications}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}




