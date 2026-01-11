import { Router } from "express";
import { handleSendGridInbound } from "../controllers/webhook.controller.js";

const webHookRouter = Router();

webHookRouter.route("/sendgrid/inbound").post(handleSendGridInbound);

export default webHookRouter;
