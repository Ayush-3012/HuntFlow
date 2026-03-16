"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  Briefcase,
  Building2,
  CalendarDays,
  Eye,
  MailOpen,
  Search,
  Send,
  X,
} from "lucide-react";
import { fetchMails, sendMail, updateMail } from "@/lib/api/mail";
import { MailRecord } from "@/types/application";
import SortIndicator from "@/components/ui/sort-indicator";
import HourglassLoader from "@/components/ui/hourglass-loader";
import { toast } from "@/lib/toast";
import DataRowCard from "@/components/ui/data-row-card";
import ViewModeToggle from "@/components/ui/view-mode-toggle";
import PaginationControls from "@/components/ui/pagination-controls";
import { useViewMode } from "@/hooks/use-view-mode";
import { buildSearchTokens, matchesSearchTokens } from "@/lib/search";

type MailSortKey = "company" | "role" | "to" | "subject" | "status" | "updatedAt";

const PAGE_SIZE = 9;

export default function MailsPage() {
  const searchParams = useSearchParams();
  const globalQuery = (searchParams.get("q") ?? "").trim();

  const [mails, setMails] = useState<MailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewMail, setPreviewMail] = useState<MailRecord | null>(null);
  const [sortBy, setSortBy] = useState<MailSortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { viewMode, setViewMode } = useViewMode("mails-view-mode");

  useEffect(() => {
    async function loadMails() {
      try {
        const data = await fetchMails();
        setMails(data);
      } catch {
        setError("Failed to load mails.");
      } finally {
        setLoading(false);
      }
    }
    loadMails();
  }, []);

  const sortIndicator = (key: MailSortKey) => {
    return <SortIndicator active={sortBy === key} direction={sortDir} />;
  };

  const handleSort = (key: MailSortKey) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDir("asc");
  };

  const searchTokens = useMemo(() => buildSearchTokens(globalQuery, tableSearch), [globalQuery, tableSearch]);

  const filteredMails = useMemo(() => {
    return mails.filter((mail) =>
      matchesSearchTokens(searchTokens, [
        mail.applicationId?.jobId?.jobCompany,
        mail.applicationId?.jobId?.jobProfile,
        mail.to,
        mail.subject,
        mail.body,
        mail.status,
        mail.error,
        new Date(mail.updatedAt).toLocaleDateString(),
      ])
    );
  }, [mails, searchTokens]);

  const sortedMails = useMemo(() => {
    const getValue = (mail: MailRecord) => {
      if (sortBy === "company") return mail.applicationId?.jobId?.jobCompany?.toLowerCase() ?? "";
      if (sortBy === "role") return mail.applicationId?.jobId?.jobProfile?.toLowerCase() ?? "";
      if (sortBy === "to") return mail.to.toLowerCase();
      if (sortBy === "subject") return mail.subject.toLowerCase();
      if (sortBy === "status") return mail.status.toLowerCase();
      return new Date(mail.updatedAt).getTime();
    };

    return [...filteredMails].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [filteredMails, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedMails.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch, globalQuery, sortBy, sortDir]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMails = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedMails.slice(start, start + PAGE_SIZE);
  }, [sortedMails, currentPage]);

  const handleSaveDraft = async () => {
    if (!previewMail) return;
    setSaving(true);
    setActionError(null);
    try {
      const updated = await updateMail(previewMail._id, {
        subject: previewMail.subject,
        body: previewMail.body,
      });

      setMails((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setPreviewMail(updated);
      setPreviewMail(null);
      toast.success("Draft saved successfully.");
    } catch {
      setActionError("Failed to save draft. Please try again.");
      toast.error("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!previewMail || previewMail.status === "SENT") return;

    setSendingMailId(previewMail._id);
    setActionError(null);
    try {
      const updated = await sendMail(previewMail._id);

      setMails((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setPreviewMail(updated);
      toast.success("Mail sent successfully.");
    } catch {
      setActionError("Failed to send mail. Please try again.");
      toast.error("Failed to send mail.");
    } finally {
      setSendingMailId(null);
    }
  };

  if (loading) {
    return <HourglassLoader label="Loading mails..." />;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mails</h1>
          <p className="mt-1 text-sm text-gray-500">Generated and sent job application emails.</p>
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
            placeholder="Search in Mails table..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        {globalQuery ? <span className="text-xs text-slate-500">Global filter: <span className="font-medium">{globalQuery}</span></span> : null}
      </div>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-2xl border border-white/45 bg-white/70 shadow-[0_16px_46px_rgba(76,48,160,0.14)] backdrop-blur-xl">
          {sortedMails.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No mails found for current search.</div>
          ) : (
            <>
              <table className="min-w-275 w-full text-sm">
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
                      <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("to")}>
                        To <span className="text-xs text-gray-500">{sortIndicator("to")}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("subject")}>
                        Subject <span className="text-xs text-gray-500">{sortIndicator("subject")}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">Preview</th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("status")}>
                        Status <span className="text-xs text-gray-500">{sortIndicator("status")}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button className="inline-flex items-center gap-1 font-medium hover:underline" onClick={() => handleSort("updatedAt")}>
                        Updated <span className="text-xs text-gray-500">{sortIndicator("updatedAt")}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">Application</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMails.map((mail) => (
                    <tr key={mail._id} className="border-t border-white/55 transition hover:bg-white/55">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-indigo-500" />
                          {mail.applicationId?.jobId?.jobCompany ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          {mail.applicationId?.jobId?.jobProfile ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <AtSign className="h-4 w-4 text-violet-500" />
                          {mail.to}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <MailOpen className="h-4 w-4 text-cyan-500" />
                          <span className="line-clamp-2">{mail.subject}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setActionError(null);
                            setPreviewMail(mail);
                          }}
                          className="text-sm flex justify-center items-center gap-0.5 text-blue-700 cursor-pointer hover:text-blue-900 hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-bold ${
                            mail.status === "SENT"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {mail.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          {new Date(mail.updatedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {mail.applicationId?._id ? (
                          <Link
                            href={`/applications/${mail.applicationId._id}`}
                            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Open
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedMails.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid auto-rows-fr grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedMails.map((mail) => (
              <DataRowCard
                key={mail._id}
                title={mail.applicationId?.jobId?.jobCompany ?? "N/A"}
                subtitle={mail.applicationId?.jobId?.jobProfile ?? "N/A"}
                icon={<Building2 className="h-4 w-4" />}
                fieldsColumns={1}
                className="h-full"
                badge={
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-bold ${
                      mail.status === "SENT"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {mail.status}
                  </span>
                }
                fields={[
                  {
                    label: "To",
                    value: (
                      <span className="inline-flex items-center gap-2">
                        <AtSign className="h-4 w-4 text-violet-500" />
                        {mail.to}
                      </span>
                    ),
                  },
                  {
                    label: "Subject",
                    value: (
                      <span className="inline-flex items-center gap-2">
                        <MailOpen className="h-4 w-4 text-cyan-500" />
                        <span className="line-clamp-2">{mail.subject}</span>
                      </span>
                    ),
                  },
                  {
                    label: "Updated",
                    value: (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        {new Date(mail.updatedAt).toLocaleDateString()}
                      </span>
                    ),
                  },
                ]}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setActionError(null);
                        setPreviewMail(mail);
                      }}
                      className="text-sm flex justify-center items-center gap-0.5 text-blue-700 cursor-pointer hover:text-blue-900 hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    {mail.applicationId?._id ? (
                      <Link href={`/applications/${mail.applicationId._id}`} className="text-sm flex items-center justify-center gap-0.5 text-blue-700 hover:text-blue-900 hover:underline">
                        <Send className="h-3.5 w-3.5" /> Open
                      </Link>
                    ) : null}
                  </>
                }
              />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedMails.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {previewMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Mail Preview</h2>
              <button
                onClick={() => setPreviewMail(null)}
                className="cursor-pointer rounded-full p-1 text-gray-500 transition hover:bg-gray-500 hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4 text-sm">
              <div>
                <label className="font-medium">To</label>
                <div className="mt-1">{previewMail.to}</div>
              </div>

              <div>
                <label className="font-medium">Subject</label>
                <input
                  type="text"
                  value={previewMail.subject}
                  onChange={(e) =>
                    setPreviewMail({
                      ...previewMail,
                      subject: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium">Body</label>
                <textarea
                  value={previewMail.body}
                  onChange={(e) =>
                    setPreviewMail({
                      ...previewMail,
                      body: e.target.value,
                    })
                  }
                  className="mt-1 min-h-50 w-full rounded-md border p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-4">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="cursor-pointer rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>

              <button
                onClick={handleSend}
                disabled={previewMail.status === "SENT" || sendingMailId === previewMail._id}
                className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {previewMail.status === "SENT"
                  ? "Sent"
                  : sendingMailId === previewMail._id
                  ? "Sending..."
                  : "Send Mail"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

