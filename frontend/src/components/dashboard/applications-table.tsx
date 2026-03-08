"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Application, ApplicationStatus } from "@/types/application";
import SortIndicator from "@/components/ui/sort-indicator";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    Saved: "bg-gray-200 text-gray-700",
    Applied: "bg-blue-200 text-blue-700",
    Shortlisted: "bg-yellow-100 text-yellow-700",
    Interviewed: "bg-purple-100 text-purple-700",
    Rejected: "bg-red-100 text-red-700",
    Selected: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

type ApplicationsTableProps = {
  applications: Application[];
  onDelete?: (application: Application) => Promise<void> | void;
  deletingId?: string | null;
};

export default function ApplicationsTable({
  applications,
  onDelete,
  deletingId,
}: ApplicationsTableProps) {
  const [sortBy, setSortBy] = useState<
    "company" | "role" | "resume" | "status" | "updatedAt"
  >("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortIndicator = (
    key: "company" | "role" | "resume" | "status" | "updatedAt"
  ) => {
    return <SortIndicator active={sortBy === key} direction={sortDir} />;
  };

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
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4 sm:px-6">
        <h2 className="font-semibold">Recent Applications</h2>
      </div>

      {applications.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">No applications yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("company")}>
                    Company <span className="text-xs text-gray-500">{sortIndicator("company")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("role")}>
                    Role <span className="text-xs text-gray-500">{sortIndicator("role")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("resume")}>
                    Resume <span className="text-xs text-gray-500">{sortIndicator("resume")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("status")}>
                    Status <span className="text-xs text-gray-500">{sortIndicator("status")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">
                  <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("updatedAt")}>
                    Last Activity <span className="text-xs text-gray-500">{sortIndicator("updatedAt")}</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-left sm:px-6">Details</th>
                <th className="px-4 py-3 text-left sm:px-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedApps.map((app) => (
                <tr key={app._id} className="border-t transition hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium sm:px-6">{app.jobId.jobCompany}</td>
                  <td className="px-4 py-4 sm:px-6">{app.jobId.jobProfile}</td>
                  <td className="px-4 py-4 sm:px-6">{app.versionId?.version ?? "-"}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-4 text-gray-500 sm:px-6">
                    {new Date(app.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Link href={`/applications/${app._id}`} className="text-blue-600 hover:underline">
                      Open
                    </Link>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      disabled={!onDelete || deletingId === app._id}
                      onClick={() => onDelete?.(app)}
                      className="cursor-pointer text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === app._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
