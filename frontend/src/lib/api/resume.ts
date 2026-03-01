import { api } from "../axios";
import { Resume, ResumeVersion } from "@/types/application";

export async function fetchResumes(): Promise<Resume[]> {
  const res = await api.get("/resumes");
  return res.data.data ?? res.data;
}

export async function fetchResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
  const res = await api.get(`/resumes/${resumeId}/versions`);
  return res.data.data ?? res.data;
}
