import { api } from "../axios";
import { Application } from "@/types/application";

export async function fetchApplications(): Promise<Application[]> {
  const res = await api.get("/applications");
  return res.data.data ?? res.data;
}
