import { Router } from "express";
import {
  createMailDraft,
  getMail,
  listMails,
  sendMail,
  updateMail,
} from "../controllers/mail.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  createMailDraftBodySchema,
  paramsWithIdSchema,
  updateMailBodySchema,
} from "../validations/request.schemas.js";

const mailRouter = Router();

mailRouter.route("/").get(listMails);
mailRouter.route("/:id").get(getMail);
mailRouter
  .route("/:id")
  .put(
    validateRequest({ params: paramsWithIdSchema, body: updateMailBodySchema }),
    updateMail,
  );
mailRouter
  .route("/draft")
  .post(validateRequest({ body: createMailDraftBodySchema }), createMailDraft);
mailRouter
  .route("/:id/send")
  .post(validateRequest({ params: paramsWithIdSchema }), sendMail);

export default mailRouter;
