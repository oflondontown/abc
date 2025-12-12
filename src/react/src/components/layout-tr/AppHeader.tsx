export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white border-b
                       flex items-center px-4 z-50"
    >
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <h1 className="ml-2 pl-16 font-semibold">MyApp Header</h1>
    </header>
  );
}
