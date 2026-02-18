"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createJob, JobPayload } from "@/lib/api/job";

type FormErrors = Partial<Record<keyof JobPayload, string>>;

const INITIAL_FORM: JobPayload = {
  jobProfile: "",
  jobCompany: "",
  jobDescription: "",
  jobLink: "",
  domain: "",
};

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState<JobPayload>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createJob({
        jobProfile: form.jobProfile.trim(),
        jobCompany: form.jobCompany.trim(),
        jobDescription: form.jobDescription.trim(),
        jobLink: form.jobLink.trim(),
        domain: form.domain.trim(),
      });
      router.push("/jobs");
    } catch (error) {
      const fallback = "Failed to save job. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
      ) {
        setSubmitError((error as { response?: { data?: { message?: string } } }).response!.data!.message!);
      } else {
        setSubmitError(fallback);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Add New Job</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Save a job and track progress from the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white border rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Role"
              placeholder="Software Engineer"
              value={form.jobProfile}
              onChange={handleChange("jobProfile")}
              error={errors.jobProfile}
            />
            <Field
              label="Company"
              placeholder="Amazon"
              value={form.jobCompany}
              onChange={handleChange("jobCompany")}
              error={errors.jobCompany}
            />
            <Field
              label="Job Link"
              placeholder="https://company.com/jobs/123"
              value={form.jobLink}
              onChange={handleChange("jobLink")}
              error={errors.jobLink}
            />
            <Field
              label="Domain"
              placeholder="Fintech"
              value={form.domain}
              onChange={handleChange("domain")}
              error={errors.domain}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              value={form.jobDescription}
              onChange={handleChange("jobDescription")}
              placeholder="Paste full JD here..."
              className="w-full h-44 border rounded-lg p-3 text-sm"
            />
            {errors.jobDescription ? (
              <p className="text-xs text-red-600">{errors.jobDescription}</p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Job"}
          </button>
        </form>

        <div className="bg-white border rounded-xl p-6 space-y-4 h-fit">
          <h2 className="font-semibold">Quick Preview</h2>
          <PreviewRow label="Role" value={form.jobProfile} />
          <PreviewRow label="Company" value={form.jobCompany} />
          <PreviewRow label="Domain" value={form.domain} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg p-3 text-sm"
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">
        {value.trim() ? value : "-"}
      </p>
    </div>
  );
}
