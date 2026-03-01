"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchMails, sendMail } from "@/lib/api/mail";
import { MailRecord } from "@/types/application";

type MailSortKey = "company" | "role" | "to" | "subject" | "status" | "updatedAt";

export default function MailsPage() {
  const [mails, setMails] = useState<MailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [previewMail, setPreviewMail] = useState<MailRecord | null>(null);
  const [sortBy, setSortBy] = useState<MailSortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortIndicator = (key: MailSortKey) => {
    if (sortBy !== key) return "↕";
    return sortDir === "asc" ? "▲" : "▼";
  };

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

  const handleSort = (key: MailSortKey) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDir("asc");
  };

  const sortedMails = useMemo(() => {
    const getValue = (mail: MailRecord) => {
      if (sortBy === "company") return mail.applicationId?.jobId?.jobCompany?.toLowerCase() ?? "";
      if (sortBy === "role") return mail.applicationId?.jobId?.jobProfile?.toLowerCase() ?? "";
      if (sortBy === "to") return mail.to.toLowerCase();
      if (sortBy === "subject") return mail.subject.toLowerCase();
      if (sortBy === "status") return mail.status.toLowerCase();
      return new Date(mail.updatedAt).getTime();
    };

    return [...mails].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      if (aValue === bValue) return 0;
      const result = aValue > bValue ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
  }, [mails, sortBy, sortDir]);

  const handleSend = async (mail: MailRecord) => {
    if (mail.status === "SENT" || sendingMailId) return;
    setActionError(null);
    setSendingMailId(mail._id);
    try {
      const updated = await sendMail(mail._id);
      setMails((prev) =>
        prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)),
      );
    } catch {
      setActionError("Unable to send mail. Please try again.");
    } finally {
      setSendingMailId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading mails...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mails</h1>
        <p className="text-sm text-gray-500 mt-1">Generated and sent job application emails.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        {actionError ? (
          <div className="px-6 pt-4 text-sm text-red-600">{actionError}</div>
        ) : null}
        {sortedMails.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No mails found.</div>
        ) : (
          <table className="w-full text-sm min-w-[1150px]">
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
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("to")}>
                    To <span className="text-xs text-gray-500">{sortIndicator("to")}</span>
                  </button>
                </th>
                <th className="text-left px-6 py-3">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("subject")}>
                    Subject <span className="text-xs text-gray-500">{sortIndicator("subject")}</span>
                  </button>
                </th>
                <th className="text-left px-6 py-3">Body</th>
                <th className="text-left px-6 py-3">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("status")}>
                    Status <span className="text-xs text-gray-500">{sortIndicator("status")}</span>
                  </button>
                </th>
                <th className="text-left px-6 py-3">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("updatedAt")}>
                    Updated <span className="text-xs text-gray-500">{sortIndicator("updatedAt")}</span>
                  </button>
                </th>
                <th className="text-left px-6 py-3">Application</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMails.map((mail) => (
                <tr key={mail._id} className="border-t hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 font-medium">{mail.applicationId?.jobId?.jobCompany ?? "N/A"}</td>
                  <td className="px-6 py-4">{mail.applicationId?.jobId?.jobProfile ?? "N/A"}</td>
                  <td className="px-6 py-4">{mail.to}</td>
                  <td className="px-6 py-4">{mail.subject}</td>
                  <td className="px-6 py-4 max-w-[380px]">
                    <p className="text-gray-700 line-clamp-3">{mail.body}</p>
                    <button
                      type="button"
                      onClick={() => setPreviewMail(mail)}
                      className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                      View full
                    </button>
                  </td>
                  <td className="px-6 py-4">{mail.status}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(mail.updatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {mail.applicationId?._id ? (
                      <Link href={`/applications/${mail.applicationId._id}`} className="text-blue-600 hover:underline">
                        Open
                      </Link>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleSend(mail)}
                      disabled={mail.status === "SENT" || sendingMailId === mail._id}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sendingMailId === mail._id ? "Sending..." : mail.status === "SENT" ? "Sent" : "Send"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {previewMail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Mail Preview</h2>
              <button
                type="button"
                onClick={() => setPreviewMail(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <p>
                <span className="font-medium">To:</span> {previewMail.to}
              </p>
              <p>
                <span className="font-medium">Subject:</span> {previewMail.subject}
              </p>
              <p>
                <span className="font-medium">Status:</span> {previewMail.status}
              </p>
              <div>
                <p className="font-medium mb-1">Body:</p>
                <p className="whitespace-pre-wrap text-gray-700 max-h-[50vh] overflow-y-auto pr-1">
                  {previewMail.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
