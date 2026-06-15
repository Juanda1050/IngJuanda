import { motion, MotionValue, type MotionStyle } from "framer-motion";
import React, { useMemo } from "react";

interface AppWrapperProps {
  children: React.ReactNode;
  edgeDragX: MotionValue<number>;
  appY: MotionValue<number>;
  appScale: MotionValue<number>;
  appBorderRadius: MotionValue<string>;
  appOpacity: MotionValue<number>;
  layoutKey: string;
}

export function AppWrapper({
  children,
  edgeDragX,
  appY,
  appScale,
  appBorderRadius,
  appOpacity,
  layoutKey,
}: AppWrapperProps) {
  const motionStyle = useMemo<MotionStyle>(
    () => ({
      x: edgeDragX,
      y: appY,
      scale: appScale,
      borderRadius: appBorderRadius,
      opacity: appOpacity,
      transformOrigin: "bottom center",
      willChange: "transform, opacity",
    }),
    [edgeDragX, appY, appScale, appBorderRadius, appOpacity],
  );

  return (
    <motion.div
      key={layoutKey}
      initial={{ scale: 0.2, y: 380, opacity: 0, borderRadius: "40px" }}
      animate={{ scale: 1, y: 0, opacity: 1, borderRadius: "0px" }}
      exit={{ scale: 0.2, y: 380, opacity: 0, borderRadius: "40px" }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
        opacity: { duration: 0.2 },
      }}
      style={motionStyle}
      className="absolute inset-0 bg-[#f2f2f7] dark:bg-black z-20 overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
