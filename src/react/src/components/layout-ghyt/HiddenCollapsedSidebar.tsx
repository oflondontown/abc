import React, { useEffect } from "react";
import "./Sidebar.css";

const collapsedWidth = 0; // minimal width when collapsed
const expandedWidth = 240;

interface HiddenCollapsedSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const HiddenCollapsedSidebar: React.FC<HiddenCollapsedSidebarProps> = ({
  isOpen,
  setIsOpen,
}) => {
  // Prevent body scrolling while preserving scrollbar width
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-full bg-gray-900 text-white flex flex-col z-40
                   transition-width duration-300 ease-in-out"
        style={{ width: isOpen ? expandedWidth : collapsedWidth }}
      >
        {/* Top container with toggle */}
        <div className="relative h-16 flex items-center border-b border-gray-700 flex-shrink-0">
          {/* Toggle button */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-gray-800 text-white p-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "⬅️" : "➡️"}
          </button>

          {/* Logo */}
          <span
            className="ml-12 font-bold text-lg transition-all duration-300 ease-in-out whitespace-nowrap"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateX(0)" : "translateX(-20px)",
            }}
          >
            MyApp
          </span>
        </div>

        {/* Scrollable menu (always rendered, hidden when collapsed) */}
        <nav
          className="flex-1 mt-2 p-1 sidebar-scroll transition-all duration-300 ease-in-out"
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            overflowY: isOpen ? "auto" : "hidden",
          }}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <HiddenSidebarItem
              key={i}
              icon="📄"
              label={`Item ${i + 1}`}
              isOpen={isOpen}
            />
          ))}
        </nav>
      </div>
    </>
  );
};

interface HiddenSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const HiddenSidebarItem: React.FC<HiddenSidebarItemProps> = ({
  icon,
  label,
  isOpen,
}) => (
  <div className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer w-full">
    <span
      className="text-xl transition-all duration-300 ease-in-out"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateX(0)" : "translateX(-10px)",
        width: isOpen ? "auto" : 0,
        overflow: "hidden",
      }}
    >
      {icon}
    </span>

    <span
      className="ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out"
      style={{
        maxWidth: isOpen ? "200px" : 0,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateX(0)" : "translateX(-10px)",
      }}
    >
      {label}
    </span>
  </div>
);
