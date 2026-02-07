import { extractTextFromPdfBuffer } from "../utils/pdfTextExtractor.util.js";
import { fetchFileFromURL } from "../utils/fetchFileBuffer.util.js";
import { generateResumePdf } from "../services/resumePdfGenerator.service.js";
import { tailorResume } from "../services/tailorResume.service.js";
import { userProfile } from "../data/userProfile.js";
import { Resume } from "../models/resume.model.js";
import { getNextResumeVersion } from "../services/resumeVersion.service.js";
import { uploadResumePdf } from "../services/s3ResumeUpload.service.js";

export const healthController = async (req, res) => {
  const resumeUrl =
    "https://drive.google.com/uc?export=download&id=1M8dWuZIHMUj3jVVB2FimgYnIn7Wd4Hx3";

  const { jobDescriptionText } = req.body;

  const buffer = await fetchFileFromURL(resumeUrl);
  const baseResumeText = await extractTextFromPdfBuffer(buffer);

  console.log("✅ Tailoring Resume");
  const tailored = await tailorResume({ baseResumeText, jobDescriptionText });

  console.log("✅ Generating PDF");
  const pdfBuffer = await generateResumePdf({
    user: userProfile,
    overview: tailored.overview,
    experienceText: tailored.experienceText,
    projects: tailored.projects,
    educationText: tailored.educationText,
    skillsText: tailored.skillsText,
    certificationsText: tailored.certificationsText,
  });

  const mainResume = await Resume.find({});
  const resumeId = mainResume[0]._id.toString();

  console.log("✅ Getting Next resume Version");
  const version = await getNextResumeVersion(resumeId);

  console.log("✅ Uploading resume to aws");
  const fileUrl = await uploadResumePdf({
    resumeId,
    version,
    pdfBuffer,
  });

  console.log("✅ File Url of new generated resume");
  res.json({
    success: true,
    message: "Resume generated & stored",
    data: {
      fileUrl: fileUrl,
    },
  });
};
