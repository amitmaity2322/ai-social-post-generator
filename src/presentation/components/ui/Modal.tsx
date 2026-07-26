"use client";

import { ReactNode } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { Button } from "./Button";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg" | "xl";
}

export function Modal({ show, onClose, title, children, footer, size }: ModalProps) {
  return (
    <BootstrapModal show={show} onHide={onClose} centered size={size}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{children}</BootstrapModal.Body>
      <BootstrapModal.Footer>
        {footer ?? (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
}
