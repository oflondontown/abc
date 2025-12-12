import React from "react";

import AppGhYt from "./components/layout-ghyt/app-ghyt";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

const App: React.FC = () => {
  // return <AppGhYt />;
  return <RouterProvider router={router} />;
};

export default App;
