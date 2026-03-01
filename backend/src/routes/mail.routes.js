import { Router } from "express";
import {
  createMailDraft,
  getMail,
  listMails,
  sendMail,
} from "../controllers/mail.controller.js";

const mailRouter = Router();

mailRouter.route("/").get(listMails);
mailRouter.route("/:id").get(getMail);
mailRouter.route("/draft").post(createMailDraft);
mailRouter.route("/:id/send").post(sendMail);

export default mailRouter;
