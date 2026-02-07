import { ResumeVersion } from "../models/resumeVersion.model.js";

export async function getNextResumeVersion(resumeId) {
  const lastVersion = await ResumeVersion.findOne({ resumeId })
    .sort({ createdAt: -1 })
    .lean();

  if (!lastVersion) return "v1";

  const lastNum = parseInt(lastVersion.version.replace("v", ""), 10);
  return `v${lastNum + 1}`;
}

export async function createResumeVersionService({
  resumeId,
  version,
  fileUrl,
}) {
  return ResumeVersion.create({
    resumeId,
    version,
    fileUrl,
  });
}
