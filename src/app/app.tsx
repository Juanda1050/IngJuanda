import { VscodeLayout } from "@/layouts/vscode-layout";
import { IosLayout } from "@/layouts/ios-layout";
import { useState, useEffect, lazy, Suspense } from "react";
import { useUiStore } from "@/store/ui-store";
import { MotionConfig } from "framer-motion";
import { useDevice } from "@/hooks/use-device";

const IpadosLayout = lazy(() =>
  import("@/layouts/ipados-layout/ipados-layout").then((m) => ({ default: m.IpadosLayout }))
);

export function App() {
  const { isMobile, isTablet } = useDevice();
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop" | null>(null);
  const graphicsAcceleration = useUiStore((state) => state.graphicsAcceleration);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isTouchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    if (/iPhone|iPod/.test(ua)) {
      setDeviceType("mobile");
    } else if (/iPad/.test(ua) || isTouchMac) {
      setDeviceType("tablet");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (graphicsAcceleration) {
        document.documentElement.classList.remove("no-gfx-accel");
      } else {
        document.documentElement.classList.add("no-gfx-accel");
      }
    }
  }, [graphicsAcceleration]);

  const renderLayout = () => {
    const activeDevice = deviceType || (isMobile ? "mobile" : isTablet ? "tablet" : "desktop");

    if (activeDevice === "mobile") {
      return <IosLayout />;
    }
    if (activeDevice === "tablet") {
      return (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-[#0c0e14] flex items-center justify-center text-white font-sans text-sm">
              Loading iPadOS...
            </div>
          }
        >
          <IpadosLayout />
        </Suspense>
      );
    }
    return <VscodeLayout />;
  };

  const motionConfigProps: {
    reducedMotion: "user" | "always";
    transition?: { duration: number };
  } = {
    reducedMotion: graphicsAcceleration ? "user" : "always",
  };

  if (!graphicsAcceleration) {
    motionConfigProps.transition = { duration: 0 };
  }

  return (
    <MotionConfig {...motionConfigProps}>
      {renderLayout()}
    </MotionConfig>
  );
}

