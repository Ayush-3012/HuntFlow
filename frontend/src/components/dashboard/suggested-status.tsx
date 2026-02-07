export default function SuggestedStatus() {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold mb-2">Suggested Update</h3>
  
        <p className="text-sm text-gray-600">
          Recruiter replied to your email for{" "}
          <span className="font-medium text-gray-900">Amazon – SDE I</span>.
        </p>
  
        <p className="text-sm text-gray-500 mt-2">
          Suggested status:{" "}
          <span className="font-medium text-yellow-700">Shortlisted</span>
        </p>
  
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
          Update Status
        </button>
      </div>
    );
  }
  