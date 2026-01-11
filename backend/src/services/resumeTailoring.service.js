import { generateResume } from "../ai/aiClient.js";

export async function tailorResume({ baseResumeText, jobDescriptionText }) {
  if (!baseResumeText || !jobDescriptionText) {
    throw new Error("INVALID_RESUME_INPUT");
  }

  return generateResume({ baseResumeText, jobDescriptionText });
}
