import { api } from "../axios";
import {
  Application,
  ApplicationStatus,
  ColdMessageRecord,
  MailRecord,
  StatusSuggestion,
  TimelineEvent,
} from "@/types/application";

export async function fetchApplications(): Promise<Application[]> {
  const res = await api.get("/applications");
  return res.data.data ?? res.data;
}

export type ApplicationDetail = {
  application: Application;
  timeline: TimelineEvent[];
  suggestedStatus: StatusSuggestion | null;
  latestMail: MailRecord | null;
  latestColdMessage: ColdMessageRecord | null;
};

export async function fetchApplicationById(
  applicationId: string
): Promise<ApplicationDetail> {
  const res = await api.get(`/applications/${applicationId}`);
  return res.data.data ?? res.data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<Application> {
  const res = await api.put(`/applications/${applicationId}/status`, { status });
  return res.data.data ?? res.data;
}

export async function deleteApplication(
  applicationId: string
): Promise<{ applicationId: string }> {
  const res = await api.delete(`/applications/${applicationId}`);
  return res.data.data ?? res.data;
}

export type GeneratedApplicationResult = {
  applicationId: string;
  resumeVersion: {
    id: string;
    version: string;
    fileUrl: string;
  };
  mailDraft: {
    _id: string;
    to: string;
    subject: string;
    body: string;
  } | null;
  coldMessage: ColdMessageRecord | null;
};

export async function generateApplicationWithAI(payload: {
  jobId: string;
  resumeId: string;
}): Promise<GeneratedApplicationResult> {
  const res = await api.post("/main/generate", payload);
  return res.data.data ?? res.data;
}

