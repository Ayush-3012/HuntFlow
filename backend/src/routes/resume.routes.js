import { Router } from "express";
import {
  createResumeVersion,
  createResume,
  listResumes,
  listResumeVersions,
  getResumeVersion,
} from "../controllers/resume.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  createResumeBodySchema,
  createResumeVersionBodySchema,
} from "../validations/request.schemas.js";

const resumeRouter = Router();

resumeRouter
  .route("/")
  .post(validateRequest({ body: createResumeBodySchema }), createResume);
resumeRouter.route("/").get(listResumes);
resumeRouter
  .route("/resume-version")
  .post(
    validateRequest({ body: createResumeVersionBodySchema }),
    createResumeVersion,
  );
resumeRouter.route("/:resumeId/versions").get(listResumeVersions);
resumeRouter.route("/resume-version/:id").get(getResumeVersion);

export default resumeRouter;
