"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchResumes,
  fetchResumeVersions,
  ResumeVersionWithApplications,
} from "@/lib/api/resume";
import { X } from "lucide-react";
import SortIndicator from "@/components/ui/sort-indicator";
import HourglassLoader from "@/components/ui/hourglass-loader";

type ResumeRow = {
  resumeId: string;
  title: string;
  versionId: string;
  version: string;
  fileUrl: string;
  updatedAt: string;
  jobs: {
    company: string;
    role: string;
  }[];
};

export default function ResumesPage() {
  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "version" | "updatedAt">(
    "updatedAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  const sortIndicator = (key: "title" | "version" | "updatedAt") => {
    return <SortIndicator active={sortBy === key} direction={sortDir} />;
  };

  useEffect(() => {
    async function load() {
      try {
        const resumes = await fetchResumes();

        const versionsPerResume = await Promise.all(
          resumes.map(async (resume) => ({
            resume,
            versions: await fetchResumeVersions(resume._id),
          }))
        );

        const flattened: ResumeRow[] = versionsPerResume.flatMap(
          ({ resume, versions }) => {
            if (versions.length === 0) {
              return [
                {
                  resumeId: resume._id,
                  title: resume.title,
                  versionId: "-",
                  version: "-",
                  fileUrl: "",
                  updatedAt: resume.updatedAt,
                  jobs: [],
                },
              ];
            }

            return versions.map((version: ResumeVersionWithApplications) => ({
              resumeId: resume._id,
              title: resume.title,
              versionId: version._id,
              version: version.version,
              fileUrl: version.fileUrl,
              updatedAt: version.updatedAt,
              jobs:
                version.applications?.map((app) => ({
                  company: app.jobId?.jobCompany ?? "Unknown Company",
                  role: app.jobId?.jobProfile ?? "Unknown Role",
                })) ?? [],
            }));
          }
        );

        setRows(flattened);
      } catch {
        setError("Failed to load resumes.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSort = (key: "title" | "version" | "updatedAt") => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDir("asc");
  };

  const sortedRows = useMemo(() => {
    const getValue = (row: ResumeRow) => {
      if (sortBy === "title") return row.title.toLowerCase();
      if (sortBy === "version") return row.version.toLowerCase();
      return new Date(row.updatedAt).getTime();
    };

    return [...rows].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [rows, sortBy, sortDir]);

  if (loading) {
    return <HourglassLoader label="Loading resumes..." />;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Resumes</h1>
        <p className="text-sm text-gray-500 mt-1">
          All resumes and their generated versions.
        </p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        {sortedRows.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No resumes found.</div>
        ) : (
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    type="button"
                    className="font-medium hover:underline inline-flex items-center gap-1"
                    onClick={() => handleSort("title")}
                  >
                    Resume
                    <span className="text-xs text-gray-500">
                      {sortIndicator("title")}
                    </span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    type="button"
                    className="font-medium hover:underline inline-flex items-center gap-1"
                    onClick={() => handleSort("version")}
                  >
                    Version
                    <span className="text-xs text-gray-500">
                      {sortIndicator("version")}
                    </span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">Used For</th>
                <th className="px-6 py-3 text-left">View</th>
                <th className="px-6 py-3 text-left">Download</th>
                <th className="px-6 py-3 text-left">
                  <button
                    type="button"
                    className="font-medium hover:underline inline-flex items-center gap-1"
                    onClick={() => handleSort("updatedAt")}
                  >
                    Updated
                    <span className="text-xs text-gray-500">
                      {sortIndicator("updatedAt")}
                    </span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedRows.map((row) => (
                <tr
                  key={`${row.resumeId}-${row.versionId}`}
                  className="border-t hover:bg-gray-50 align-top"
                >
                  <td className="px-6 py-4 font-medium">{row.title}</td>
                  <td className="px-6 py-4">{row.version}</td>

                  <td className="px-6 py-4">
                    {row.jobs.length > 0 ? (
                      <div className="space-y-1">
                        {row.jobs.map((job, idx) => (
                          <div
                            key={idx}
                            className="inline-block text-xs bg-gray-100 px-2 py-1 rounded-md mr-2 mb-1"
                          >
                            {job.company} - {job.role}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Not used yet</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {row.fileUrl ? (
                      <button
                        onClick={() => setViewerUrl(row.fileUrl)}
                        className="text-blue-600 hover:underline"
                      >
                        View PDF
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {row.fileUrl ? (
                      <a
                        href={row.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download PDF
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(row.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewerUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-semibold">Resume Preview</h3>

              <div className="flex gap-3">
                <a
                  href={viewerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 px-4 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-500 hover:text-white font-bold"
                >
                  Open In New Tab
                </a>

                <a
                  href={viewerUrl}
                  download
                  className="text-sm text-blue-600 px-4 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-500 hover:text-white font-bold"
                >
                  Download
                </a>

                <button
                  onClick={() => setViewerUrl(null)}
                  className="p-2 rounded-full hover:bg-gray-700 hover:text-white text-gray-500"
                >
                  <X />
                </button>
              </div>
            </div>

            <iframe src={`${viewerUrl}#toolbar=0`} className="flex-1 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}


