// src/router-meta.ts
import "@tanstack/react-router";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    sidebar?: {
      label: string;
      icon?: React.ReactNode;
      order?: number;
    };
  }
}
