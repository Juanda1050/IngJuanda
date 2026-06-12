import { VscodeLayout } from "@/layouts/vscode-layout";
import { IosLayout } from "@/layouts/ios-layout";
import { useMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useUiStore } from "@/store/ui-store";
import { MotionConfig } from "framer-motion";

export function App() {
  const isMobileSize = useMobile();
  const [isIos, setIsIos] = useState(false);
  const graphicsAcceleration = useUiStore((state) => state.graphicsAcceleration);

  useEffect(() => {
    setIsIos(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
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
    if (isMobileSize || isIos) {
      return <IosLayout />;
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
