export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0f0f0f] text-white shadow-md sticky top-0 z-50">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <div className="text-2xl font-bold text-red-600">YouTube</div>
      </div>

      {/* Middle - Search Bar */}
      <div className="flex flex-1 justify-center px-4">
        <div className="flex w-1/2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 bg-neutral-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <button className="px-4 bg-neutral-700 hover:bg-neutral-600 transition">
            🔍
          </button>
        </div>
      </div>

      {/* Right - Profile Icon */}
      <div className="flex items-center space-x-4">
        <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition">
          R
        </div>
      </div>
    </div>
  );
}