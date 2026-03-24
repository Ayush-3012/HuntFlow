"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Download,
  Eye,
  FileText,
  Search,
  Tag,
  X,
} from "lucide-react";
import {
  fetchResumes,
  fetchResumeVersions,
  ResumeVersionWithApplications,
} from "@/lib/api/resume";
import SortIndicator from "@/components/ui/sort-indicator";
import HourglassLoader from "@/components/ui/hourglass-loader";
import DataRowCard from "@/components/ui/data-row-card";
import ViewModeToggle from "@/components/ui/view-mode-toggle";
import PaginationControls from "@/components/ui/pagination-controls";
import { useViewMode } from "@/hooks/use-view-mode";
import { buildSearchTokens, matchesSearchTokens } from "@/lib/search";

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

const PAGE_SIZE = 9;

export default function ResumesPage() {
  return (
    <Suspense fallback={<HourglassLoader label="Loading resumes..." />}>
      <ResumesPageContent />
    </Suspense>
  );
}

function ResumesPageContent() {
  const searchParams = useSearchParams();
  const globalQuery = (searchParams.get("q") ?? "").trim();

  const [rows, setRows] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"title" | "version" | "updatedAt">("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const { viewMode, setViewMode } = useViewMode("resumes-view-mode");

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

  const searchTokens = useMemo(() => buildSearchTokens(globalQuery, tableSearch), [globalQuery, tableSearch]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      matchesSearchTokens(searchTokens, [
        row.title,
        row.version,
        row.jobs.map((job) => `${job.company} ${job.role}`).join(" "),
        new Date(row.updatedAt).toLocaleDateString(),
      ])
    );
  }, [rows, searchTokens]);

  const sortedRows = useMemo(() => {
    const getValue = (row: ResumeRow) => {
      if (sortBy === "title") return row.title.toLowerCase();
      if (sortBy === "version") return row.version.toLowerCase();
      return new Date(row.updatedAt).getTime();
    };

    return [...filteredRows].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [filteredRows, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch, globalQuery, sortBy, sortDir]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedRows.slice(start, start + PAGE_SIZE);
  }, [sortedRows, currentPage]);

  if (loading) {
    return <HourglassLoader label="Loading Resumes..." />;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Resumes</h1>
          <p className="mt-1 text-sm text-gray-500">All resumes and their generated versions.</p>
        </div>
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={tableSearch}
            onChange={(event) => setTableSearch(event.target.value)}
            placeholder="Search in Resumes table..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        {globalQuery ? <span className="text-xs text-slate-500">Global filter: <span className="font-medium">{globalQuery}</span></span> : null}
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-2xl border border-white/45 bg-white/70 shadow-[0_16px_46px_rgba(76,48,160,0.14)] backdrop-blur-xl">
          {sortedRows.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No resumes found for current search.</div>
          ) : (
            <>
              <table className="min-w-262.5 w-full text-sm">
                <thead className="bg-white/50 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                        onClick={() => handleSort("title")}
                      >
                        Resume
                        <span className="text-xs text-gray-500">{sortIndicator("title")}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                        onClick={() => handleSort("version")}
                      >
                        Version
                        <span className="text-xs text-gray-500">{sortIndicator("version")}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">Used For</th>
                    <th className="px-6 py-3 text-left">View</th>
                    <th className="px-6 py-3 text-left">Download</th>
                    <th className="px-6 py-3 text-left">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                        onClick={() => handleSort("updatedAt")}
                      >
                        Updated
                        <span className="text-xs text-gray-500">{sortIndicator("updatedAt")}</span>
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRows.map((row) => (
                    <tr
                      key={`${row.resumeId}-${row.versionId}`}
                      className="border-t border-white/55 align-top transition hover:bg-white/55"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <span className="inline-flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-500" />
                          {row.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <Tag className="h-4 w-4 text-violet-500" />
                          {row.version}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {row.jobs.length > 0 ? (
                          <div className="space-y-1">
                            {row.jobs.map((job, idx) => (
                              <div
                                key={idx}
                                className="mr-2 mb-1 inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs"
                              >
                                <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                                {job.company}
                                <span className="text-gray-400">-</span>
                                <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                                {job.role}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Not used yet</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {row.fileUrl ? (
                          <button
                            onClick={() => setViewerUrl(row.fileUrl)}
                            className="inline-flex cursor-pointer items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            <Eye className="h-3.5 w-3.5" />
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
                            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download PDF
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {new Date(row.updatedAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedRows.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid auto-rows-fr grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedRows.map((row) => (
              <DataRowCard
                key={`${row.resumeId}-${row.versionId}`}
                title={row.title}
                subtitle={`Version ${row.version}`}
                icon={<FileText className="h-4 w-4" />}
                fieldsColumns={1}
                fromResume={true}
                className="h-full"
                fields={[
                  {
                    label: "Used For",
                    value:
                      row.jobs.length > 0 ? (
                        <div className="max-h-20 overflow-y-auto pr-1 flex flex-wrap gap-1">
                          {row.jobs.map((job, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs">
                              <Building2 className="h-3 w-3 text-indigo-500" />
                              {job.company}
                              <span className="text-gray-400">-</span>
                              <Briefcase className="h-3 w-3 text-blue-500" />
                              {job.role}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "Not used yet"
                      ),
                  },
                  {
                    label: "Updated",
                    value: (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(row.updatedAt).toLocaleDateString()}
                      </span>
                    ),
                  },
                ]}
                actions={
                  <>
                    {row.fileUrl ? (
                      <button
                        onClick={() => setViewerUrl(row.fileUrl)}
                        className="inline-flex cursor-pointer items-center gap-1 text-sm text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View PDF
                      </button>
                    ) : null}
                    {row.fileUrl ? (
                      <a
                        href={row.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                      </a>
                    ) : null}
                  </>
                }
              />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedRows.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {viewerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-xl bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-semibold">Resume Preview</h3>

              <div className="flex gap-3">
                <a
                  href={viewerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border-2 border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-500 hover:text-white"
                >
                  Open In New Tab
                </a>

                <a
                  href={viewerUrl}
                  download
                  className="rounded-lg border-2 border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-500 hover:text-white"
                >
                  Download
                </a>

                <button
                  onClick={() => setViewerUrl(null)}
                  className="cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-700 hover:text-white"
                >
                  <X />
                </button>
              </div>
            </div>

            <iframe src={`${viewerUrl}#toolbar=0`} className="w-full flex-1" />
          </div>
        </div>
      )}
    </div>
  );
}

