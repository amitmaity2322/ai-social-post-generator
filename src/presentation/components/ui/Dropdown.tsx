import { SelectHTMLAttributes, forwardRef } from "react";
import styles from "./FormControls.module.css";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: DropdownOption[];
  placeholder?: string;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(function Dropdown(
  { label, error, helperText, required, options, placeholder, id, className, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={[styles.control, error ? styles.controlError : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className={styles.errorText}>{error}</p>
      ) : helperText ? (
        <p className={styles.helper}>{helperText}</p>
      ) : null}
    </div>
  );
});
