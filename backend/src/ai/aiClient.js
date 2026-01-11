import { generateText } from "./openrouter.client.js";

export const generateResume = async ({
  baseResumeText,
  jobDescriptionText,
}) => {
  const prompt = `
You are a resume tailoring assistant.

Your task:
- Read the BASE RESUME provided below.
- Read the JOB DESCRIPTION provided below.
- Create a NEW TAILORED RESUME that matches the job description.

STRICT RULES:
- Use ONLY information present in the base resume.
- Do NOT invent skills, experience, numbers, or achievements.
- Do NOT add new companies, roles, or certifications.
- You may rephrase, reorder, or emphasize existing content.
- Remove or de-emphasize content that is clearly irrelevant to the job description.

OUTPUT FORMAT:
- Return ONLY the full tailored resume text.
- No explanations.
- No markdown.
- No commentary.

BASE RESUME:
<<<
${baseResumeText}
>>>

JOB DESCRIPTION:
<<<
${jobDescriptionText}
>>>
`;

  return generateText({
    system: "You are a professional resume writer.",
    prompt,
  });
};

export const generateMail = async (input) => {
  return generateText({
    system: "You write professional recruitment emails",
    prompt: input,
  });
};

export const generateColdMessage = async (input) => {
  return generateText({
    system: "You write short LinkedIn cold outreach messages.",
    prompt: input,
  });
};
