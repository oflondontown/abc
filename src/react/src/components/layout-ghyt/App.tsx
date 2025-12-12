import React, { useState } from "react";
import { ResponsiveSidebar } from "@/components/layout-ghyt/ResponsiveSidebar";
import { HiddenCollapsedSidebar } from "./components/layout-ghyt/HiddenCollapsedSidebar";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { ResponsiveSidebarWithTooltip } from "./components/layout-ghyt/ResponsiveSidebarWithTooltip";
import { ResponsiveSidebarWithActive } from "./components/layout-ghyt/ResponsiveSidebarWithActive";
import { ResponsiveSidebarWithMobile } from "./components/layout-ghyt/ResponsiveSidebarWithMobile";
import { AppHeader } from "./components/layout-ghyt/AppHeader";

const collapsedWidth = 60; // same as sidebar
const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usingHidden, setUsingHidden] = useState<boolean>(false);
  return (
    <div>
      {usingHidden ? (
        <HiddenCollapsedSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
      ) : (
        // <ResponsiveSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        // <ResponsiveSidebarWithTooltip
        //   isOpen={sidebarOpen}
        //   setIsOpen={setSidebarOpen}
        // />
        <>
          <ResponsiveSidebarWithActive
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          {/* <AppHeader onMenuClick={() => setSidebarOpen((prev) => !prev)} />
          <ResponsiveSidebarWithMobile
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          /> */}
        </>
      )}

      {/* Fixed Header */}
      <header
        className="fixed top-0 h-16 bg-white shadow z-20 flex items-center px-4 transition-all duration-300"
        style={{ left: usingHidden ? 0 : collapsedWidth, right: 0 }}
      >
        <h1 className={"text-xl font-bold" + (usingHidden ? " pl-10" : "")}>
          MyApp Header
        </h1>
      </header>

      {/* Main Content */}
      <main className={"pt-18  p-6" + (!usingHidden && " pl-[72px]")}>
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="w-full h-[500px] bg-black rounded-xl">
            {/* Your video player here */}
          </div>

          <div className="bg-muted/20 rounded-xl p-6 h-[1500px]">
            <p>Scroll here — sidebar and header remain fixed.</p>
            <p>Matches YouTube Watch Page behavior.</p>

            <Button onClick={() => setUsingHidden((prev) => !prev)}>
              Toggle Menu {usingHidden ? "To Non Hidden" : "To Hidden"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
