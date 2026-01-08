import express from "express";
import { getApplicationTimeline } from "../controllers/timeline.controller.js";

const router = express.Router();

router.get("/applications/:applicationId/timeline", getApplicationTimeline);

export default router;
