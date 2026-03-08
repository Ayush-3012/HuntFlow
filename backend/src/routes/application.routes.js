import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  getApplication,
  listApplications,
  updateApplicationResumeVersion,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  createApplicationBodySchema,
  paramsWithIdSchema,
  updateApplicationResumeVersionBodySchema,
  updateApplicationStatusBodySchema,
} from "../validations/request.schemas.js";

const applicationRouter = Router();

applicationRouter
  .route("/")
  .post(validateRequest({ body: createApplicationBodySchema }), createApplication);
applicationRouter.route("/").get(listApplications);
applicationRouter
  .route("/:id")
  .get(getApplication)
  .delete(validateRequest({ params: paramsWithIdSchema }), deleteApplication);
applicationRouter
  .route("/:id/status")
  .put(
    validateRequest({
      params: paramsWithIdSchema,
      body: updateApplicationStatusBodySchema,
    }),
    updateApplicationStatus,
  );
applicationRouter
  .route("/:id/resume-version")
  .put(
    validateRequest({
      params: paramsWithIdSchema,
      body: updateApplicationResumeVersionBodySchema,
    }),
    updateApplicationResumeVersion,
  );

export default applicationRouter;
