import { Router } from "express";
import {
  createJob,
  getJobDetails,
  listJobs,
  updateJob,
} from "../controllers/job.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  createJobBodySchema,
  paramsWithIdSchema,
  updateJobBodySchema,
} from "../validations/request.schemas.js";

const jobRouter = Router();

jobRouter.route("/").post(validateRequest({ body: createJobBodySchema }), createJob);
jobRouter.route("/").get(listJobs);
jobRouter.route("/:id").get(getJobDetails);
jobRouter
  .route("/:id")
  .put(
    validateRequest({ params: paramsWithIdSchema, body: updateJobBodySchema }),
    updateJob,
  );

export default jobRouter;
