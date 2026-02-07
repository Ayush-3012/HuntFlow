import { Application } from "../models/application.model.js";

export async function createApplicationService({
  jobId,
  versionId,
  status = "Saved",
}) {
  return Application.create({
    jobId,
    versionId,
    status,
  });
}
