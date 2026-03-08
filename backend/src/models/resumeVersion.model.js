import mongoose from "mongoose";

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    version: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


resumeVersionSchema.index({ resumeId: 1, createdAt: -1 });
resumeVersionSchema.index({ resumeId: 1, version: 1 }, { unique: true });

export const ResumeVersion = mongoose.model(
  "ResumeVersion",
  resumeVersionSchema
);

