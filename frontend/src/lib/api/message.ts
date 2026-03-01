import { api } from "../axios";
import { ColdMessageRecord } from "@/types/application";

export async function fetchMessages(
  applicationId?: string
): Promise<ColdMessageRecord[]> {
  const res = await api.get("/messages", {
    params: applicationId ? { applicationId } : undefined,
  });
  return res.data.data ?? res.data;
}

export async function fetchMessageById(
  messageId: string
): Promise<ColdMessageRecord> {
  const res = await api.get(`/messages/${messageId}`);
  return res.data.data ?? res.data;
}
