"use client";

import Container from "react-bootstrap/Container";
import { buttonClassNames } from "@/presentation/components/ui";
import { scrollToSection } from "@/shared/utils/scrollToSection";
import styles from "./CTASection.module.css";

export function CTASection() {
  return (
    <section id="how-it-works" className={styles.section}>
      <Container>
        <div className={styles.panel}>
          {/* Visual glow orb */}
          <div className={styles.glowOrb} />

          <h2 className={styles.heading}>Ready to post everywhere, faster?</h2>
          <p className={styles.text}>
            Pick a topic, choose your platforms and tone, and get a full content set in seconds.
          </p>

          <div className={styles.ctaBtnWrapper}>
            <a
              href="#pricing"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pricing");
              }}
              className={buttonClassNames({ variant: "secondary", size: "lg", className: "shimmer-btn px-5" })}
            >
              Create your first post
            </a>

            {/* Trust badges */}
            <div className={styles.trustBadges}>
              <span className={styles.badgeItem}>
                <i className="bi-shield-check" /> No credit card required
              </span>
              <span className={styles.badgeItem}>
                <i className="bi-lightning-charge" /> 15-day free trial
              </span>
              <span className={styles.badgeItem}>
                <i className="bi-arrow-repeat" /> Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
