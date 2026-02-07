export default function GenerateApplicationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold">Generate AI Application</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Paste job details and let HuntFlow craft a tailored resume and email.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <textarea
          placeholder="Paste full job description..."
          className="w-full h-40 border rounded-lg p-3 text-sm"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Job Profile"
            className="border rounded-lg p-3 text-sm"
          />
          <input
            placeholder="Company Name"
            className="border rounded-lg p-3 text-sm"
          />
          <input
            placeholder="Job Link"
            className="border rounded-lg p-3 text-sm"
          />
          <input
            placeholder="Domain (optional)"
            className="border rounded-lg p-3 text-sm"
          />
        </div>

        <select className="border rounded-lg p-3 text-sm w-full">
          <option>Select Resume</option>
          <option>Main Resume</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
          Generate AI Application
        </button>
      </div>

      {/* Result Preview (static) */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Resume */}
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <h3 className="font-semibold">Generated Resume</h3>
          <p className="text-sm text-gray-500">Version v5 created.</p>
          <button className="text-blue-600 text-sm hover:underline">
            Preview
          </button>
        </div>

        {/* Email */}
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <h3 className="font-semibold">Email Draft</h3>
          <p className="text-sm text-gray-500">Subject preview appears here.</p>
          <button className="text-blue-600 text-sm hover:underline">
            Copy
          </button>
        </div>

        {/* Cold Message */}
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <h3 className="font-semibold">Cold Message</h3>
          <p className="text-sm text-gray-500">Short outreach preview.</p>
          <button className="text-blue-600 text-sm hover:underline">
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
