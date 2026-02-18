"use client";

import { Application, ApplicationStatus } from "@/types/application";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    Saved: "bg-gray-100 text-gray-700",
    Applied: "bg-blue-50 text-blue-700",
    Shortlisted: "bg-yellow-50 text-yellow-700",
    Interview: "bg-purple-50 text-purple-700",
    Interviewed: "bg-purple-50 text-purple-700",
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

type ApplicationsTableProps = {
  applications: Application[];
};

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {

  const sortedApps = [...applications].sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
);

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
            {sortedApps.map((app) => (
              <tr
                key={app._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">{app.jobId.jobCompany}</td>
                <td className="px-6 py-4">{app.jobId.jobProfile}</td>
                <td className="px-6 py-4">
                  {app.versionId?.version ?? "—"}
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
