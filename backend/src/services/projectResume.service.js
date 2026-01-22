import {
  rewriteProjectBullets,
  selectRelevantProjects,
} from "../ai/aiClient.js";
import projects from "../data/projects.json" with { type: "json" };

export const getJDAlignedProjects = async ({ jobDescriptionText }) => {
  const selectedProjectIds = await selectRelevantProjects({
    jobDescriptionText,
    projects,
  });

  const projectIds = safeParseProjectIds(selectedProjectIds);
  const selectedProjects = projects.filter((p) => projectIds.includes(p.id));
  const rewrittenProjects = [];

  for (const project of selectedProjects) {
    const rewrittenText = await rewriteProjectBullets({
      projectName: project.name,
      originalBullets: project.bullets,
      jobDescriptionText,
    });

    const rewrittenBullets = rewrittenText
      .split("\n")
      .map((b) => b.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    rewrittenProjects.push({
      ...project,
      bullets: rewrittenBullets,
    });
  }

  return rewrittenProjects;
};

function safeParseProjectIds(aiOutput) {
  try {
    const match = aiOutput.match(/\[[\s\S]*?\]/);
    if (!match) throw new Error();
    return JSON.parse(match[0]);
  } catch {
    throw new Error("INVALID_PROJECT_SELECTOR_OUTPUT");
  }
}
