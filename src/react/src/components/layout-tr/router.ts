import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { AppLayout } from "./components/layout-tr/AppLayout";
import { Home } from "@/pages/Home";
// import { Projects } from "@/pages/Projects";
import { Settings } from "@/pages/Settings";
import { DummyPage } from "./pages/Dummy";
import UploadPage from "./pages/UploadPage";

/* ---------------- Root route ---------------- */

const rootRoute = createRootRoute({
  component: AppLayout,
});

/* ---------------- Child routes ---------------- */

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
  staticData: {
    sidebar: {
      label: "Home",
      icon: "🏠",
      order: 1,
    },
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
  staticData: {
    sidebar: {
      label: "Settings",
      icon: "⚙️",
      order: 99,
    },
  },
});

const dummyVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dummy",
  component: DummyPage,
  staticData: {
    sidebar: {
      label: "Dummy",
      icon: "📁",
      order: 2,
    },
  },
});

const uploadVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadPage,
  staticData: {
    sidebar: {
      label: "Upload",
      icon: "📁",
      order: 3,
    },
  },
});

/* ---------------- Route tree ---------------- */

const routeTree = rootRoute.addChildren([
  homeRoute,
  settingsRoute,
  dummyVideoRoute,
  uploadVideoRoute,
]);

/* ---------------- Router ---------------- */

export const router = createRouter({
  routeTree,
});
