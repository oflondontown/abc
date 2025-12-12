import { useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import "./Sidebar.css";

import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { AnyRoute } from "@tanstack/react-router";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleLockScrollbar } from "../layout-ghyt/lock-scrollbar";
import { is } from "zod/v4/locales";

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 240;
const MOBILE_WIDTH = "85vw";
const ICON_RAIL_WIDTH = 40;

/* -------------------------------------------------------------------------- */
/*                               Media Query                                  */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/* -------------------------------------------------------------------------- */
/*                          Sidebar route extraction                           */
/* -------------------------------------------------------------------------- */

type SidebarRoute = {
  id: string;
  to: string;
  label: string;
  icon?: React.ReactNode;
  order: number;
};

function useSidebarRoutes(): SidebarRoute[] {
  const router = useRouter();

  return useMemo(() => {
    const items: SidebarRoute[] = [];

    function walk(route: AnyRoute) {
      const meta = route.options.staticData?.sidebar;
      if (meta) {
        items.push({
          id: route.id,
          to: route.fullPath,
          label: meta.label,
          icon: meta.icon,
          order: meta.order ?? 0,
        });
      }
      route.children?.forEach(walk);
    }

    walk(router.routeTree);
    return items.sort((a, b) => a.order - b.order);
  }, [router]);
}

/* -------------------------------------------------------------------------- */
/*                               Sidebar                                      */
/* -------------------------------------------------------------------------- */

interface ResponsiveSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ResponsiveSidebar({
  isOpen,
  setIsOpen,
}: ResponsiveSidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sidebarRoutes = useSidebarRoutes();

  // Subscribe to navigation changes (this re-renders on route change)
  const matches = useRouterState({
    select: (s) => s.matches,
  });

  const navRef = useRef<HTMLElement | null>(null);

  // Store refs by routeId (not by index) to avoid any ordering/key issues
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  const [indicatorY, setIndicatorY] = useState(0);
  const [indicatorH, setIndicatorH] = useState(40);

  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [hoverY, setHoverY] = useState(0);
  const [hoverH, setHoverH] = useState(0);

  /* ---------------------------- Scroll lock (mobile) ---------------------------- */

  useEffect(() => {
    handleLockScrollbar(isOpen);
  }, [isOpen]);

  /* ------------------------- Escape key close -------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setIsOpen]);

  /* ---------------------- Determine active sidebar route ---------------------- */

  const sidebarRouteIdSet = useMemo(() => {
    return new Set(sidebarRoutes.map((r) => r.id));
  }, [sidebarRoutes]);

  const activeSidebarRouteId = useMemo(() => {
    // Pick the deepest matched route that is in the sidebar
    for (let i = matches.length - 1; i >= 0; i--) {
      const id = matches[i]?.routeId;
      if (id && sidebarRouteIdSet.has(id)) return id;
    }
    return sidebarRoutes[0]?.id ?? null;
  }, [matches, sidebarRoutes, sidebarRouteIdSet]);

  /* ----------------------- Active indicator sync (pixel perfect) ----------------------- */

  useLayoutEffect(() => {
    if (isMobile) return; // indicator is desktop-only in this design
    if (!activeSidebarRouteId) return;

    const el = itemRefs.current.get(activeSidebarRouteId);
    const nav = navRef.current;
    if (!el || !nav) return;

    // Measure relative to nav scroll container
    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    setIndicatorY(elRect.top - navRect.top + nav.scrollTop);
    setIndicatorH(elRect.height);
  }, [activeSidebarRouteId, isMobile, isOpen, sidebarRoutes]);

  /* ----------------------- HOver indicator sync (pixel perfect) ----------------------- */

  useLayoutEffect(() => {
    if (isMobile) return;
    if (!hoveredRouteId) return;

    const el = itemRefs.current.get(hoveredRouteId);
    const nav = navRef.current;
    if (!el || !nav) return;

    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    setHoverY(elRect.top - navRect.top + nav.scrollTop);
    setHoverH(elRect.height);
  }, [hoveredRouteId, isMobile]);

  /* --------------------------- Layout math ----------------------------- */

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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="
          fixed top-0 left-0 h-full z-[100]
          bg-gray-900 text-white
          flex flex-col overflow-x-hidden
          transition-[width,transform]
          duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        "
        style={{ width, transform }}
      >
        {/* Header */}
        <div className="relative h-16 flex items-center border-b border-gray-700 flex-shrink-0">
          {/* Desktop toggle (mobile toggle should be in AppHeader) */}
          {!isMobile && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2
                         bg-gray-800 text-white p-2 rounded z-[110]"
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
          ref={(el) => (navRef.current = el)}
          className="relative flex-1 overflow-y-auto sidebar-scroll"
        >
          {/* Hover indicator */}
          {!isMobile && hoveredRouteId && (
            <div
              className="absolute left-0 w-0.5 rounded bg-red-700 
                transition-transform duration-150 ease-out pointer-events-none 
                z-20 will-change-transform"
              style={{
                transform: `translateY(${hoverY}px)`,
                height: hoverH,
              }}
            />
          )}

          {/* Active indicator (desktop only) */}
          {!isMobile && (
            <div
              className="absolute left-0 w-0.5 bg-blue-500 rounded
                         transition-transform duration-200 ease-out"
              style={{
                transform: `translateY(${indicatorY}px)`,
                height: indicatorH,
              }}
            />
          )}

          {sidebarRoutes.map((item) => {
            const isActive = item.id === activeSidebarRouteId;

            return (
              <SidebarLink
                key={item.id}
                routeId={item.id}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isOpen={isOpen || isMobile}
                showTooltip={!isMobile && !isOpen}
                active={isActive}
                onNavigate={() => {
                  if (isMobile) setIsOpen(false);
                }}
                onHover={(id) => setHoveredRouteId(id)}
                registerRef={(routeId, el) => {
                  if (el) itemRefs.current.set(routeId, el);
                }}
              />
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sidebar Link                                  */
/* -------------------------------------------------------------------------- */

interface SidebarLinkProps {
  routeId: string;
  to: string;
  icon?: React.ReactNode;
  label: string;
  isOpen: boolean;
  showTooltip: boolean;
  active: boolean;
  onNavigate: () => void;
  onHover: (routeId: string | null) => void;
  registerRef: (routeId: string, el: HTMLAnchorElement | null) => void;
}

function SidebarLink({
  routeId,
  to,
  icon,
  label,
  isOpen,
  showTooltip,
  active,
  onNavigate,
  onHover,
  registerRef,
}: SidebarLinkProps) {
  return (
    <Link
      to={to}
      onMouseEnter={() => onHover(routeId)}
      onMouseLeave={() => onHover(null)}
      onClick={onNavigate}
      ref={(el) => registerRef(routeId, el)}
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
    </Link>
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
