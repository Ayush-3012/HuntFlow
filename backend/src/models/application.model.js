import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
      required: true,
    },
    status: {
      type: String,
      enum: ["Saved", "Applied", "Rejected", "Selected", "Interviewed"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
