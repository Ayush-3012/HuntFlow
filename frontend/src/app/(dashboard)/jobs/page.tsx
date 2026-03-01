"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchJobs } from "@/lib/api/job";
import { Job } from "@/types/application";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"company" | "role" | "domain" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortIndicator = (key: "company" | "role" | "domain" | "createdAt") => {
    if (sortBy !== key) return "↕";
    return sortDir === "asc" ? "▲" : "▼";
  };

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const handleSort = (key: "company" | "role" | "domain" | "createdAt") => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDir("asc");
  };

  const sortedJobs = useMemo(() => {
    const getValue = (job: Job) => {
      if (sortBy === "company") return job.jobCompany.toLowerCase();
      if (sortBy === "role") return job.jobProfile.toLowerCase();
      if (sortBy === "domain") return job.domain.toLowerCase();
      return new Date(job.createdAt).getTime();
    };

    return [...jobs].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [jobs, sortBy, sortDir]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            All tracked opportunities in one place.
          </p>
        </div>

        <Link
          href="/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Add New Job
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
          Loading jobs...
        </div>
      ) : null}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          {jobs.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No jobs found. Add your first job to get started.
            </div>
          ) : (
            <table className="w-full text-sm min-w-195">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">
                    <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("company")}>
                      Company <span className="text-xs text-gray-500">{sortIndicator("company")}</span>
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("role")}>
                      Role <span className="text-xs text-gray-500">{sortIndicator("role")}</span>
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">
                    <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("domain")}>
                      Domain <span className="text-xs text-gray-500">{sortIndicator("domain")}</span>
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">Job Link</th>
                  <th className="text-left px-6 py-3">
                    <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("createdAt")}>
                      Created <span className="text-xs text-gray-500">{sortIndicator("createdAt")}</span>
                    </button>
                  </th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedJobs.map((job) => (
                  <tr key={job._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{job.jobCompany}</td>
                    <td className="px-6 py-4">{job.jobProfile}</td>
                    <td className="px-6 py-4">{job.domain}</td>
                    <td className="px-6 py-4">
                      {job.jobLink ? (
                        <a
                          href={job.jobLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/jobs/${job._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/jobs/${job._id}/edit`}
                          className="text-gray-700 hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}
