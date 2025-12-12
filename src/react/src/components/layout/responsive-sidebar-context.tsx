"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;

  mobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function ResponsiveSidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,

        toggleCollapsed: () => setCollapsed((c) => !c),
        toggleMobile: () => setMobileOpen((m) => !m),
        closeMobile: () => setMobileOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useResponsiveSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useResponsiveSidebar must be inside provider");
  return ctx;
}
