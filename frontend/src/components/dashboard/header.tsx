export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
        Generate AI Application
      </button>
    </header>
  );
}
