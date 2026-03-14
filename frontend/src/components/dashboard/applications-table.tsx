"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, CalendarDays, FileText, Send, Trash2 } from "lucide-react";
import { Application, ApplicationStatus } from "@/types/application";
import SortIndicator from "@/components/ui/sort-indicator";
import DataRowCard from "@/components/ui/data-row-card";
import ViewModeToggle from "@/components/ui/view-mode-toggle";
import { ViewMode } from "@/hooks/use-view-mode";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    Saved: "bg-slate-100 text-slate-700",
    Applied: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-amber-100 text-amber-700",
    Interviewed: "bg-violet-100 text-violet-700",
    Rejected: "bg-rose-100 text-rose-700",
    Selected: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

type ApplicationsTableProps = {
  applications: Application[];
  onDelete?: (application: Application) => Promise<void> | void;
  deletingId?: string | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

export default function ApplicationsTable({
  applications,
  onDelete,
  deletingId,
  viewMode,
  onViewModeChange,
}: ApplicationsTableProps) {
  const [sortBy, setSortBy] = useState<
    "company" | "role" | "resume" | "status" | "updatedAt"
  >("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortIndicator = (
    key: "company" | "role" | "resume" | "status" | "updatedAt"
  ) => <SortIndicator active={sortBy === key} direction={sortDir} />;

  const handleSort = (
    key: "company" | "role" | "resume" | "status" | "updatedAt"
  ) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDir("asc");
  };

  const sortedApps = useMemo(() => {
    const getValue = (app: Application) => {
      if (sortBy === "company") return app.jobId.jobCompany.toLowerCase();
      if (sortBy === "role") return app.jobId.jobProfile.toLowerCase();
      if (sortBy === "resume") return (app.versionId?.version ?? "").toLowerCase();
      if (sortBy === "status") return app.status.toLowerCase();
      return new Date(app.updatedAt).getTime();
    };

    return [...applications].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [applications, sortBy, sortDir]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: 0.1, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-white/45 bg-white/70 shadow-[0_16px_46px_rgba(76,48,160,0.14)] backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/60 px-4 py-4 sm:px-6">
        <h2 className="text-2xl font-semibold text-slate-900">Recent Applications</h2>
        <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
      </div>

      {applications.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No applications yet.</div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-sm">
            <thead className="bg-white/50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:text-slate-900" onClick={() => handleSort("company")}>
                    Company <span className="text-xs">{sortIndicator("company")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:text-slate-900" onClick={() => handleSort("role")}>
                    Role <span className="text-xs">{sortIndicator("role")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:text-slate-900" onClick={() => handleSort("resume")}>
                    Resume <span className="text-xs">{sortIndicator("resume")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:text-slate-900" onClick={() => handleSort("status")}>
                    Status <span className="text-xs">{sortIndicator("status")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:text-slate-900" onClick={() => handleSort("updatedAt")}>
                    Last Activity <span className="text-xs">{sortIndicator("updatedAt")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">Details</th>
                <th className="px-4 py-3 text-left sm:px-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedApps.map((app, index) => (
                <motion.tr
                  key={app._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-t border-white/55 transition hover:bg-white/55"
                >
                  <td className="px-4 py-4 font-medium sm:px-6">
                    <span className="inline-flex items-center gap-2 text-slate-900">
                      <Building2 className="h-4 w-4 text-indigo-500" />
                      {app.jobId.jobCompany}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700 sm:px-6">{app.jobId.jobProfile}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      {app.versionId?.version ?? "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-500 sm:px-6">
                    {new Date(app.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Link href={`/applications/${app._id}`} className="inline-flex items-center gap-0.5 font-medium text-blue-700 hover:text-blue-900 hover:underline">
                      <Send className="h-3.5 w-3.5" /> Open
                    </Link>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      disabled={!onDelete || deletingId === app._id}
                      onClick={() => onDelete?.(app)}
                      className="inline-flex cursor-pointer items-center gap-1 text-rose-600 hover:text-rose-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingId === app._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 p-4 sm:p-6">
          {sortedApps.map((app) => (
            <DataRowCard
              key={app._id}
              title={app.jobId.jobCompany}
              subtitle={app.jobId.jobProfile}
              icon={<Building2 className="h-4 w-4" />}
              badge={<StatusBadge status={app.status} />}
              fields={[
                { label: "Resume", value: app.versionId?.version ?? "-" },
                {
                  label: "Last Activity",
                  value: (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  ),
                },
              ]}
              actions={
                <>
                  <Link href={`/applications/${app._id}`} className="text-sm inline-flex items-center gap-0.5 font-medium text-blue-700 hover:text-blue-900 hover:underline">
                    <Send className="h-3.5 w-3.5" /> Open
                  </Link>
                  <button
                    type="button"
                    disabled={!onDelete || deletingId === app._id}
                    onClick={() => onDelete?.(app)}
                    className="inline-flex items-center gap-1 cursor-pointer text-sm text-rose-600 hover:text-rose-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === app._id ? "Deleting..." : "Delete"}
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
