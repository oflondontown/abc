import { Outlet } from "@tanstack/react-router";
import * as React from "react";

import { AppHeader } from "./AppHeader";
import { ResponsiveSidebar } from "./ResponsiveSidebar";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      {/* Header (mobile toggle lives here) */}
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar overlays header & content */}
      <ResponsiveSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Routed page content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
}
