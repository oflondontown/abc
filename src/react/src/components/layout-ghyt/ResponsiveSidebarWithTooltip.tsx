import * as React from "react";
import "./Sidebar.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 240;
const ICON_RAIL_WIDTH = 40;

interface ResponsiveSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ResponsiveSidebarWithTooltip({
  isOpen,
  setIsOpen,
}: ResponsiveSidebarProps) {
  // Lock body scroll when sidebar is open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <TooltipProvider delayDuration={120}>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full bg-gray-900 text-white z-40
                   flex flex-col
                   overflow-x-hidden   /* 👈 IMPORTANT */
                   transition-[width] duration-300
                   ease-[cubic-bezier(0.2,0,0,1)]"
        style={{ width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      >
        {/* Header / Toggle */}
        <div className="relative h-16 flex items-center border-b border-gray-700 flex-shrink-0">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2
                       bg-gray-800 text-white p-2 rounded z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? "⬅️" : "➡️"}
          </button>

          {/* Logo */}
          <span
            className="ml-12 font-bold text-lg whitespace-nowrap
                       transition-all duration-300 ease-out"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateX(0)" : "translateX(-12px)",
            }}
          >
            MyApp
          </span>
        </div>

        {/* Scrollable menu */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden px-1 py-2 sidebar-scroll"
          data-state={isOpen ? "open" : "collapsed"}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <SidebarItem
              key={i}
              icon={`📄`}
              label={`Item ${i + 1}`}
              isOpen={isOpen}
            />
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Item                                      */
/* -------------------------------------------------------------------------- */

function SidebarItem({
  icon,
  label,
  isOpen,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}) {
  return (
    <a
      href="#"
      className="relative flex items-center h-10 rounded
                 hover:bg-gray-800 transition-colors px-2"
    >
      {/* Icon rail — fixed width */}
      <TooltipWrapper label={label} enabled={!isOpen}>
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: ICON_RAIL_WIDTH }}
        >
          <span className="text-xl leading-none">{icon}</span>
        </div>
      </TooltipWrapper>

      {/* Label — clipped when collapsed */}
      <span
        className="absolute left-[40px] whitespace-nowrap text-sm
                   overflow-hidden
                   transition-all duration-200 ease-out"
        style={{
          maxWidth: isOpen ? "180px" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateX(0)" : "translateX(-6px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {label}
      </span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Tooltip helper                               */
/* -------------------------------------------------------------------------- */

function TooltipWrapper({
  children,
  label,
  enabled,
}: {
  children: React.ReactNode;
  label: string;
  enabled: boolean;
}) {
  if (!enabled) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
