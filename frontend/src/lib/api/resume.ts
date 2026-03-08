import { api } from "../axios";
import { Job, Resume, ResumeVersion } from "@/types/application";

export type ResumeVersionWithApplications = ResumeVersion & {
  applications?: Array<{
    _id: string;
    jobId?: Pick<Job, "jobCompany" | "jobProfile"> | null;
  }>;
};

export async function fetchResumes(): Promise<Resume[]> {
  const res = await api.get("/resumes");
  return res.data.data ?? res.data;
}

export async function fetchResumeVersions(
  resumeId: string
): Promise<ResumeVersionWithApplications[]> {
  const res = await api.get(`/resumes/${resumeId}/versions`);
  return res.data.data ?? res.data;
}
