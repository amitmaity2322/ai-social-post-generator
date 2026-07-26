"use client";

import { ReactNode, createContext, useCallback, useMemo, useState } from "react";
import BootstrapToast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  message: string;
}

export interface ToastContextValue {
  showToast: (variant: ToastVariant, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const variantBg: Record<ToastVariant, string> = {
  success: "success",
  error: "danger",
  info: "info",
  warning: "warning",
};

const darkTextVariants: ToastVariant[] = ["info", "warning"];

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((variant: ToastVariant, message: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, variant, message }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1080 }}>
        {toasts.map((toast) => (
          <BootstrapToast
            key={toast.id}
            bg={variantBg[toast.variant]}
            onClose={() => dismissToast(toast.id)}
            delay={4000}
            autohide
          >
            <BootstrapToast.Body
              className={darkTextVariants.includes(toast.variant) ? "" : "text-white"}
            >
              {toast.message}
            </BootstrapToast.Body>
          </BootstrapToast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
