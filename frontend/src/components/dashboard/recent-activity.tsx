import { Application } from "@/types/application";

type Props = {
  applications: Application[];
};

export default function RecentActivity({ applications }: Props) {
  const items = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)
    .map((app) => {
      return `${app.jobId.jobCompany} - ${app.jobId.jobProfile} marked as ${app.status}`;
    });

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Recent Activity</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity.</p>
      ) : (
        <ul className="space-y-3 text-sm text-gray-600">
          {items.map((item, index) => (
             <li key={index} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
