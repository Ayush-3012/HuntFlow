import { Router } from "express";
import {
  createResumeVersion,
  createResume,
  listResumes,
  listResumeVersions,
  getResumeVersion,
} from "../controllers/resume.controller.js";

const resumeRouter = Router();

resumeRouter.route("/").post(createResume);
resumeRouter.route("/").get(listResumes);
resumeRouter.route("/resume-version").post(createResumeVersion);
resumeRouter.route("/:resumeId/versions").get(listResumeVersions);
resumeRouter.route("/resume-version/:id").get(getResumeVersion);

export default resumeRouter;
