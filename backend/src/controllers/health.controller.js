import { extractTextFromPdfBuffer } from "../utils/pdfTextExtractor.util.js";
import path from "path";
import { fetchFileFromURL } from "../utils/fetchFileBuffer.util.js";
import fs from "fs";
import { generateResumePdf } from "../services/resumePdfGenerator.service.js";
import { tailorResume } from "../services/tailorResume.service.js";
import { userProfile } from "../data/userProfile.js";

export const healthController = async (req, res) => {
  const resumeUrl =
    "https://drive.google.com/uc?export=download&id=1M8dWuZIHMUj3jVVB2FimgYnIn7Wd4Hx3";

  const { jobDescriptionText } = req.body;

  const buffer = await fetchFileFromURL(resumeUrl);
  const baseResumeText = await extractTextFromPdfBuffer(buffer);

  const tailored = await tailorResume({ baseResumeText, jobDescriptionText });

  const pdfBuffer = await generateResumePdf({
    user: userProfile,
    overview: tailored.overview,
    experienceText: tailored.experienceText,
    projects: tailored.projects,
    educationText: tailored.educationText,
    skillsText: tailored.skillsText,
    certificationsText: tailored.certificationsText,
  });

  // const resumeDir = path.join(process.cwd(), "resumes");
  // if (!fs.existsSync(resumeDir)) {
  //   fs.mkdirSync(resumeDir);
  //   console.log("creatds");
  // }

  fs.writeFileSync("text-X.pdf", pdfBuffer);
  res.json({
    success: true,
    message: "pdf generated",
  });
};
