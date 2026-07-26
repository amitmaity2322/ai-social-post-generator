"use client";

import { useContext } from "react";
import { ToastContext } from "@/presentation/components/ui/Toast";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
