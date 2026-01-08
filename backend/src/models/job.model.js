import mongoose from "mongoose";

const jobShema = new mongoose.Schema(
  {
    jobProfile: {
      type: String,
      required: true,
      trim: true,
    },
    jobCompany: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    jobLink: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobShema);
