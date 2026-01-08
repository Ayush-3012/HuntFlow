import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        name: String,
        fileUrl: String,
      },
    ],
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "FAILED"],
      default: "DRAFT",
    },

    providerMessageId: {
      type: String, // nodemailer / gmail id
    },

    error: {
      type: String, // send fail reason
    },
  },
  { timestamps: true }
);

export const Mail = mongoose.model("Mail", mailSchema);
