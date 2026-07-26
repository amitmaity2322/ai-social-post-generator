import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/** Shared class-name builder so non-<button> elements (e.g. a Link styled as a CTA) can reuse the exact same look. */
export function buttonClassNames({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClassNames({ variant, size, fullWidth, className })}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      ) : (
        leftIcon && <i className={leftIcon} aria-hidden="true" />
      )}
      {children}
      {!isLoading && rightIcon && <i className={rightIcon} aria-hidden="true" />}
    </button>
  );
}
