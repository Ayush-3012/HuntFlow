const activities = [
    "Resume generated for Google – Frontend Engineer",
    "Application email sent to Amazon",
    "Recruiter replied from Meta",
    "New job added: Netflix – UI Engineer",
  ];
  
  export default function RecentActivity() {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
  
        <ul className="space-y-3 text-sm text-gray-600">
          {activities.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  