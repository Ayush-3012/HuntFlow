import { Router } from "express";
import { generateApplicationWithAI } from "../controllers/applicationAI.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { generateApplicationBodySchema } from "../validations/request.schemas.js";

const mainRouter = Router();

mainRouter
  .route("/generate")
  .post(validateRequest({ body: generateApplicationBodySchema }), generateApplicationWithAI);

export default mainRouter;
