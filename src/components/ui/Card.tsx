// ============================================
// ComES Website - Card Component
// ============================================

import type { FC, HTMLAttributes } from "react";
import { cn } from "@/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  gradient?: boolean;
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

export const Card: FC<CardProps> = ({
  children,
  hoverable = false,
  padding = "md",
  gradient = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-white shadow-lg",
        paddings[padding],
        hoverable && "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: string;
}

export const CardHeader: FC<CardHeaderProps> = ({
  children,
  gradient,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn("p-6", gradient && `bg-gradient-to-r ${gradient} text-white`, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("border-t border-gray-100 bg-gray-50 px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
