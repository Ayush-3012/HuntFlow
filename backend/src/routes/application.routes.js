import { Router } from "express";
import {
  createApplication,
  getApplication,
  listApplications,
  updateApplicationResumeVersion,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

const applicationRouter = Router();

applicationRouter.route("/").post(createApplication);
applicationRouter.route("/").get(listApplications);
applicationRouter.route("/:id").get(getApplication);
applicationRouter.route("/:id/status").put(updateApplicationStatus);
applicationRouter
  .route("/:id/resume-version")
  .put(updateApplicationResumeVersion);

export default applicationRouter;
