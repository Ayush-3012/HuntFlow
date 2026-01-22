import { alignSkills, generateOverview } from "../ai/aiClient.js";
import {
  normalizeCertification,
  normalizeExperience,
  normalizeSkills,
  normalizeOverview,
} from "../utils/resumeNormalizer.util.js";
import {
  extractCertifications,
  extractEducation,
  extractExperience,
  extractSkills,
} from "../utils/resumeSectionExtractor.util.js";
import { getJDAlignedProjects } from "./projectResume.service.js";

export async function tailorResume({ baseResumeText, jobDescriptionText }) {
  if (!baseResumeText || !jobDescriptionText) {
    throw new Error("INVALID_RESUME_INPUT");
  }

  const experienceText = extractExperience(baseResumeText);
  const educationText = extractEducation(baseResumeText);
  const skillsText = extractSkills(baseResumeText);
  const certificationsText = extractCertifications(baseResumeText);

  let overview = "";
  let alignedSkills = skillsText;

  try {
    overview = await generateOverview({
      baseResumeText,
      jobDescriptionText,
    });
    console.log("✅ Generated overview");
  } catch (error) {
    console.error("❌ Overview generation failed:", error.message);
  }

  try {
    alignedSkills = await alignSkills({
      skillsText,
      jobDescriptionText,
    });
    console.log("✅ Aligned skills");
  } catch (error) {
    console.error("❌ Skills alignment failed:", error.message);
  }

  let projects = [];
  try {
    projects = await getJDAlignedProjects({
      jobDescriptionText,
    });
    console.log(`✅ Selected ${projects.length} projects`);
  } catch (error) {
    console.error("❌ Project selection failed:", error.message);
  }

  const normalizedCertification = normalizeCertification(certificationsText);
  const normalizedExperience = normalizeExperience(experienceText);
  const normalizedSkills = normalizeSkills(alignedSkills);
  const normalizedOverview = normalizeOverview(overview);

  return {
    overview: normalizedOverview,
    experienceText: normalizedExperience,
    projects,
    skillsText: normalizedSkills,
    educationText: educationText.trim(),
    certificationsText: normalizedCertification,
  };
}
