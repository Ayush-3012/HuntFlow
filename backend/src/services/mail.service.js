import sgMail from "@sendgrid/mail";
import config from "../config/env.js";

sgMail.setApiKey(config.sendGrid);

/**
 * Send email using SendGrid
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.body
 * @param {Array}  options.attachments  [{ filename, content, type }]
 */

export const sendMailService = async ({
  to,
  subject,
  body,
  attachments = [],
}) => {
  const msg = {
    to,
    from: {
      email: config.sendGridEmail,
      name: "Ayush Kumar",
    },
    subject,
    html: body,
    attachments,
  };

  try {
    const [response] = await sgMail.send(msg);

    return {
      providerMessageId: response.headers["x-message-id"],
    };
  } catch (error) {
    const err = new Error(
      error.response?.body?.errors?.[0]?.message || "Failed to send email"
    );
    throw err;
  }
};
