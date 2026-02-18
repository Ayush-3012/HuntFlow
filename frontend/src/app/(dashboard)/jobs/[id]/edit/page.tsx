"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchJobById, JobPayload, updateJob } from "@/lib/api/job";

type FormErrors = Partial<Record<keyof JobPayload, string>>;

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<JobPayload>({
    jobProfile: "",
    jobCompany: "",
    jobDescription: "",
    jobLink: "",
    domain: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    async function loadJob() {
      try {
        const job = await fetchJobById(params.id);
        setForm({
          jobProfile: job.jobProfile,
          jobCompany: job.jobCompany,
          jobDescription: job.jobDescription,
          jobLink: job.jobLink,
          domain: job.domain,
        });
      } catch {
        setError("Failed to load job for editing.");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadJob();
    }
  }, [params.id]);

  const handleChange =
    (field: keyof JobPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.jobProfile.trim()) nextErrors.jobProfile = "Role is required.";
    if (!form.jobCompany.trim()) nextErrors.jobCompany = "Company is required.";
    if (!form.jobDescription.trim()) {
      nextErrors.jobDescription = "Job description is required.";
    }
    if (!form.jobLink.trim()) nextErrors.jobLink = "Job link is required.";
    if (!form.domain.trim()) nextErrors.domain = "Domain is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!validate()) return;

    setSaving(true);
    try {
      await updateJob(params.id, {
        jobProfile: form.jobProfile.trim(),
        jobCompany: form.jobCompany.trim(),
        jobDescription: form.jobDescription.trim(),
        jobLink: form.jobLink.trim(),
        domain: form.domain.trim(),
      });
      router.push(`/jobs/${params.id}`);
    } catch {
      setError("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading edit form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Job</h1>
        <p className="text-sm text-gray-500 mt-1">Update job details and keep data fresh.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Role"
            value={form.jobProfile}
            onChange={handleChange("jobProfile")}
            error={errors.jobProfile}
          />
          <Field
            label="Company"
            value={form.jobCompany}
            onChange={handleChange("jobCompany")}
            error={errors.jobCompany}
          />
          <Field
            label="Job Link"
            value={form.jobLink}
            onChange={handleChange("jobLink")}
            error={errors.jobLink}
          />
          <Field
            label="Domain"
            value={form.domain}
            onChange={handleChange("domain")}
            error={errors.domain}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            value={form.jobDescription}
            onChange={handleChange("jobDescription")}
            className="w-full h-48 border rounded-lg p-3 text-sm"
          />
          {errors.jobDescription ? (
            <p className="text-xs text-red-600">{errors.jobDescription}</p>
          ) : null}
        </div>

        {error ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input value={value} onChange={onChange} className="w-full border rounded-lg p-3 text-sm" />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
