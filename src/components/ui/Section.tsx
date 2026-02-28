// ============================================
// ComES Website - Section Component
// ============================================

import type { FC, HTMLAttributes } from "react";
import { cn } from "@/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: "white" | "gray" | "gradient" | "dark" | "pattern";
  container?: boolean;
  padding?: "sm" | "md" | "lg" | "xl";
}

const backgrounds = {
  white: "bg-white",
  gray: "bg-gray-50",
  gradient: "bg-gradient-to-b from-white to-gray-50",
  dark: "bg-gradient-to-r from-comesBlue to-blue-600 text-white",
  pattern:
    "bg-white bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:20px_20px] bg-opacity-5",
};

const paddings = {
  sm: "py-12",
  md: "py-16",
  lg: "py-20",
  xl: "py-24",
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
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  centered = true,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("mb-12", centered && "text-center", className)} {...props}>
      <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-200 md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Section;
