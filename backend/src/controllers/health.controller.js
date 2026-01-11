import { extractTextFromPdfBuffer } from "../utils/pdfTextExtractor.util.js";
import { tailorResume } from "../services/resumeTailoring.service.js";
import { fetchFileFromURL } from "../utils/fetchFileBuffer.util.js";

export const healthController = async (req, res) => {
  // const resumeUrl =
  //   "https://drive.google.com/uc?export=download&id=1M8dWuZIHMUj3jVVB2FimgYnIn7Wd4Hx3";

  // const { jobDescription } = req.body;

  // const buffer = await fetchFileFromURL(resumeUrl);
  // const baseResumeText = await extractTextFromPdfBuffer(buffer);

  // const tailoredResumeText = await tailorResume({
  //   baseResumeText,
  //   jobDescriptionText: jobDescription,
  // });

  // res.json({
  //   success: true,
  //   tailoredResumeText,
  // });
};
