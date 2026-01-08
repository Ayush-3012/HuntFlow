import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "APPLICATION_CREATED",
        "STATUS_UPDATED",
        "RESUME_VERSION_UPDATED",

        "MAIL_DRAFT_CREATED",
        "MAIL_SENT",
        "MAIL_FAILED",
        "MAIL_RECEIVED",

        "NOTE_ADDED",
      ],
      required: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const timelineEvent = mongoose.model(
  "TimelineEvent",
  timelineEventSchema
);
