import { VscodeLayout } from "@/layouts/vscode-layout";
import { IosLayout } from "@/layouts/ios-layout";
import { useMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

export function App() {
  const isMobileSize = useMobile();
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsIos(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
  }, []);

  if (isMobileSize || isIos) {
    return <IosLayout />;
  }

  return <VscodeLayout />;
}
