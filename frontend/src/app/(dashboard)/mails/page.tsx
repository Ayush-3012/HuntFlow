"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchMails, sendMail, updateMail } from "@/lib/api/mail";
import { MailRecord } from "@/types/application";
import { X } from "lucide-react";
import SortIndicator from "@/components/ui/sort-indicator";
import HourglassLoader from "@/components/ui/hourglass-loader";
import { toast } from "@/lib/toast";

type MailSortKey =
  | "company"
  | "role"
  | "to"
  | "subject"
  | "status"
  | "updatedAt";

export default function MailsPage() {
  const [mails, setMails] = useState<MailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewMail, setPreviewMail] = useState<MailRecord | null>(null);
  const [sortBy, setSortBy] = useState<MailSortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const sortedMails = useMemo(() => {
    const getValue = (mail: MailRecord) => {
      if (sortBy === "company")
        return mail.applicationId?.jobId?.jobCompany?.toLowerCase() ?? "";
      if (sortBy === "role")
        return mail.applicationId?.jobId?.jobProfile?.toLowerCase() ?? "";
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
      <div>
        <h1 className="text-2xl font-semibold">Mails</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generated and sent job application emails.
        </p>
      </div>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        {sortedMails.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No mails found.</div>
        ) : (
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("company")}>Company <span className="text-xs text-gray-500">{sortIndicator("company")}</span></button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("role")}>Role <span className="text-xs text-gray-500">{sortIndicator("role")}</span></button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("to")}>To <span className="text-xs text-gray-500">{sortIndicator("to")}</span></button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("subject")}>Subject <span className="text-xs text-gray-500">{sortIndicator("subject")}</span></button>
                </th>
                <th className="px-6 py-3 text-left">Preview</th>
                <th className="px-6 py-3 text-left">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("status")}>Status <span className="text-xs text-gray-500">{sortIndicator("status")}</span></button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="font-medium hover:underline inline-flex items-center gap-1" onClick={() => handleSort("updatedAt")}>Updated <span className="text-xs text-gray-500">{sortIndicator("updatedAt")}</span></button>
                </th>
                <th className="px-6 py-3 text-left">Application</th>
              </tr>
            </thead>
            <tbody>
              {sortedMails.map((mail) => (
                <tr key={mail._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {mail.applicationId?.jobId?.jobCompany ?? "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {mail.applicationId?.jobId?.jobProfile ?? "N/A"}
                  </td>
                  <td className="px-6 py-4">{mail.to}</td>
                  <td className="px-6 py-4">{mail.subject}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setActionError(null);
                        setPreviewMail(mail);
                      }}
                      className="text-blue-600 cursor-pointer hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-md ${
                        mail.status === "SENT"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {mail.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(mail.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {mail.applicationId?._id ? (
                      <Link
                        href={`/applications/${mail.applicationId._id}`}
                        className="text-blue-600 hover:underline"
                      >
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
        )}
      </div>

      {previewMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Mail Preview</h2>
              <button
                onClick={() => setPreviewMail(null)}
                className="text-gray-500 cursor-pointer hover:text-white hover:bg-gray-500 transition rounded-full p-1"
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
                  className="mt-1 w-full border rounded-md px-3 py-2"
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
                  className="mt-1 w-full min-h-[200px] border rounded-md p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-4">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="px-4 py-2 text-sm border rounded-md cursor-pointer hover:bg-gray-50"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>

              <button
                onClick={handleSend}
                disabled={
                  previewMail.status === "SENT" ||
                  sendingMailId === previewMail._id
                }
                className="px-4 py-2 text-sm bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
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





