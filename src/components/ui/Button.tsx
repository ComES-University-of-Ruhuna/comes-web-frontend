// ============================================
// ComES Website - Button Component
// ============================================

import type { FC, ButtonHTMLAttributes } from "react";
import { Link } from "react-router";
import { cn } from "@/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary: "bg-comesBlue text-white hover:bg-blue-800 shadow-lg hover:shadow-xl",
  secondary: "bg-comesGold text-comesBlue hover:bg-yellow-400 shadow-lg hover:shadow-xl",
  outline: "border-2 border-comesBlue text-comesBlue hover:bg-comesBlue hover:text-white",
  ghost: "text-comesBlue hover:bg-blue-50",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "right",
  className = "",
  ...props
}) => {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full",
    "transition-all duration-300 transform",
    "focus:outline-none focus:ring-2 focus:ring-comesBlue focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    !disabled && !loading && "hover:scale-105",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {loading && (
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && iconPosition === "left" && !loading && icon}
      {children}
      {icon && iconPosition === "right" && !loading && icon}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseStyles}>
          {content}
        </a>
      );
    }

    return (
      <Link to={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseStyles} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
};

export default Button;
