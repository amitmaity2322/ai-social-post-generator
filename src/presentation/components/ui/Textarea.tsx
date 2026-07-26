import { TextareaHTMLAttributes, forwardRef } from "react";
import styles from "./FormControls.module.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, helperText, required, id, className, rows = 4, ...rest },
  ref,
) {
  const textareaId = id ?? rest.name;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={[styles.control, error ? styles.controlError : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...rest}
      />
      {error ? (
        <p id={`${textareaId}-error`} className={styles.errorText}>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${textareaId}-helper`} className={styles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
