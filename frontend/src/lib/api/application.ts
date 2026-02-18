import { api } from "../axios";
import {
  Application,
  ApplicationStatus,
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
