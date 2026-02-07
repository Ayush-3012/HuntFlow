import { Application } from "@/types/application";

export function calculateApplicationStats(apps: Application[]) {
  const total = apps.length;

  const awaiting = apps.filter(
    (a) => a.status === "Applied" || a.status === "Shortlisted"
  ).length;

  const interview = apps.filter((a) => a.status === "Interview").length;

  const rejected = apps.filter((a) => a.status === "Rejected").length;

  return {
    total,
    awaiting,
    interview,
    rejected,
  };
}
