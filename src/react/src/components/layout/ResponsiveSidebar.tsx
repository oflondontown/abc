// ResponsiveSidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useResponsiveSidebar } from "./responsive-sidebar-context";
import { useEffect } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function SidebarItem({ icon, label, href }: SidebarItemProps) {
  const { collapsed } = useResponsiveSidebar();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            className={cn(
              "flex items-center px-3 py-2 rounded-xl hover:bg-accent text-sm justify-start"
            )}
          >
            <span className="flex-shrink-0 w-6 h-6">{icon}</span>
            <span
              className={cn(
                "ml-2 transition-opacity duration-250",
                collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              {label}
            </span>
          </a>
        </TooltipTrigger>

        {collapsed && (
          <TooltipContent side="right" className="text-sm">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface ResponsiveSidebarProps {
  items: SidebarItemProps[];
}

export default function ResponsiveSidebar({ items }: ResponsiveSidebarProps) {
  const { collapsed, mobileOpen, closeMobile, toggleCollapsed } =
    useResponsiveSidebar();

  // Prevent body scrolling while preserving scrollbar width
  useEffect(() => {
    if (!collapsed) {
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
  }, [collapsed]);

  return (
    <>
      {/* Overlay for desktop and mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => toggleCollapsed()}
        />
      )}

      {/* Sidebar sliding container */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-40 flex flex-col border-r bg-background",
          "transition-transform duration-300 [cubic-bezier(0.05,0,0,1)] will-change-transform",

          // Slide sidebar in/out
          collapsed
            ? "-translate-x-[168px] md:translate-x-0 md:w-[72px]"
            : "translate-x-0 md:w-60",

          mobileOpen && "translate-x-0"
        )}
      >
        <div className="h-14 border-b flex items-center px-4">
          {!collapsed && <span className="font-semibold">Menu</span>}
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          <div
            className={cn(
              "flex flex-col gap-1 transform transition-transform duration-250 will-change-transform [cubic-bezier(0.05,0,0,1)]"
            )}
          >
            {items.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
