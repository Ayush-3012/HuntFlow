import { Router } from "express";
import {
  createJob,
  getJobDetails,
  listJobs,
  updateJob,
} from "../controllers/job.controller.js";

const jobRouter = Router();

jobRouter.route("/").post(createJob);
jobRouter.route("/").get(listJobs);
jobRouter.route("/:id").get(getJobDetails);
jobRouter.route("/:id").put(updateJob);

export default jobRouter;
