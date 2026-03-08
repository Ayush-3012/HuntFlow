import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const nonEmptyText = z.string().trim().min(1, "Field is required");

const applicationStatus = z.enum([
  "Saved",
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Rejected",
]);

const jobFields = {
  jobProfile: nonEmptyText,
  jobCompany: nonEmptyText,
  jobDescription: nonEmptyText,
  jobLink: nonEmptyText,
  domain: nonEmptyText,
};

export const paramsWithIdSchema = z.object({
  id: objectId,
});

export const createJobBodySchema = z.object(jobFields);

export const updateJobBodySchema = z
  .object({
    ...jobFields,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const createResumeBodySchema = z.object({
  title: nonEmptyText,
});

export const createResumeVersionBodySchema = z.object({
  resumeId: objectId,
  version: nonEmptyText,
  fileUrl: z.string().trim().url("fileUrl must be a valid URL"),
});

export const paramsWithResumeIdSchema = z.object({
  resumeId: objectId,
});

export const createApplicationBodySchema = z.object({
  jobId: objectId,
  versionId: objectId,
});

export const updateApplicationStatusBodySchema = z.object({
  status: applicationStatus,
});

export const updateApplicationResumeVersionBodySchema = z.object({
  versionId: objectId,
});

export const createMailDraftBodySchema = z.object({
  applicationId: objectId,
  to: z.string().trim().email("Invalid email"),
  subject: nonEmptyText,
  body: nonEmptyText,
});

export const updateMailBodySchema = z.object({
  subject: nonEmptyText,
  body: nonEmptyText,
});

export const generateApplicationBodySchema = z.object({
  jobId: objectId,
  resumeId: objectId,
});
