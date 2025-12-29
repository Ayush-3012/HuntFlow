import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";

const healthRouter = Router();

healthRouter.route("/health").get(healthController);

export default healthRouter;
