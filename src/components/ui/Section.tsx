// ============================================
// ComES Website - Section Component
// ============================================

import type { FC, HTMLAttributes } from "react";
import { cn } from "@/utils";
import { useThemeStore } from "@/store";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: "white" | "gray" | "gradient" | "dark" | "pattern";
  container?: boolean;
  padding?: "sm" | "md" | "lg" | "xl";
}

const backgrounds = {
  white: "bg-[var(--bg-primary)]",
  gray: "bg-[var(--bg-secondary)]",
  gradient: "bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]",
  dark: "bg-slate-950 text-white",
  pattern:
    "bg-white bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:20px_20px] bg-opacity-5",
};

const paddings = {
  sm: "py-10 sm:py-12",
  md: "py-12 sm:py-14 lg:py-16",
  lg: "py-14 sm:py-16 lg:py-20",
  xl: "py-16 sm:py-20 lg:py-24",
};

export const Section: FC<SectionProps> = ({
  children,
  background = "white",
  container = true,
  padding = "lg",
  className = "",
  ...props
}) => {
  return (
    <section className={cn(backgrounds[background], paddings[padding], className)} {...props}>
      {container ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
};

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
  /** When true, forces white text (e.g. on a dark/gradient background). Defaults to false (auto theme-aware). */
  light?: boolean;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  centered = true,
  light = false,
  className = "",
  ...props
}) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={cn("mb-12", centered && "text-center", className)} {...props}>
      <h2
        className={cn(
          "mb-4 text-3xl font-bold md:text-4xl lg:text-5xl",
          light ? "text-white" : isDark ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mx-auto max-w-3xl text-lg leading-relaxed md:text-xl",
            light ? "text-gray-200" : isDark ? "text-gray-300" : "text-gray-600",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Section;
