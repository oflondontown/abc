import React, { useEffect } from "react";
import "./Sidebar.css";
import { handleLockScrollbar } from "./lock-scrollbar";
import { i } from "node_modules/framer-motion/dist/types.d-DagZKalS";

const collapsedWidth = 60;
const expandedWidth = 240;

interface ResponsiveSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  isOpen,
  setIsOpen,
}) => {
  // Prevent body scrolling while preserving scrollbar width
  useEffect(() => {
    return handleLockScrollbar(isOpen);
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
        {/* Top container: toggle + logo */}
        <div className="relative h-16 flex items-center border-b border-gray-700 flex-shrink-0">
          {/* Toggle button */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-gray-800 text-white p-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "⬅️" : "➡️"}
          </button>

          {/* Logo (smooth slide + fade) */}
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

        {/* Scrollable menu */}
        <nav className="flex-1 mt-2 p-1 overflow-y-auto sidebar-scroll">
          {Array.from({ length: 30 }, (_, i) => (
            <SidebarItem
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

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isOpen }) => (
  <div className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer w-full">
    <span className="text-xl">{icon}</span>
    <span
      className="ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out"
      style={{
        maxWidth: isOpen ? "200px" : "0px",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateX(0)" : "translateX(-10px)",
      }}
    >
      {label}
    </span>
  </div>
);
