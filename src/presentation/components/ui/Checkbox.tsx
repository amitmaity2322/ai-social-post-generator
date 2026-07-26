import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./FormControls.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...rest },
  ref,
) {
  const checkboxId = id ?? rest.name;

  return (
    <div className={styles.checkboxRow}>
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        className={[styles.checkboxInput, className].filter(Boolean).join(" ")}
        {...rest}
      />
      <label htmlFor={checkboxId} className="mb-0">
        {label}
      </label>
    </div>
  );
});
