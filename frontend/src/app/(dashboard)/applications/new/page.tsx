"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateApplicationWithAI, GeneratedApplicationResult } from "@/lib/api/application";
import { fetchJobs } from "@/lib/api/job";
import { fetchResumes } from "@/lib/api/resume";
import { Job, Resume } from "@/types/application";
import HourglassLoader from "@/components/ui/hourglass-loader";
import { toast } from "@/lib/toast";

export default function GenerateApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobId, setJobId] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedApplicationResult | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [jobsData, resumesData] = await Promise.all([fetchJobs(), fetchResumes()]);

        const latestFirstJobs = [...jobsData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setJobs(latestFirstJobs);
        setResumes(resumesData);

        if (resumesData.length === 1) {
          setResumeId(resumesData[0]._id);
        }

        const preselectedJobId = searchParams.get("jobId");
        if (preselectedJobId && latestFirstJobs.some((job) => job._id === preselectedJobId)) {
          setJobId(preselectedJobId);
        }
      } catch {
        setError("Failed to load jobs or resumes.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!jobId || !resumeId) {
      setError("Please select both job and resume.");
      toast.error("Please select both job and resume.");
      return;
    }

    setSubmitting(true);
    try {
      const generated = await generateApplicationWithAI({ jobId, resumeId });
      setResult(generated);
      toast.success("Application generated successfully.");
    } catch {
      setError("Failed to generate AI application.");
      toast.error("Failed to generate AI application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <HourglassLoader label="Loading form..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Generate AI Application</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a job and base resume to generate tailored application assets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Job</label>
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a job</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.jobCompany} - {job.jobProfile}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Resume</label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              disabled={resumes.length === 1}
              className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-600"
            >
              {resumes.length > 1 ? <option value="">Select a resume</option> : null}
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="bg-linear-to-r from-indigo-600 to-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
        >
          {submitting ? "Generating..." : "Generate Application"}
        </button>
      </form>

      {result ? (
        <div className="bg-white border rounded-xl p-6 space-y-3">
          <h2 className="font-semibold">Generated Output</h2>
          <p className="text-base text-gray-700">
            Application created:{" "}
            <button
              onClick={() => router.push(`/applications/${result.applicationId}`)}
              className="bg-linear-to-r from-indigo-600 to-blue-600 text-white cursor-pointer px-2 py-1 rounded-lg text-sm hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
            >
              Open Application
            </button>
          </p>
          <p className="text-base text-gray-700">
            Resume version: <span className="font-medium">{result.resumeVersion.version}</span>:{" "}
             <a
            href={result.resumeVersion.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-linear-to-r from-indigo-600 to-blue-600 text-white cursor-pointer px-2 py-1 rounded-lg text-sm hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
          >
            Download Generated Resume PDF
          </a>
          </p>
         
          {result.mailDraft ? (
            <p className="text-base mt-2 text-gray-700">Mail draft created for {result.mailDraft.to}</p>
          ) : (
            <p className="text-base mt-2 text-gray-500">No mail draft generated.</p>
          )}
          {result.coldMessage ? (
            <div className="bg-gray-50 border rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Cold Message</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {result.coldMessage.message}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}



