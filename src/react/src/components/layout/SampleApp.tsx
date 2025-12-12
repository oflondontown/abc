import React from "react";
import { ResponsiveSidebarProvider } from "@/components/layout/responsive-sidebar-context";
import ResponsiveSidebar from "@/components/layout/ResponsiveSidebar3";
import SiteHeader from "@/components/layout/SiteHeader";
import { Home, Video, Settings } from "lucide-react";

export default function App() {
  const items = [
    { icon: <Home />, label: "Home", href: "/" },
    { icon: <Video />, label: "Videos", href: "/videos" },
    { icon: <Settings />, label: "Settings", href: "/settings" },
  ];

  return (
    <ResponsiveSidebarProvider>
      {/* Header */}
      <SiteHeader />

      {/* Sidebar */}
      <ResponsiveSidebar items={items} />

      {/* WATCH PAGE CONTENT */}
      <main className="pt-14 pl-[72px] p-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="w-full h-[500px] bg-black rounded-xl">
            {/* Your video player here */}
          </div>

          <div className="bg-muted/20 rounded-xl p-6 h-[1500px]">
            <p>Scroll here — sidebar and header remain fixed.</p>
            <p>Matches YouTube Watch Page behavior.</p>
          </div>
        </div>
      </main>
    </ResponsiveSidebarProvider>
  );
}
