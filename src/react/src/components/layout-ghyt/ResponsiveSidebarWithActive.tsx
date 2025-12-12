import * as React from "react";
import "./Sidebar.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 240;
const MOBILE_WIDTH = "85vw";
const ICON_RAIL_WIDTH = 40;

/* -------------------------------------------------------------------------- */
/*                               Media Query                                  */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/* -------------------------------------------------------------------------- */
/*                               Sidebar                                      */
/* -------------------------------------------------------------------------- */

interface ResponsiveSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ResponsiveSidebarWithActive({
  isOpen,
  setIsOpen,
}: ResponsiveSidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [activeIndex, setActiveIndex] = React.useState(0);

  const itemRefs = React.useRef<HTMLButtonElement[]>([]);
  const [indicatorY, setIndicatorY] = React.useState(0);
  const [indicatorH, setIndicatorH] = React.useState(40);

  /* ---------------------------- Body scroll lock ---------------------------- */

  React.useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

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

  /* ------------------------- Active indicator sync -------------------------- */

  React.useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      setIndicatorY(el.offsetTop);
      setIndicatorH(el.offsetHeight);
    }
  }, [activeIndex, isOpen, isMobile]);

  /* -------------------------- Touch swipe close ----------------------------- */

  const touchStartX = React.useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (deltaX < -50) {
      setIsOpen(false);
      touchStartX.current = null;
    }
  }

  /* ----------------------------- Layout math -------------------------------- */

  const width = isMobile
    ? MOBILE_WIDTH
    : isOpen
    ? EXPANDED_WIDTH
    : COLLAPSED_WIDTH;

  const transform = isMobile
    ? isOpen
      ? "translateX(0)"
      : "translateX(-100%)"
    : "none";

  return (
    <TooltipProvider delayDuration={120}>
      {/* Overlay (mobile always, desktop optional) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="
          fixed top-0 left-0 h-full z-100
          bg-gray-900 text-white
          flex flex-col overflow-x-hidden
          transition-[width,transform]
          duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        "
        style={{ width, transform }}
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile ? onTouchMove : undefined}
      >
        {/* Header */}
        <div className="relative h-16 flex items-center border-b border-gray-700 flex-shrink-0">
          {/* Desktop toggle ONLY */}
          {!isMobile && (
            <button
              className="
      absolute left-2 top-1/2 -translate-y-1/2
      bg-gray-800 text-white p-2 rounded
      z-50   /* 👈 higher than sidebar */
    "
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
          )}

          <span
            className="ml-12 font-bold text-lg whitespace-nowrap
                       transition-all duration-300 ease-out"
            style={{
              opacity: isOpen || isMobile ? 1 : 0,
              transform:
                isOpen || isMobile ? "translateX(0)" : "translateX(-12px)",
            }}
          >
            MyApp
          </span>
        </div>

        {/* Menu */}
        <nav
          className="relative flex-1 overflow-y-auto sidebar-scroll"
          data-state={isOpen ? "open" : "collapsed"}
        >
          {/* Active indicator (desktop only) */}
          {!isMobile && (
            <div
              className="absolute left-0 w-[2px] bg-blue-500 rounded
                         transition-transform duration-200 ease-out"
              style={{
                transform: `translateY(${indicatorY}px)`,
                height: indicatorH,
              }}
            />
          )}

          {Array.from({ length: 20 }).map((_, i) => (
            <SidebarItem
              key={i}
              ref={(el) => {
                if (el) itemRefs.current[i] = el;
              }}
              icon="📄"
              label={`Item ${i + 1}`}
              isOpen={isOpen || isMobile}
              showTooltip={!isMobile && !isOpen}
              active={i === activeIndex}
              onClick={() => {
                setActiveIndex(i);
                if (isMobile) setIsOpen(false);
              }}
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

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  showTooltip: boolean;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  function SidebarItem(
    { icon, label, isOpen, showTooltip, active, onClick },
    ref
  ) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`relative flex items-center h-10 w-full rounded
                  px-2 text-left transition-colors
                  ${active ? "bg-gray-800/60" : "hover:bg-gray-800"}`}
      >
        <TooltipWrapper label={label} enabled={showTooltip}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{ width: ICON_RAIL_WIDTH }}
          >
            <span className="text-xl leading-none">{icon}</span>
          </div>
        </TooltipWrapper>

        <span
          className="absolute left-[40px] whitespace-nowrap text-sm
                   overflow-hidden transition-all duration-200 ease-out"
          style={{
            maxWidth: isOpen ? "180px" : "0px",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateX(0)" : "translateX(-6px)",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {label}
        </span>
      </button>
    );
  }
);

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
