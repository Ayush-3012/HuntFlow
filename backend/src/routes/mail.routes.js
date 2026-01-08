import { Router } from "express";
import { createMailDraft, sendMail } from "../controllers/mail.controller.js";

const mailRouter = Router();

mailRouter.route("/draft").post(createMailDraft);
mailRouter.route("/:id/send").post(sendMail);

export default mailRouter;
