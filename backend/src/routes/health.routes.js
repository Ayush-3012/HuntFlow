import { Router } from "express";
import { healthController } from "../controllers/health.controller.js";

const healthRouter = Router();

healthRouter.route("/health").get(healthController);
// healthRouter.route("/health").get(testAI);

export default healthRouter;
