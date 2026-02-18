import { Job } from "@/types/application";
import { api } from "../axios";

export type JobPayload = Pick<
  Job,
  "jobProfile" | "jobCompany" | "jobDescription" | "jobLink" | "domain"
>;

export async function fetchJobs(): Promise<Job[]> {
  const res = await api.get("/jobs");
  return res.data.data ?? res.data;
}

export async function fetchJobById(jobId: string): Promise<Job> {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data.data ?? res.data;
}

export async function createJob(payload: JobPayload): Promise<Job> {
  const res = await api.post("/jobs", payload);
  return res.data.data ?? res.data;
}

export async function updateJob(jobId: string, payload: JobPayload): Promise<Job> {
  const res = await api.put(`/jobs/${jobId}`, payload);
  return res.data.data ?? res.data;
}
