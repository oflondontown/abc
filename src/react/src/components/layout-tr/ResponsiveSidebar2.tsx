import * as React from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { AnyRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { FocusScope } from "@radix-ui/react-focus-scope";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useSpringValue } from "@/hooks/useSpringValue";

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const COLLAPSED_WIDTH = 60;
const EXPANDED_WIDTH = 240;
const MOBILE_WIDTH = "85vw";
const ICON_RAIL_WIDTH = 40;

const EDGE_THRESHOLD = 16;
const OPEN_THRESHOLD = 60;

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
/*                          Sidebar route extraction                           */
/* -------------------------------------------------------------------------- */

type SidebarRoute = {
  id: string;
  to: string;
  label: string;
  icon?: LucideIcon;
  order: number;
};

function useSidebarRoutes(): SidebarRoute[] {
  const router = useRouter();

  return React.useMemo(() => {
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
  const router = useRouter();

  /* ------------------------- Router state ------------------------- */

  const matches = useRouterState({
    select: (s) => s.matches,
  });

  const sidebarRouteIdSet = React.useMemo(
    () => new Set(sidebarRoutes.map((r) => r.id)),
    [sidebarRoutes]
  );

  const activeSidebarRouteId = React.useMemo(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const id = matches[i]?.routeId;
      if (id && sidebarRouteIdSet.has(id)) return id;
    }
    return null;
  }, [matches, sidebarRouteIdSet]);

  /* ----------------------------- Refs ----------------------------- */

  const navRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef(new Map<string, HTMLAnchorElement>());
  const toggleButtonRef = React.useRef<HTMLButtonElement | null>(null);

  /* ------------------------ Cached positions ---------------------- */

  const itemRects = React.useRef(
    new Map<string, { top: number; height: number }>()
  );

  React.useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    itemRects.current.clear();
    const navRect = nav.getBoundingClientRect();

    for (const [id, el] of itemRefs.current.entries()) {
      const elRect = el.getBoundingClientRect();
      itemRects.current.set(id, {
        top: elRect.top - navRect.top + nav.scrollTop,
        height: elRect.height,
      });
    }
  }, [sidebarRoutes, isOpen, isMobile]);

  /* -------------------------- Scroll guard ------------------------ */

  const isScrolling = React.useRef(false);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let timeout: number;

    function onScroll() {
      isScrolling.current = true;
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        isScrolling.current = false;
      }, 120);
    }

    nav.addEventListener("scroll", onScroll, { passive: true });
    return () => nav.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------------ Hover indicator ----------------------- */

  const [hoveredRouteId, setHoveredRouteId] = React.useState<string | null>(
    null
  );
  const [hoverY, setHoverY] = React.useState(0);
  const [hoverH, setHoverH] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!hoveredRouteId || isMobile || isScrolling.current) return;
    const rect = itemRects.current.get(hoveredRouteId);
    if (!rect) return;
    setHoverY(rect.top);
    setHoverH(rect.height);
  }, [hoveredRouteId, isMobile]);

  const animatedHoverY = useSpringValue(hoverY, {
    stiffness: 700,
    damping: 60,
  });

  /* ------------------------ Active indicator ---------------------- */

  const [activeY, setActiveY] = React.useState(0);
  const [activeH, setActiveH] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!activeSidebarRouteId || isMobile) return;
    const rect = itemRects.current.get(activeSidebarRouteId);
    if (!rect) return;
    setActiveY(rect.top);
    setActiveH(rect.height);
  }, [activeSidebarRouteId, isMobile]);

  const animatedActiveY = useSpringValue(activeY);

  /* ------------------------ Focus indicator ----------------------- */

  const [focusedRouteId, setFocusedRouteId] = React.useState<string | null>(
    null
  );
  const [focusY, setFocusY] = React.useState(0);
  const [focusH, setFocusH] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!focusedRouteId || isMobile) return;
    const rect = itemRects.current.get(focusedRouteId);
    if (!rect) return;
    setFocusY(rect.top);
    setFocusH(rect.height);
  }, [focusedRouteId, isMobile]);

  const animatedFocusY = useSpringValue(focusY, {
    stiffness: 520,
    damping: 48,
  });

  /* ---------------------- Keyboard navigation --------------------- */

  React.useEffect(() => {
    if (!isOpen || isMobile) return;

    function onKeyDown(e: KeyboardEvent) {
      if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
      e.preventDefault();

      const routes = sidebarRoutes;
      if (!routes.length) return;

      const currentIndex = focusedRouteId
        ? routes.findIndex((r) => r.id === focusedRouteId)
        : routes.findIndex((r) => r.id === activeSidebarRouteId);

      let nextIndex = currentIndex;

      if (e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % routes.length;
      } else if (e.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + routes.length) % routes.length;
      } else if (e.key === "Enter" && currentIndex >= 0) {
        router.navigate({ to: routes[currentIndex].to });
        return;
      }

      const next = routes[nextIndex];
      setFocusedRouteId(next.id);
      itemRefs.current.get(next.id)?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isOpen,
    isMobile,
    sidebarRoutes,
    focusedRouteId,
    activeSidebarRouteId,
    router,
  ]);

  /* ---------------------- Focus trapping -------------------------- */

  React.useEffect(() => {
    if (!isOpen) return;

    const el =
      (activeSidebarRouteId && itemRefs.current.get(activeSidebarRouteId)) ||
      itemRefs.current.values().next().value;

    el?.focus();
  }, [isOpen, activeSidebarRouteId]);

  /* ---------------------- Scroll lock (mobile) -------------------- */

  React.useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  /* ---------------------- Edge swipe open ------------------------- */

  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);
  const trackingSwipe = React.useRef(false);

  React.useEffect(() => {
    if (!isMobile || isOpen) return;

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t || t.clientX > EDGE_THRESHOLD) return;
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
      trackingSwipe.current = true;
    }

    function onTouchMove(e: TouchEvent) {
      if (!trackingSwipe.current) return;
      const t = e.touches[0];
      if (!t) return;

      const dx = t.clientX - (touchStartX.current ?? 0);
      const dy = t.clientY - (touchStartY.current ?? 0);

      if (Math.abs(dy) > Math.abs(dx)) {
        trackingSwipe.current = false;
        return;
      }

      if (dx > OPEN_THRESHOLD) {
        trackingSwipe.current = false;
        setIsOpen(true);
      }
    }

    function onTouchEnd() {
      trackingSwipe.current = false;
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, isOpen, setIsOpen]);

  /* --------------------------- Layout ----------------------------- */

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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <FocusScope
        trapped={isOpen}
        onUnmountAutoFocus={(e) => {
          e.preventDefault();
          toggleButtonRef.current?.focus();
        }}
      >
        <aside
          className="fixed top-0 left-0 h-full z-[100]
                     bg-gray-900 text-white flex flex-col overflow-x-hidden"
          style={{ width, transform }}
        >
          {/* Header */}
          <div className="relative h-16 flex items-center border-b border-gray-700 flex-shrink-0">
            {!isMobile && (
              <button
                ref={toggleButtonRef}
                className="absolute left-2 top-1/2 -translate-y-1/2
                           bg-gray-800 text-white p-2 rounded z-[110]"
                onClick={() => setIsOpen(!isOpen)}
              >
                ☰
              </button>
            )}
            <span
              className="ml-12 font-bold text-lg whitespace-nowrap transition-all"
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
          <nav ref={navRef} className="relative flex-1 overflow-y-auto">
            {/* Hover indicator */}
            {!isMobile && hoveredRouteId && (
              <div
                className="absolute left-0 w-[2px] bg-red-700 z-20
                           pointer-events-none will-change-transform"
                style={{
                  transform: `translateY(${animatedHoverY}px)`,
                  height: hoverH,
                }}
              />
            )}

            {/* Focus indicator */}
            {!isMobile && focusedRouteId && (
              <div
                className="absolute left-0 w-[2px] bg-yellow-400 z-30
                           pointer-events-none will-change-transform"
                style={{
                  transform: `translateY(${animatedFocusY}px)`,
                  height: focusH,
                }}
              />
            )}

            {/* Active indicator */}
            {!isMobile && activeSidebarRouteId && (
              <div
                className="absolute left-0 w-[2px] bg-blue-500 z-40
                           pointer-events-none will-change-transform"
                style={{
                  transform: `translateY(${animatedActiveY}px)`,
                  height: activeH,
                }}
              />
            )}

            {sidebarRoutes.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSidebarRouteId;

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                  }}
                  tabIndex={-1}
                  onFocus={() => setFocusedRouteId(item.id)}
                  onBlur={() => setFocusedRouteId(null)}
                  onMouseEnter={() => setHoveredRouteId(item.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                  onClick={() => {
                    if (isMobile) setIsOpen(false);
                  }}
                  className={`relative z-10 flex items-center h-10 w-full px-2
                              outline-none focus-visible:outline-none
                              transition-colors
                              ${
                                isActive
                                  ? "bg-gray-800/60"
                                  : "hover:bg-gray-800"
                              }`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{ width: ICON_RAIL_WIDTH }}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                      </div>
                    </TooltipTrigger>
                    {!isOpen && !isMobile && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>

                  <span
                    className="absolute left-10 whitespace-nowrap text-sm
                               transition-all overflow-hidden"
                    style={{
                      maxWidth: isOpen ? 180 : 0,
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateX(0)" : "translateX(-6px)",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </FocusScope>
    </TooltipProvider>
  );
}
