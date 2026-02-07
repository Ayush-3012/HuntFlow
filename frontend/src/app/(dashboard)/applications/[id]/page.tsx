function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Applied: "bg-blue-50 text-blue-700",
    Shortlisted: "bg-yellow-50 text-yellow-700",
    Interview: "bg-purple-50 text-purple-700",
    Rejected: "bg-red-50 text-red-700",
    Selected: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-md font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
}

const timeline = [
  "Job added to HuntFlow",
  "AI generated tailored resume (v5)",
  "Email draft created",
  "Application email sent",
  "Recruiter replied",
  "Status updated to Shortlisted",
];

export default function ApplicationDetailPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-semibold">Amazon — SDE I</h1>

        <div className="flex items-center justify-between">
          <StatusBadge status="Shortlisted" />

          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              View Resume
            </button>
            <button className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              Send Mail
            </button>
            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
              Update Status
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-6">Application Timeline</h2>

        <ul className="space-y-6">
          {timeline.map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
              <p className="text-sm text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
