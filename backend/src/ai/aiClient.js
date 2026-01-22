import { generateText } from "./openrouter.client.js";

export const generateOverview = async ({
  baseResumeText,
  jobDescriptionText,
}) => {
  const prompt = `
You are writing a professional resume summary.

TASK:
Write a concise professional overview (3-4 sentences, maximum 80 words).

STRICT RULES:
- Use ONLY information from the base resume.
- Do NOT invent experience, skills, or achievements.
- Do NOT mention company names explicitly.
- Align tone and focus with the job description.
- Keep it concise and professional.

BASE RESUME:
<<<
${baseResumeText}
>>>

JOB DESCRIPTION:
<<<
${jobDescriptionText}
>>>

OUTPUT FORMAT:
- Return ONLY the summary text
- No markdown, no quotes, no preamble
- 3-4 sentences maximum
- Plain text only
`;

  return generateText({
    system: "You write professional resume summaries. Output plain text only.",
    prompt,
  });
};

export const alignSkills = async ({ skillsText, jobDescriptionText }) => {
  const prompt = `
You are aligning resume skills with a job description.

TASK:
Reorder and group the skills to better match the job description.

STRICT RULES:
- Use ONLY the provided skills text.
- Do NOT add new skills.
- Do NOT add experience ranges.
- Do NOT remove any skills.
- Do NOT rename skills.
- Do NOT infer responsibilities.
- Do NOT add notes, explanations, or commentary.
- Do NOT mention job relevance or irrelevance.
- Do NOT add sentences or paragraphs.
- Output ONLY skill categories with their skills.
- Only reorder or group existing skills.
- Keep output concise and readable.

CURRENT SKILLS:
<<<
${skillsText}
>>>

JOB DESCRIPTION:
<<<
${jobDescriptionText}
>>>

OUTPUT FORMAT:
- Plain text only
- Comma or line separated
- No markdown
- No explanations
`;

  return generateText({
    system: "You align resume skills for job relevance.",
    prompt,
  });
};

export const selectRelevantProjects = async ({
  jobDescriptionText,
  projects,
}) => {
  const prompt = `
You are an assistant that selects the most relevant software projects for a job application.

TASK:
- Read the JOB DESCRIPTION.
- Review the AVAILABLE PROJECTS.
- Select the TOP 2 or 3 most relevant projects for this job.

STRICT RULES:
- Select ONLY from the provided projects.
- Do NOT invent new projects.
- Do NOT modify project details.
- Do NOT explain your choice.
- Return ONLY a valid JSON array of project IDs.
- Return a maximum of 3 project IDs.

JOB DESCRIPTION:
<<<
${jobDescriptionText}
>>>

AVAILABLE PROJECTS:
${projects
  .map(
    (p) =>
      `- ID: ${p.id}, Type: ${p.type.join(
        ", ",
      )}, Tech: ${p.techStack.join(", ")}`,
  )
  .join("\n")}
`;

  return generateText({
    system: "You select relevant projects for resumes.",
    prompt,
  });
};

export const rewriteProjectBullets = async ({
  projectName,
  originalBullets,
  jobDescriptionText,
}) => {
  const prompt = `
You are improving resume project descriptions.

PROJECT NAME:
${projectName}

ORIGINAL BULLETS:
${originalBullets.map((b) => `- ${b}`).join("\n")}

JOB DESCRIPTION:
<<<
${jobDescriptionText}
>>>

TASK:
Rewrite the project bullets to better match the job description.

STRICT RULES:
- Do NOT add new features.
- Do NOT add new technologies.
- Do NOT add metrics, numbers, or scale.
- Do NOT change the meaning of the bullets.
- Improve clarity, wording, and relevance only.
- Return 3–4 bullet points.

OUTPUT FORMAT:
- Plain text bullets only
- One bullet per line
- No explanations
- No markdown
`;

  return generateText({
    system: "You rewrite project bullets safely for resumes.",
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
