import { Mail } from "../models/mail.model.js";

export async function createMailDraftService({
  applicationId,
  to,
  subject,
  body,
}) {
  return Mail.create({
    applicationId,
    to,
    subject,
    body,
    status: "DRAFT",
  });
}
