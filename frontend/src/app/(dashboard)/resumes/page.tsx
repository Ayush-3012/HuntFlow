"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchResumes, fetchResumeVersions } from "@/lib/api/resume";

type ResumeRow = {
  resumeId: string;
  title: string;
  versionId: string;
  version: string;
  fileUrl: string;
  updatedAt: string;
};

export default function ResumesPage() {
  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "version" | "updatedAt">("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortIndicator = (key: "title" | "version" | "updatedAt") => {
    if (sortBy !== key) return "↕";
    return sortDir === "asc" ? "▲" : "▼";
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

        const flattened: ResumeRow[] = versionsPerResume.flatMap(({ resume, versions }) => {
          if (versions.length === 0) {
            return [
              {
                resumeId: resume._id,
                title: resume.title,
                versionId: "-",
                version: "-",
                fileUrl: "",
                updatedAt: resume.updatedAt,
              },
            ];
          }

          return versions.map((version) => ({
            resumeId: resume._id,
            title: resume.title,
            versionId: version._id,
            version: version.version,
            fileUrl: version.fileUrl,
            updatedAt: version.updatedAt,
          }));
        });

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
    return <div className="p-6 text-sm text-gray-500">Loading resumes...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Resumes</h1>
        <p className="text-sm text-gray-500 mt-1">All resumes and their generated versions.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        {sortedRows.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No resumes found.</div>
        ) : (
          <table className="w-full text-sm min-w-[850px]">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-3">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("title")}>
                    Resume Title <span className="text-xs text-gray-500">{sortIndicator("title")}</span>
                  </button>
                </th>
                <th className="text-left px-6 py-3">Resume ID</th>
                <th className="text-left px-6 py-3">Version ID</th>
                <th className="text-left px-6 py-3">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("version")}>
                    Version <span className="text-xs text-gray-500">{sortIndicator("version")}</span>
                  </button>
                </th>
                <th className="text-left px-6 py-3">PDF</th>
                <th className="text-left px-6 py-3">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("updatedAt")}>
                    Updated <span className="text-xs text-gray-500">{sortIndicator("updatedAt")}</span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedRows.map((row) => (
                <tr key={`${row.resumeId}-${row.versionId}`} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{row.title}</td>
                  <td className="px-6 py-4 text-gray-600">{row.resumeId}</td>
                  <td className="px-6 py-4 text-gray-600">{row.versionId}</td>
                  <td className="px-6 py-4">{row.version}</td>
                  <td className="px-6 py-4">
                    {row.fileUrl ? (
                      <a href={row.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Download PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(row.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
