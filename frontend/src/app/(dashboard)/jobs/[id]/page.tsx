"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { fetchJobById } from "@/lib/api/job";
import { Job } from "@/types/application";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await fetchJobById(params.id);
        setJob(data);
      } catch {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadJob();
    }
  }, [params.id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading job details...</div>;
  }

  if (error || !job) {
    return <div className="p-6 text-sm text-red-600">{error ?? "Job not found."}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{job.jobProfile}</h1>
          <p className="text-sm text-gray-500 mt-1">{job.jobCompany}</p>
        </div>
        <Link
          href={`/jobs/${job._id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Edit Job
        </Link>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-5">
        <InfoRow label="Company" value={job.jobCompany} />
        <InfoRow label="Role" value={job.jobProfile} />
        <InfoRow label="Domain" value={job.domain} />
        <InfoRow
          label="Job Link"
          value={
            <a href={job.jobLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              {job.jobLink}
            </a>
          }
        />
        <InfoRow
          label="Created"
          value={new Date(job.createdAt).toLocaleString()}
        />
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-2">
        <h2 className="font-semibold">Job Description</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.jobDescription}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="text-sm text-gray-900 mt-1">{value}</div>
    </div>
  );
}
