"use client";

import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { buttonClassNames } from "@/presentation/components/ui";
import { scrollToSection } from "@/shared/utils/scrollToSection";
import styles from "./LandingNavbar.module.css";

export function LandingNavbar() {
  return (
    <BootstrapNavbar expand="md" className={styles.navbar} sticky="top" data-landing-header>
      <Container>
        <BootstrapNavbar.Brand as={Link} href="/" className={styles.brand}>
          <div className={styles.logoIcon}>
            <i className="bi-stars" aria-hidden="true" />
          </div>
          PostGen AI
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="landing-nav" />
        <BootstrapNavbar.Collapse id="landing-nav">
          <Nav className="ms-auto align-items-md-center gap-md-2 gap-2 mt-3 mt-md-0">
            <Nav.Link href="#features" className={styles.navLink}>
              Features
            </Nav.Link>
            <Nav.Link href="#how-it-works" className={styles.navLink}>
              How it works
            </Nav.Link>
            <Link href="/login" className={`${styles.navLink} nav-link`}>
              Log in
            </Link>
            <a
              href="#pricing"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pricing");
              }}
              className={buttonClassNames({ variant: "primary", size: "sm", className: "px-3" })}
            >
              Get started
            </a>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
