import { Resume } from "../models/resume.model.js";
import { ResumeVersion } from "../models/resumeVersion.model.js";
import { successResponse } from "../utils/response.util.js";

export const createResume = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      const error = new Error("Resume title is required");
      error.statusCode = 400;
      throw error;
    }

    const newResume = await Resume.create({ title });

    return res
      .status(201)
      .json(successResponse("Resume created successfully", newResume));
  } catch (error) {
    next(error);
  }
};

export const listResumes = async (req, res, next) => {
  try {
    const resumes = await resume.find({});

    return res
      .status(200)
      .json(successResponse("All resumes fetched", resumes));
  } catch (error) {
    next(error);
  }
};

/**
 * Create Resume Version
 * (AI / manual dono yahin se aayenge)
 */
export const createResumeVersion = async (req, res, next) => {
  try {
    const { resumeId, version, fileUrl } = req.body;

    if (!resumeId || !version || !fileUrl) {
      const error = new Error("resumeId, version and fileUrl are required");
      error.statusCode = 400;
      throw error;
    }

    const foundResume = await Resume.findById(resumeId);
    if (!foundResume) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    const newVersion = await ResumeVersion.create({
      resumeId,
      version,
      fileUrl,
    });

    return res
      .status(201)
      .json(successResponse("Resume version created successfully", newVersion));
  } catch (error) {
    next(error);
  }
};

/**
 * List versions of a resume
 */
export const listResumeVersions = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const foundResume = await Resume.findById(resumeId);
    if (!foundResume) {
      const error = new Error("Resume not found");
      error.statusCode = 404;
      throw error;
    }

    const versions = await ResumeVersion.find({ resumeId });

    return res
      .status(200)
      .json(successResponse("Resume versions fetched", versions));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single resume version
 */
export const getResumeVersion = async (req, res, next) => {
  try {
    const foundVersion = await ResumeVersion.findById(req.params.id);

    if (!foundVersion) {
      const error = new Error("Resume version not found");
      error.statusCode = 404;
      throw error;
    }

    return res
      .status(200)
      .json(successResponse("Resume version found", foundVersion));
  } catch (error) {
    next(error);
  }
};
