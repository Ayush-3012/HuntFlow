import Link from "next/link";
import { Application, ApplicationStatus } from "@/types/application";

type Props = {
  applications: Application[];
};

const NEXT_STATUS_MAP: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  Saved: "Applied",
  Applied: "Shortlisted",
  Shortlisted: "Interviewed",
  Interview: "Selected",
  Interviewed: "Selected",
};

export default function SuggestedStatus({ applications }: Props) {
  const latest = [...applications].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];

  if (!latest) {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold mb-2">Suggested Update</h3>
        <p className="text-sm text-gray-500">No applications yet.</p>
      </div>
    );
  }

  const suggestedStatus = NEXT_STATUS_MAP[latest.status];

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold mb-2">Suggested Update</h3>

      <p className="text-sm text-gray-600">
        Latest activity on{" "}
        <span className="font-medium text-gray-900">
          {latest.jobId.jobCompany} - {latest.jobId.jobProfile}
        </span>
        .
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Current status:{" "}
        <span className="font-medium text-gray-900">{latest.status}</span>
      </p>

      {suggestedStatus ? (
        <p className="text-sm text-gray-500 mt-1">
          Suggested next status:{" "}
          <span className="font-medium text-yellow-700">{suggestedStatus}</span>
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">
          This application is already in a terminal stage.
        </p>
      )}

      <Link
        href={`/applications/${latest._id}`}
        className="mt-4 inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        Open Application
      </Link>
    </div>
  );
}
