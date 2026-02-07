export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Selected";

export interface Application {
  _id: string;
  companyName: string;
  jobProfile: string;
  resumeVersion?: {
    version: string;
  };
  status: ApplicationStatus;
  updatedAt: string;
}
