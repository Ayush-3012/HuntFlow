import nodemailer from "nodemailer";
import config from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpSecure, // true for 465, false for 587
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

function escapeHtml(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeBody(body = "", subject = "") {
  let b = body.trim();
  const subjectLine = new RegExp(`^subject\\s*:\\s*${subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n?`, "i");
  b = b.replace(subjectLine, "");      
  b = b.replace(/^subject\s*:.+\n?/i, "");
  return b.trim();
}


export const sendMailService = async ({
  to,
  subject,
  body,
  attachments = [],
}) => {
  const mappedAttachments = attachments.map((a) => ({
    filename: a.filename || "attachment",
    content: a.content, // already base64 from controller
    encoding: "base64",
    contentType: a.type,
    disposition: a.disposition || "attachment",
  }));

  const cleaned = normalizeBody(body, subject);
  const htmlBody = `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-line;">${escapeHtml(cleaned)}</div>`;

  const info = await transporter.sendMail({
    from: {
      address: config.smtpFromEmail || config.smtpUser,
      name: config.smtpFromName,
    },
    to,
    subject,
    html: htmlBody,
    attachments: mappedAttachments,
  });

  return {
    providerMessageId: (info.messageId || "").replace(/[<>]/g, ""),
  };
};
