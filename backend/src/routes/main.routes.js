import { Router } from "express";
import { generateApplicationWithAI } from "../controllers/applicationAI.controller.js";

const mainRouter = Router();

mainRouter.route("/generate").post(generateApplicationWithAI);

export default mainRouter;
