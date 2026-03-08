import { api } from "../axios";
import { MailRecord, UpdateMailPayload } from "@/types/application";

export async function fetchMails(applicationId?: string): Promise<MailRecord[]> {
  const res = await api.get("/mails", {
    params: applicationId ? { applicationId } : undefined,
  });
  return res.data.data ?? res.data;
}

export async function fetchMailById(mailId: string): Promise<MailRecord> {
  const res = await api.get(`/mails/${mailId}`);
  return res.data.data ?? res.data;
}

export async function updateMail(mailId: string, payload: UpdateMailPayload): Promise<MailRecord> {
  const res = await api.put(`/mails/${mailId}`, payload)
  return res.data.data ?? res.data;
}

export async function sendMail(mailId: string): Promise<MailRecord> {
  const res = await api.post(`/mails/${mailId}/send`);
  return res.data.data ?? res.data;
}
