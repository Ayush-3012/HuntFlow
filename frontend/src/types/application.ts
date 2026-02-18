export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Shortlisted"
  | "Interview"
  | "Interviewed"
  | "Rejected"
  | "Selected";

export interface Job {
  _id: string;
  jobProfile: string;
  jobCompany: string;
  jobDescription: string;
  jobLink: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  _id: string;
  resumeId: string;
  version: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: Job;
  versionId: ResumeVersion | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  _id: string;
  applicationId: string;
  type:
    | "APPLICATION_CREATED"
    | "STATUS_UPDATED"
    | "RESUME_VERSION_UPDATED"
    | "MAIL_DRAFT_CREATED"
    | "MAIL_SENT"
    | "MAIL_FAILED"
    | "MAIL_RECEIVED"
    | "NOTE_ADDED";
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StatusSuggestion {
  status: ApplicationStatus;
  reason: string;
}
