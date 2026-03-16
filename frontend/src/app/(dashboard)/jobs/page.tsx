"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  Eye,
  Layers3,
  PencilLine,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { fetchJobs } from "@/lib/api/job";
import { Job } from "@/types/application";
import SortIndicator from "@/components/ui/sort-indicator";
import HourglassLoader from "@/components/ui/hourglass-loader";
import DataRowCard from "@/components/ui/data-row-card";
import ViewModeToggle from "@/components/ui/view-mode-toggle";
import PaginationControls from "@/components/ui/pagination-controls";
import { useViewMode } from "@/hooks/use-view-mode";
import { buildSearchTokens, matchesSearchTokens } from "@/lib/search";

const PAGE_SIZE = 9;

export default function JobsPage() {
  const searchParams = useSearchParams();
  const globalQuery = (searchParams.get("q") ?? "").trim();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"company" | "role" | "domain" | "createdAt">(
    "createdAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { viewMode, setViewMode } = useViewMode("jobs-view-mode");

  const sortIndicator = (key: "company" | "role" | "domain" | "createdAt") => {
    return <SortIndicator active={sortBy === key} direction={sortDir} />;
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

  const searchTokens = useMemo(() => buildSearchTokens(globalQuery, tableSearch), [globalQuery, tableSearch]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      matchesSearchTokens(searchTokens, [
        job.jobCompany,
        job.jobProfile,
        job.domain,
        job.jobDescription,
        job.jobLink,
        new Date(job.createdAt).toLocaleDateString(),
      ])
    );
  }, [jobs, searchTokens]);

  const sortedJobs = useMemo(() => {
    const getValue = (job: Job) => {
      if (sortBy === "company") return job.jobCompany.toLowerCase();
      if (sortBy === "role") return job.jobProfile.toLowerCase();
      if (sortBy === "domain") return job.domain.toLowerCase();
      return new Date(job.createdAt).getTime();
    };

    return [...filteredJobs].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [filteredJobs, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch, globalQuery, sortBy, sortDir]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedJobs.slice(start, start + PAGE_SIZE);
  }, [sortedJobs, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">All tracked opportunities in one place.</p>
        </div>

        <div className="flex items-center gap-2">
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
          <Link
            href="/jobs/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add New Job
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={tableSearch}
            onChange={(event) => setTableSearch(event.target.value)}
            placeholder="Search in Jobs table..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        {globalQuery ? <span className="text-xs text-slate-500">Global filter: <span className="font-medium">{globalQuery}</span></span> : null}
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white">
          <HourglassLoader label="Loading jobs..." />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error ? (
        viewMode === "table" ? (
          <div className="overflow-x-auto rounded-2xl border border-white/45 bg-white/70 shadow-[0_16px_46px_rgba(76,48,160,0.14)] backdrop-blur-xl">
            {sortedJobs.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No jobs found for current search.</div>
            ) : (
              <>
                <table className="min-w-245 w-full text-sm">
                  <thead className="bg-white/50 text-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("company")}>
                          Company <span className="text-xs text-gray-500">{sortIndicator("company")}</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("role")}>
                          Role <span className="text-xs text-gray-500">{sortIndicator("role")}</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("domain")}>
                          Domain <span className="text-xs text-gray-500">{sortIndicator("domain")}</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">Job Link</th>
                      <th className="px-6 py-3 text-left">
                        <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("createdAt")}>
                          Created <span className="text-xs text-gray-500">{sortIndicator("createdAt")}</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedJobs.map((job) => (
                      <tr key={job._id} className="border-t border-white/55 transition hover:bg-white/55">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          <span className="inline-flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-indigo-500" />
                            {job.jobCompany}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          <span className="inline-flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-500" />
                            {job.jobProfile}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          <span className="inline-flex items-center gap-2">
                            <Layers3 className="h-4 w-4 text-violet-500" />
                            {job.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {job.jobLink ? (
                            <a
                              href={job.jobLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open Link
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link href={`/jobs/${job._id}`} className="text-blue-700 hover:text-blue-900 hover:underline">
                              View
                            </Link>
                            <Link
                              href={`/jobs/${job._id}/edit`}
                              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline"
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <Link
                              href={`/applications/new?jobId=${job._id}`}
                              className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 hover:underline"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Generate AI
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sortedJobs.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 max-lg:grid-cols-2 max-md:grid-cols-1">
              {paginatedJobs.map((job) => (
                <DataRowCard
                  key={job._id}
                  title={job.jobCompany}
                  subtitle={job.jobProfile}
                  icon={<Building2 className="h-4 w-4" />}
                  fields={[
                    {
                      label: "Domain",
                      value: (
                        <span className="inline-flex items-center gap-2">
                          <Layers3 className="h-4 w-4 text-violet-500" />
                          {job.domain}
                        </span>
                      ),
                    },
                    {
                      label: "Created",
                      value: (
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      ),
                    },
                  ]}
                  actions={
                    <>
                      {job.jobLink ? (
                        <a href={job.jobLink} target="_blank" rel="noreferrer" className="flex justify-center items-center gap-0.5 text-sm text-blue-700 hover:text-blue-900 hover:underline">
                          <Send className="h-3.5 w-3.5" /> Open Link
                        </a>
                      ) : null}
                      <Link href={`/jobs/${job._id}`} className="flex justify-center items-center gap-0.5 text-sm text-blue-700 hover:text-blue-900 hover:underline">
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                      <Link href={`/jobs/${job._id}/edit`} className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 hover:underline">
                        <PencilLine className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <Link href={`/applications/new?jobId=${job._id}`} className="inline-flex items-center gap-1 text-sm text-indigo-700 hover:text-indigo-900 hover:underline">
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate AI
                      </Link>
                    </>
                  }
                />
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedJobs.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )
      ) : null}
    </div>
  );
}

