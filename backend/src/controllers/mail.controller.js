import { Application } from "../models/application.model.js";
import { Mail } from "../models/mail.model.js";
import { ResumeVersion } from "../models/resumeVersion.model.js";
import { sendMailService } from "../services/mail.service.js";
import { createMailDraftService } from "../services/mailDraft.service.js";
import { fetchFileFromURL } from "../utils/fetchFileBuffer.util.js";
import { successResponse } from "../utils/response.util.js";
import { createTimelineEvent } from "./timeline.controller.js";

export const createMailDraft = async (req, res, next) => {
  try {
    const { applicationId, to, subject, body } = req.body;
    if (!applicationId || !to || !subject || !body) {
      const error = new Error("All fileds required");
      error.statusCode = 400;
      throw error;
    }

    const foundApplication = await Application.findById(applicationId);
    if (!foundApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    const newMail = await createMailDraftService({
      applicationId,
      to,
      subject,
      body,
    });

    createTimelineEvent({
      applicationId,
      type: "MAIL_DRAFT_CREATED",
      payload: {
        mailId: newMail._id,
        to,
        subject,
      },
    }).catch(console.error);

    return res.status(201).json(successResponse("Mail Drafted", newMail));
  } catch (error) {
    next(error);
  }
};

export const sendMail = async (req, res, next) => {
  try {
    const foundMail = await Mail.findById(req.params.id);
    if (!foundMail) {
      const error = new Error("Mail not found");
      error.statusCode = 404;
      throw error;
    }

    if (foundMail.status === "SENT") {
      const error = new Error("Mail already sent");
      error.statusCode = 400;
      throw error;
    }

    const foundApplication = await Application.findById(
      foundMail.applicationId,
    );
    if (!foundApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    const resumeVersion = await ResumeVersion.findById(
      foundApplication.versionId,
    );
    if (!resumeVersion) {
      const error = new Error("Resume version not found");
      error.statusCode = 404;
      throw error;
    }

    try {
      const buffer = await fetchFileFromURL(resumeVersion.fileUrl);
      const resumeBase64 = buffer.toString("base64");

      const { providerMessageId } = await sendMailService({
        to: foundMail.to,
        subject: foundMail.subject,
        body: foundMail.body,
        attachments: [
          {
            filename: "Resume.pdf",
            content: resumeBase64,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      });

      foundMail.status = "SENT";
      foundMail.providerMessageId = providerMessageId;
      foundMail.error = null;
      await foundMail.save();

      createTimelineEvent({
        applicationId: foundMail.applicationId,
        type: "MAIL_SENT",
        payload: {
          mailId: foundMail._id,
          to: foundMail.to,
          subject: foundMail.subject,
        },
      }).catch(console.error);

      return res
        .status(200)
        .json(successResponse("Mail sent successfully", foundMail));
    } catch (sendError) {
      foundMail.status = "FAILED";
      foundMail.error = sendError.message;
      await foundMail.save();

      createTimelineEvent({
        applicationId: foundMail.applicationId,
        type: "MAIL_FAILED",
        payload: {
          mailId: foundMail._id,
          error: sendError.message,
        },
      }).catch(console.error);
      throw sendError;
    }
  } catch (error) {
    next(error);
  }
};
