// ============================================
// ComES Website - Custom Cursor Component
// ============================================

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  cursorType: "default" | "pointer" | "text" | "grab";
}

export const CustomCursor = () => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    cursorType: "default",
  });

  // Mouse position (main cursor tracks 1:1 with zero lag)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Trailing cursor (smooth, elastic outer ring)
  const trailConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  // Track mouse movement
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    },
    [cursorX, cursorY],
  );

  // Track mouse enter/leave
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // Track mouse down/up
  const handleMouseDown = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isClicking: false }));
  }, []);

  // Detect hoverable elements
  const handleElementHover = useCallback((e: MouseEvent) => {
    const target = e.target;
    if (!target || !(target instanceof Element) || typeof target.closest !== "function") {
      setCursorState((prev) => ({ ...prev, isHovering: false, cursorType: "default" }));
      return;
    }

    // Check for interactive elements
    const isLink = target.closest('a, button, [role="button"]');
    const isInput = target.closest('input, textarea, select, [contenteditable="true"]');
    const isGrab = target.closest('[data-cursor="grab"]');

    if (isGrab) {
      setCursorState((prev) => ({ ...prev, isHovering: true, cursorType: "grab" }));
    } else if (isInput) {
      setCursorState((prev) => ({ ...prev, isHovering: true, cursorType: "text" }));
    } else if (isLink) {
      setCursorState((prev) => ({ ...prev, isHovering: true, cursorType: "pointer" }));
    } else {
      setCursorState((prev) => ({ ...prev, isHovering: false, cursorType: "default" }));
    }
  }, []);

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add global cursor:none style
    document.body.style.cursor = "none";

    // Add cursor:none to all interactive elements
    const style = document.createElement("style");
    style.id = "custom-cursor-styles";
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.getElementById("custom-cursor-styles")?.remove();
    };
  }, [
    handleMouseMove,
    handleElementHover,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) {
    return null;
  }

  const { isHovering, isClicking, cursorType } = cursorState;

  // Cursor sizes based on state
  const mainSize = isClicking ? 8 : isHovering ? 16 : 10;
  const trailSize = isClicking ? 32 : isHovering ? 48 : 40;

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      {/* Outer ring / Trail cursor */}
      <motion.div
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[99999] rounded-full mix-blend-difference",
          "transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          initial={{ borderWidth: "1px" }}
          animate={{
            width: trailSize,
            height: trailSize,
            borderWidth: isHovering ? "2px" : "1px",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            "rounded-full",
            isDark ? "border-white/80" : "border-slate-900/80",
            cursorType === "pointer" && "border-blue-400",
            cursorType === "text" && "border-amber-400",
            cursorType === "grab" && "border-purple-400",
          )}
          style={{ borderStyle: "solid", borderWidth: "1px" }}
        />
      </motion.div>

      {/* Inner dot / Main cursor */}
      <motion.div
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[99999] rounded-full",
          "transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: mainSize,
            height: mainSize,
            scale: isClicking ? 0.8 : 1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className={cn(
            "rounded-full",
            isDark ? "bg-white" : "bg-slate-900",
            cursorType === "pointer" && (isDark ? "bg-blue-400" : "bg-blue-500"),
            cursorType === "text" && (isDark ? "bg-amber-400" : "bg-amber-500"),
            cursorType === "grab" && (isDark ? "bg-purple-400" : "bg-purple-500"),
          )}
        />
      </motion.div>

      {/* Cursor glow effect */}
      <motion.div
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[99998] rounded-full blur-xl",
          "transition-opacity duration-500",
          isHovering && isVisible ? "opacity-30" : "opacity-0",
        )}
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: 60,
            height: 60,
          }}
          className={cn(
            "rounded-full",
            cursorType === "pointer" && "bg-blue-500",
            cursorType === "text" && "bg-amber-500",
            cursorType === "grab" && "bg-purple-500",
            cursorType === "default" && (isDark ? "bg-white" : "bg-slate-900"),
          )}
        />
      </motion.div>

      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pointer-events-none fixed top-0 left-0 z-[99997] rounded-full"
          style={{
            x: cursorX.get() - 25,
            y: cursorY.get() - 25,
            width: 50,
            height: 50,
          }}
        >
          <div
            className={cn("h-full w-full rounded-full", isDark ? "bg-white/30" : "bg-slate-900/30")}
          />
        </motion.div>
      )}
    </>,
    document.body
  );
};

export default CustomCursor;
