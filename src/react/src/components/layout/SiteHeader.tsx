"use client";

import { Menu } from "lucide-react";
import { useResponsiveSidebar } from "./responsive-sidebar-context";

export default function SiteHeader() {
  const { toggleCollapsed, toggleMobile } = useResponsiveSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 flex items-center px-4 gap-4">
      {/* Hamburger */}
      <button
        className="p-2 rounded hover:bg-accent transition"
        onClick={() => {
          if (window.innerWidth < 768) toggleMobile();
          else toggleCollapsed();
        }}
      >
        <Menu size={22} />
      </button>

      {/* Logo */}
      <div className="font-semibold text-lg">MyTube</div>
    </header>
  );
}
