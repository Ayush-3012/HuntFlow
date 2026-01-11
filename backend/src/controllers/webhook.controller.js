import { Mail } from "../models/mail.model.js";
import { successResponse } from "../utils/response.util.js";
import { createTimelineEvent } from "./timeline.controller.js";

export const handleSendGridInbound = async (req, res, next) => {
  try {
    const { from, subject, text, html, headers } = req.body;
    if (!headers) {
      const error = new Error("No headers found");
      error.statusCode = 404;
      throw error;
    }

    const inReplyToMatch = headers.match(/In-Reply-To:\s*(.+)/i);
    if (!inReplyToMatch) {
      const error = new Error("No In-Reply-To header");
      error.statusCode = 404;
      throw error;
    }

    const inReplyTo = inReplyToMatch[1].trim();
    const providerMessageId = inReplyTo
      .replace("<", "")
      .replace(">", "")
      .split("@")[0];

    const mail = await Mail.findOne({ providerMessageId });
    if (!mail) {
      const error = new Error("No matching mail found");
      error.statusCode = 404;
      throw error;
    }

    createTimelineEvent({
      applicationId: mail.applicationId,
      type: "MAIL_RECEIVED",
      payload: {
        from,
        subject,
        snippet: (text || html || "").slice(0, 200),
      },
    }).catch(console.error);

    return res
      .status(200)
      .json(successResponse("Mail sent successfully", foundMail));
  } catch (error) {
    next(error);
  }
};
