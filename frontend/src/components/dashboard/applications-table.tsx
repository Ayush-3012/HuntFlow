"use client";

import { useEffect, useState } from "react";
import { fetchApplications } from "@/lib/api/application";
import { Application, ApplicationStatus } from "@/types/application";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    Saved: "bg-gray-100 text-gray-700",
    Applied: "bg-blue-50 text-blue-700",
    Shortlisted: "bg-yellow-50 text-yellow-700",
    Interview: "bg-purple-50 text-purple-700",
    Rejected: "bg-red-50 text-red-700",
    Selected: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-md font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold">Recent Applications</h2>
      </div>

      {applications.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">No applications yet.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Company</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Resume</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Last Activity</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr
                key={app._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">{app.companyName}</td>
                <td className="px-6 py-4">{app.jobProfile}</td>
                <td className="px-6 py-4">
                  {app.resumeVersion?.version ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(app.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
