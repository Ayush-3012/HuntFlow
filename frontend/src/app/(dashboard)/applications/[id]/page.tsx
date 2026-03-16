"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  deleteApplication,
  fetchApplicationById,
  updateApplicationStatus,
  type ApplicationDetail,
} from "@/lib/api/application";
import { Application, ApplicationStatus, TimelineEvent } from "@/types/application";
import HourglassLoader from "@/components/ui/hourglass-loader";
import { toast } from "@/lib/toast";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Rejected",
];

type PreviewType = "mail" | "message" | null;

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const colors: Record<ApplicationStatus, string> = {
    Saved: "bg-gray-100 text-gray-700",
    Applied: "bg-blue-50 text-blue-700",
    Shortlisted: "bg-yellow-50 text-yellow-700",
    Interviewed: "bg-purple-50 text-purple-700",
    Rejected: "bg-red-50 text-red-700",
    Selected: "bg-green-50 text-green-700",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-md font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("Saved");
  const [suggestedStatus, setSuggestedStatus] = useState<ApplicationStatus | null>(null);
  const [suggestionReason, setSuggestionReason] = useState<string | null>(null);
  const [latestMail, setLatestMail] = useState<ApplicationDetail["latestMail"]>(null);
  const [latestColdMessage, setLatestColdMessage] = useState<ApplicationDetail["latestColdMessage"]>(null);
  const [previewType, setPreviewType] = useState<PreviewType>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const detail = await fetchApplicationById(params.id);
        setApplication(detail.application);
        setTimeline(detail.timeline ?? []);
        setSelectedStatus(detail.application.status);
        setSuggestedStatus(detail.suggestedStatus?.status ?? null);
        setSuggestionReason(detail.suggestedStatus?.reason ?? null);
        setLatestMail(detail.latestMail ?? null);
        setLatestColdMessage(detail.latestColdMessage ?? null);
      } catch {
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      load();
    }
  }, [params.id]);

  const timelineItems = useMemo(() => {
    return [...timeline]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((event) => ({
        id: event._id,
        label: formatEventLabel(event),
        timestamp: new Date(event.createdAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      }));
  }, [timeline]);

  const handleStatusUpdate = async () => {
    if (!application || selectedStatus === application.status) return;

    setUpdating(true);
    setError(null);
    try {
      await updateApplicationStatus(application._id, selectedStatus);
      const detail = await fetchApplicationById(application._id);
      setApplication(detail.application);
      setTimeline(detail.timeline ?? []);
      setSelectedStatus(detail.application.status);
      setSuggestedStatus(detail.suggestedStatus?.status ?? null);
      setSuggestionReason(detail.suggestedStatus?.reason ?? null);
      setLatestMail(detail.latestMail ?? null);
      setLatestColdMessage(detail.latestColdMessage ?? null);
      toast.success("Application status updated.");
    } catch {
      setError("Unable to update status. Please try again.");
      toast.error("Unable to update application status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!application || deleting) return;
    const shouldDelete = window.confirm(
      "Delete this application and all related data (mails/messages/timeline + linked resume version if unused)?",
    );
    if (!shouldDelete) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteApplication(application._id);
      toast.success("Application deleted successfully.");
      router.push("/dashboard");
    } catch {
      setError("Unable to delete application. Please try again.");
      toast.error("Unable to delete application.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <HourglassLoader label="Loading application..." />;
  }

  if (error && !application) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  if (!application) {
    return <div className="p-6 text-sm text-red-600">Application not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {application.jobId.jobCompany} - {application.jobId.jobProfile}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Last updated {new Date(application.updatedAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <Link
            href={`/jobs/${application.jobId._id}`}
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-center"
          >
            View Job
          </Link>

          {application.versionId?.fileUrl ? (
            <a
              href={application.versionId.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-center"
            >
              View Resume
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="border px-3 py-2 rounded-lg text-sm text-gray-400 text-center cursor-not-allowed"
            >
              View Resume
            </button>
          )}

          <a
            href={application.jobId.jobLink}
            target="_blank"
            rel="noreferrer"
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-center"
          >
            Open Job Link
          </a>

          <button
            type="button"
            onClick={() => setPreviewType("mail")}
            disabled={!latestMail}
            className="border px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 text-center disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            View Mail
          </button>

          <button
            type="button"
            onClick={() => setPreviewType("message")}
            disabled={!latestColdMessage}
            className="border px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 text-center disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            View Message
          </button>
        </div>

        <div className="border-t pt-4 space-y-3">
          <h2 className="font-semibold text-sm">Update Status</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
              className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === application.status}
              className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-white bg-red-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete Application"}
            </button>
          </div>
          {suggestedStatus ? (
            <p className="text-xs text-gray-600">
              Suggested: <span className="font-medium">{suggestedStatus}</span>
              {suggestionReason ? ` - ${suggestionReason}` : ""}
            </p>
          ) : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold">Application Timeline</h2>
          <span className="text-xs text-gray-500">Latest first</span>
        </div>

        {timelineItems.length === 0 ? (
          <p className="text-sm text-gray-500">No timeline events yet.</p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <ul className="flex min-w-max">
              {timelineItems.map((item, index) => (
                <li key={item.id} className="relative w-72 shrink-0 pr-6">
                  {index !== timelineItems.length - 1 ? (
                    <span className="absolute left-5 right-0 top-4 h-0.5 bg-blue-200" />
                  ) : null}

                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.04 }}
                    className="rounded-lg border border-blue-100 bg-blue-50/40 p-3"
                  >
                    <div className="mb-2 flex items-start gap-2">
                      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      <p className="line-clamp-2 text-sm text-gray-700">{item.label}</p>
                    </div>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {previewType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="font-semibold">
                {previewType === "mail" ? "Mail Preview" : "Message"}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewType(null)}
                className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-full cursor-pointer transition p-1"
              >
                <X />
              </button>
            </div>

            <div className="p-5 text-sm space-y-3">
              {previewType === "mail" && latestMail ? (
                <>
                  <p>
                    <span className="font-medium">To:</span> {latestMail.to}
                  </p>
                  <p>
                    <span className="font-medium">Subject:</span> {latestMail.subject}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {latestMail.status}
                  </p>
                  <div className="max-h-[55vh] overflow-auto whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-gray-700">
                    {latestMail.body}
                  </div>
                </>
              ) : null}

              {previewType === "message" && latestColdMessage ? (
                <div className="max-h-[65vh] overflow-auto whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-gray-700">
                  {latestColdMessage.message}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatEventLabel(event: TimelineEvent) {
  if (event.type === "APPLICATION_CREATED") return "Application created.";
  if (event.type === "STATUS_UPDATED") {
    const to = typeof event.payload?.to === "string" ? event.payload.to : "updated";
    return `Status changed to ${to}.`;
  }
  if (event.type === "RESUME_VERSION_UPDATED") return "Resume version updated.";
  if (event.type === "MAIL_DRAFT_CREATED") return "Mail draft created.";
  if (event.type === "MAIL_SENT") return "Application mail sent.";
  if (event.type === "MAIL_FAILED") return "Mail send failed.";
  if (event.type === "MAIL_RECEIVED") return "Mail reply received.";
  if (event.type === "NOTE_ADDED") return "Note added.";
  return event.type;
}





