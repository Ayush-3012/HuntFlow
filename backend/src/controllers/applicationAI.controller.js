import { Job } from "../models/job.model.js";

import { fetchFileFromURL } from "../utils/fetchFileBuffer.util.js";
import { extractTextFromPdfBuffer } from "../utils/pdfTextExtractor.util.js";

import { tailorResume } from "../services/tailorResume.service.js";
import { generateResumePdf } from "../services/resumePdfGenerator.service.js";
import { uploadResumePdf } from "../services/s3ResumeUpload.service.js";
import {
  createResumeVersionService,
  getNextResumeVersion,
} from "../services/resumeVersion.service.js";

import { createTimelineEvent } from "./timeline.controller.js";
import { successResponse } from "../utils/response.util.js";
import { userProfile } from "../data/userProfile.js";

import { createApplicationService } from "../services/application.service.js";
import { createMailDraftService } from "../services/mailDraft.service.js";
import { ColdMessage } from "../models/message.model.js";
import { extractEmailFromText } from "../utils/extractEmail.util.js";
import { generateColdMessage, generateMail } from "../ai/aiClient.js";
import { Resume } from "../models/resume.model.js";

// const BASE_RESUME_URL = "https://drive.google.com/uc?export=download&id=1daaNOO3pvsgkatOS8B5TyHVrypHv1SBu";
const BASE_RESUME_URL =
  "https://drive.google.com/uc?export=download&id=1M8dWuZIHMUj3jVVB2FimgYnIn7Wd4Hx3";

export const generateApplicationWithAI = async (req, res, next) => {
  try {
    const { jobId, resumeId } = req.body;

    if (!jobId || !resumeId) {
      const error = new Error("jobId and resumeId are required");
      error.statusCode = 400;
      throw error;
    }

    // 1️⃣ Fetch Job
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    // 2️⃣ Resume Check
    const resume = await Resume.findById(resumeId)
    if (!resume) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    // 3️⃣ Extract base resume text
    const resumeBuffer = await fetchFileFromURL(BASE_RESUME_URL);
    const baseResumeText = await extractTextFromPdfBuffer(resumeBuffer);

    // 4️⃣ AI Resume Tailoring
    const tailoredResume = await tailorResume({
      baseResumeText,
      jobDescriptionText: job.jobDescription,
    });

    // 5️⃣ Generate PDF
    const pdfBuffer = await generateResumePdf({
      user: userProfile,
      overview: tailoredResume.overview,
      experienceText: tailoredResume.experienceText,
      projects: tailoredResume.projects,
      educationText: tailoredResume.educationText,
      skillsText: tailoredResume.skillsText,
      certificationsText: tailoredResume.certificationsText,
    });

    // 6️⃣ Resume Version
    const version = await getNextResumeVersion(resumeId);

    // 7️⃣ Upload PDF to S3
    const fileUrl = await uploadResumePdf({
      resumeId,
      version,
      pdfBuffer,
    });

    // 8️⃣ Create ResumeVersion
    const resumeVersion = await createResumeVersionService({
      resumeId,
      version,
      fileUrl,
    });

    // 9️⃣ Create Application
    const application = await createApplicationService({
      jobId,
      versionId: resumeVersion._id,
    });

    // 🔁 Timeline event (async, non-blocking)
    createTimelineEvent({
      applicationId: application._id,
      type: "APPLICATION_CREATED",
      payload: {
        jobId,
        resumeId,
        version,
      },
    }).catch(console.error);

    const recruiterEmail = extractEmailFromText(job.jobDescription);
    let mailDraft = null;
    let coldMessage = null;

    if (recruiterEmail) {
      const mailBody = await generateMail({
        jobProfile: job.jobProfile,
        jobCompany: job.jobCompany,
        overview: tailoredResume.overview,
        resumeUrl: fileUrl,
      });

      mailDraft = await createMailDraftService({
        applicationId: application._id,
        to: recruiterEmail,
        subject: `Application for ${job.jobProfile} role`,
        body: mailBody.trim(),
      });

      createTimelineEvent({
        applicationId: application._id,
        type: "MAIL_DRAFT_CREATED",
        payload: {
          to: recruiterEmail
        },
      }).catch(console.error);
    }
    const generatedColdMessage = await generateColdMessage({
      jobProfile: job.jobProfile,
      jobCompany: job.jobCompany,
      overview: tailoredResume.overview,
    });

    if (generatedColdMessage?.trim()) {
      coldMessage = await ColdMessage.create({
        applicationId: application._id,
        message: generatedColdMessage.trim(),
      });
    }

    return res.status(201).json(
      successResponse("Application generated successfully", {
        applicationId: application._id,
        resumeVersion: {
          id: resumeVersion._id,
          version,
          fileUrl,
        },
        mailDraft,
        coldMessage,
      }),
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};
