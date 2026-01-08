import { Job } from "../models/job.model.js";
import { successResponse } from "../utils/response.util.js";

export const createJob = async (req, res, next) => {
  try {
    const { jobProfile, jobCompany, jobDescription, jobLink, domain } =
      req.body;

    if (!jobProfile || !jobCompany || !jobDescription || !jobLink || !domain) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const newJob = await Job.create({
      jobProfile,
      jobCompany,
      jobDescription,
      jobLink,
      domain,
    });

    return res
      .status(201)
      .json(successResponse("Job created successfully", newJob));
  } catch (error) {
    next(error);
  }
};

export const listJobs = async (req, res, next) => {
  try {
    const allJobs = await Job.find({});

    return res.status(200).json(successResponse("All Jobs", allJobs));
  } catch (error) {
    next(error);
  }
};

export const getJobDetails = async (req, res, next) => {
  try {
    const foundJob = await Job.findById(req.params.id);
    if (!foundJob) {
      const error = new Error("Job Not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(successResponse("Found Job", foundJob));
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const foundJob = await Job.findById(req.params.id);
    if (!foundJob) {
      const error = new Error("Job Not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json(successResponse("Found Job", updatedJob));
  } catch (error) {
    next(error);
  }
};
