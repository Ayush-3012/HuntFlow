import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
