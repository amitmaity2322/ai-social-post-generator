"use client";

import Container from "react-bootstrap/Container";
import Link from "next/link";
import styles from "./LandingFooter.module.css";

export function LandingFooter() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual-only submission action
  };

  return (
    <footer className={styles.footer}>
      <Container>
        {/* Top directories section */}
        <div className={styles.topSection}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandIcon}>
                <i className="bi-stars" aria-hidden="true" />
              </div>
              <span>PostGen AI</span>
            </Link>
            <p className={styles.desc}>
              Generate high-impact, platform-optimized social media posts from a single prompt in seconds.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Twitter">
                <i className="bi-twitter-x" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                <i className="bi-linkedin" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">
                <i className="bi-instagram" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="GitHub">
                <i className="bi-github" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className={styles.colHeader}>Product</h4>
            <ul className={styles.linkList}>
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="/login">Dashboard</Link></li>
              <li><a href="#how-it-works">How it works</a></li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className={styles.colHeader}>Company</h4>
            <ul className={styles.linkList}>
              <li><Link href="/login">About Us</Link></li>
              <li><Link href="/register">Careers</Link></li>
              <li><Link href="/login">Privacy Policy</Link></li>
              <li><Link href="/login">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colHeader}>Stay Updated</h4>
            <p className={styles.desc} style={{ fontSize: "0.8125rem" }}>
              Subscribe to our newsletter for marketing tips and features update.
            </p>
            <form onSubmit={handleSubmit} className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                className={styles.newsletterInput} 
              />
              <button type="submit" className={styles.newsletterBtn}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} PostGen AI. All rights reserved. Made for creators.
          </p>
          <div className="d-flex gap-3 small" style={{ fontSize: "0.8125rem" }}>
            <Link href="/login" className="text-muted">Security</Link>
            <Link href="/login" className="text-muted">Status</Link>
            <Link href="/login" className="text-muted">Contact Support</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
