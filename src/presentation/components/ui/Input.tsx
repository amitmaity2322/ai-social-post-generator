import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./FormControls.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, required, id, className, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[styles.control, error ? styles.controlError : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className={styles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
