import { Application } from "../models/application.model.js";
import { Mail } from "../models/mail.model.js";
import { ColdMessage } from "../models/message.model.js";
import { Job } from "../models/job.model.js";
import { ResumeVersion } from "../models/resumeVersion.model.js";
import { TimelineEvent } from "../models/timelineEvent.model.js";
import { createApplicationService } from "../services/application.service.js";
import { deleteResumePdfByUrl } from "../services/s3ResumeDelete.service.js";
import { suggestStatusFromTimeline } from "../services/statusSuggestion.service.js";
import { successResponse } from "../utils/response.util.js";
import {
  createTimelineEvent,
  getApplicationTimeline,
} from "./timeline.controller.js";

export const createApplication = async (req, res, next) => {
  try {
    const { jobId, versionId } = req.body;

    if (!jobId || !versionId) {
      const error = new Error("jobId and versionId are required");
      error.statusCode = 400;
      throw error;
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    const resumeVersionExists = await ResumeVersion.findById(versionId);
    if (!resumeVersionExists) {
      const error = new Error("Resume version not found");
      error.statusCode = 404;
      throw error;
    }

    const newApplication = await createApplicationService({ jobId, versionId });

    createTimelineEvent({
      applicationId: newApplication._id,
      type: "APPLICATION_CREATED",
      payload: {
        status: "Saved",
        jobId,
        versionId,
      },
    }).catch(console.error);

    return res
      .status(201)
      .json(successResponse("Application created", newApplication));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single application
 */
export const getApplication = async (req, res, next) => {
  try {
    const foundApplication = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("versionId");

    if (!foundApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    const timelineEvents = await TimelineEvent.find({
      applicationId: foundApplication._id,
    }).sort({
      createdAt: 1,
    });

    const suggestion = suggestStatusFromTimeline(
      timelineEvents,
      foundApplication.status,
    );

    return res
      .status(200)
      .json(
        successResponse("Application found", {
          application: foundApplication,
          timeline: timelineEvents,
          suggestedStatus: suggestion,
        }),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * List applications (optional status filter)
 */
export const listApplications = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("jobId")
      .populate("versionId");

    return res
      .status(200)
      .json(successResponse("Applications fetched", applications));
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status
 * Controlled transition
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Saved",
      "Applied",
      "Shortlisted",
      "Interviewed",
      "Selected",
      "Rejected",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      const error = new Error("Invalid application status");
      error.statusCode = 400;
      throw error;
    }

    const foundApplication = await Application.findById(req.params.id);
    if (!foundApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    // Prevent backward transition
    const statusOrder = {
      Saved: 1,
      Applied: 2,
      Interviewed: 3,
      Selected: 4,
      Rejected: 4,
    };

    if (statusOrder[status] < statusOrder[foundApplication.status]) {
      const error = new Error("Invalid status transition");
      error.statusCode = 400;
      throw error;
    }

    foundApplication.status = status;
    await foundApplication.save();

    createTimelineEvent({
      applicationId: foundApplication._id,
      type: "STATUS_UPDATED",
      payload: {
        from: foundApplication.status,
        to: status,
      },
    }).catch(console.error);

    return res
      .status(200)
      .json(successResponse("Application status updated", foundApplication));
  } catch (error) {
    next(error);
  }
};

/**
 * Update resume version for an application
 * (AI tailored resume use case)
 */
export const updateApplicationResumeVersion = async (req, res, next) => {
  try {
    const { versionId } = req.body;

    if (!versionId) {
      const error = new Error("versionId is required");
      error.statusCode = 400;
      throw error;
    }

    const resumeVersionExists = await ResumeVersion.findById(versionId);
    if (!resumeVersionExists) {
      const error = new Error("Resume version not found");
      error.statusCode = 404;
      throw error;
    }

    const foundApplication = await Application.findById(req.params.id);
    if (!foundApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    foundApplication.versionId = versionId;
    await foundApplication.save();

    createTimelineEvent({
      applicationId: foundApplication._id,
      type: "RESUME_VERSION_UPDATED",
      payload: {
        oldVersionId,
        newVersionId: versionId,
      },
    }).catch(console.error);

    return res
      .status(200)
      .json(successResponse("Resume version updated", foundApplication));
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const foundApplication = await Application.findById(req.params.id);
    if (!foundApplication) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    const applicationId = foundApplication._id;
    const versionId = foundApplication.versionId;
    let resumeVersionDeleted = false;
    let resumeFileDeleted = false;

    if (versionId) {
      const versionStillUsed = await Application.exists({
        _id: { $ne: applicationId },
        versionId,
      });

      if (!versionStillUsed) {
        const resumeVersion = await ResumeVersion.findById(versionId);
        if (resumeVersion?.fileUrl) {
          try {
            await deleteResumePdfByUrl(resumeVersion.fileUrl);
            resumeFileDeleted = true;
          } catch (deleteFileError) {
            console.error("Failed to delete resume file from S3", deleteFileError);
          }
        }

        await ResumeVersion.findByIdAndDelete(versionId);
        resumeVersionDeleted = true;
      }
    }

    const [mailDeleteResult, messageDeleteResult, timelineDeleteResult] =
      await Promise.all([
        Mail.deleteMany({ applicationId }),
        ColdMessage.deleteMany({ applicationId }),
        TimelineEvent.deleteMany({ applicationId }),
      ]);

    await Application.findByIdAndDelete(applicationId);

    return res.status(200).json(
      successResponse("Application and related data deleted", {
        applicationId,
        deleted: {
          mails: mailDeleteResult.deletedCount,
          messages: messageDeleteResult.deletedCount,
          timelineEvents: timelineDeleteResult.deletedCount,
          resumeVersion: resumeVersionDeleted,
          resumeFile: resumeFileDeleted,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};
