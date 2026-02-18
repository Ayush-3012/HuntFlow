"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  fetchApplicationById,
  updateApplicationStatus,
} from "@/lib/api/application";
import { Application, ApplicationStatus, TimelineEvent } from "@/types/application";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Rejected",
];

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const colors: Record<ApplicationStatus, string> = {
    Saved: "bg-gray-100 text-gray-700",
    Applied: "bg-blue-50 text-blue-700",
    Shortlisted: "bg-yellow-50 text-yellow-700",
    Interview: "bg-purple-50 text-purple-700",
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
  const [application, setApplication] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("Saved");
  const [suggestedStatus, setSuggestedStatus] = useState<ApplicationStatus | null>(null);
  const [suggestionReason, setSuggestionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((event) => ({
        id: event._id,
        label: formatEventLabel(event),
        timestamp: new Date(event.createdAt).toLocaleString(),
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
    } catch {
      setError("Unable to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading application...</div>;
  }

  if (error && !application) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  if (!application) {
    return <div className="p-6 text-sm text-red-600">Application not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            <span className="border px-3 py-2 rounded-lg text-sm text-gray-400 text-center">
              Resume Unavailable
            </span>
          )}
          <a
            href={application.jobId.jobLink}
            target="_blank"
            rel="noreferrer"
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-center"
          >
            Open Job Link
          </a>
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Status"}
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
        <h2 className="font-semibold mb-6">Application Timeline</h2>

        {timelineItems.length === 0 ? (
          <p className="text-sm text-gray-500">No timeline events yet.</p>
        ) : (
          <ul className="space-y-5">
            {timelineItems.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
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
