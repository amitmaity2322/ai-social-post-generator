"use client";

import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import { buttonClassNames } from "@/presentation/components/ui";
import { scrollToSection } from "@/shared/utils/scrollToSection";
import styles from "./HeroSection.module.css";

const FULL_PROMPT = "Create a launch post for our new eco-friendly water bottle 🌿";

const MOCK_POSTS = {
  instagram: {
    handle: "@ecohyped",
    avatarColor: "#e1306c",
    imageGradient: "linear-gradient(45deg, #f97316, #ec4899, #8b5cf6)",
    imageLabel: "🌿 EcoBottle Premium Visual Mockup",
    caption: "Meet the future of hydration. 💧 Crafting a healthier planet, one sip at a time. Made from 100% biodegradable steel. #sustainability #gogreen #ecolife",
    cta: "Shop Now 🛍️"
  },
  linkedin: {
    name: "Alex Rivera",
    role: "Head of Product @ GreenTech",
    avatarColor: "#0077b5",
    time: "1st • Just now",
    caption: "I'm thrilled to announce the official launch of the GreenTech EcoBottle! 🌿\n\nOur team has spent 18 months engineering a 100% sustainable alternative to plastic. Double-walled insulation, zero toxic chemicals, and manufactured with carbon-neutral methods. Let's make an impact together.",
    cta: "Join the movement: greentech.io/launch"
  },
  x: {
    name: "GreenTech Co.",
    handle: "@GreenTechCo",
    avatarColor: "#0f1419",
    caption: "Say hello to the EcoBottle. 🌿\n\n- 100% biodegradable\n- Keeps drinks cold for 24h\n- Zero microplastics\n- Sleek minimalist aesthetic\n\nAvailable now. Make a change today. 👇",
    cta: "greentech.io/ecobottle"
  }
};

export function HeroSection() {
  const [promptText, setPromptText] = useState("");
  const [step, setStep] = useState<"typing" | "generating" | "success">("typing");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"instagram" | "linkedin" | "x">("instagram");
  const [cursor, setCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursor((c) => !c);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Main animation loop
  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const runCycle = async () => {
      if (!isMounted) return;

      // 1. Typing Phase
      setStep("typing");
      setPromptText("");
      setProgress(0);
      setActiveTab("instagram");

      await new Promise((resolve) => {
        let i = 0;
        const typingInterval = setInterval(() => {
          if (!isMounted) {
            clearInterval(typingInterval);
            return;
          }
          if (i < FULL_PROMPT.length) {
            setPromptText((prev) => prev + FULL_PROMPT.charAt(i));
            i++;
          } else {
            clearInterval(typingInterval);
            timer = setTimeout(resolve, 1200);
          }
        }, 50);
      });

      if (!isMounted) return;

      // 2. Generating Phase
      setStep("generating");
      await new Promise((resolve) => {
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          if (!isMounted) {
            clearInterval(progressInterval);
            return;
          }
          if (currentProgress < 100) {
            currentProgress += 5;
            setProgress(currentProgress);
          } else {
            clearInterval(progressInterval);
            timer = setTimeout(resolve, 600);
          }
        }, 80);
      });

      if (!isMounted) return;

      // 3. Success / Showcase Phase
      setStep("success");
      
      // Instagram Showcase
      setActiveTab("instagram");
      await new Promise((resolve) => { timer = setTimeout(resolve, 3500); });
      if (!isMounted) return;

      // LinkedIn Showcase
      setActiveTab("linkedin");
      await new Promise((resolve) => { timer = setTimeout(resolve, 3500); });
      if (!isMounted) return;

      // X Showcase
      setActiveTab("x");
      await new Promise((resolve) => { timer = setTimeout(resolve, 3500); });
      if (!isMounted) return;

      // Wrap up and restart
      await new Promise((resolve) => { timer = setTimeout(resolve, 2000); });
      if (!isMounted) return;

      runCycle();
    };

    // Delay start slightly to let page settle
    timer = setTimeout(runCycle, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className={`pg-grid-bg ${styles.hero}`}>
      <Container>
        <Row className="align-items-center g-5">
          {/* Hero text section */}
          <Col lg={6} className="text-start animate-fade-in-up">
            <div className={styles.heroContent}>
              <span className={styles.badge}>
                <i className="bi-lightning-charge-fill" aria-hidden="true" /> Powered by Groq AI
              </span>
              <h1 className={styles.heading}>
                Turn one idea into a week of <span className="pg-brand-gradient">social posts</span>
              </h1>
              <p className={styles.subheading}>
                Generate on-brand Instagram, Facebook, LinkedIn, and X posts — complete with hooks,
                hashtags, CTAs, and image prompts — in seconds.
              </p>
              <div className={styles.actions}>
                <a
                  href="#pricing"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection("pricing");
                  }}
                  className={buttonClassNames({ variant: "primary", size: "lg", className: `shimmer-btn ${styles.heroButton}` })}
                >
                  Start generating free
                </a>
                <Link
                  href="#features"
                  className={buttonClassNames({ variant: "outline", size: "lg", className: styles.heroButton })}
                >
                  See how it works
                </Link>
              </div>
            </div>
          </Col>

          {/* Interactive Mockup Dashboard */}
          <Col lg={6} className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className={styles.mockupContainer}>
              <div className={styles.mockupWindow}>
                {/* macOS style header */}
                <div className={styles.mockupHeader}>
                  <div className={styles.windowControls}>
                    <div className={`${styles.controlDot} ${styles.controlClose}`} />
                    <div className={`${styles.controlDot} ${styles.controlMinimize}`} />
                    <div className={`${styles.controlDot} ${styles.controlMaximize}`} />
                  </div>
                  <div className={styles.windowTitle}>PostGen AI Assistant</div>
                  <div className={styles.windowMeta} />
                </div>

                {/* Main app preview layout */}
                <div className={styles.mockupBody}>
                  {/* Left panel: Prompt input */}
                  <div className={styles.sidebarSection}>
                    <div className="d-flex flex-column gap-1 text-start">
                      <span className={styles.promptLabel}>Your Topic / Idea</span>
                      <div className={styles.promptInputBox}>
                        {promptText}
                        {step === "typing" && cursor && <span className={styles.cursor} />}
                      </div>
                    </div>

                    <button 
                      className={`${styles.btnGenerate} ${step !== "typing" ? styles.btnGenerating : ""}`}
                      disabled={step !== "typing"}
                    >
                      {step === "typing" ? (
                        <>
                          <i className="bi-magic" /> Generate Campaign
                        </>
                      ) : (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          Processing...
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right panel: Social Output preview */}
                  <div className={styles.outputSection}>
                    {step === "typing" && (
                      <div className={styles.previewPlaceholder}>
                        <i className="bi-stars animate-float" />
                        <span className="fw-semibold">Ready to generate</span>
                        <span className="text-muted small">Enter an idea to draft social posts instantly.</span>
                      </div>
                    )}

                    {step === "generating" && (
                      <div className={styles.progressIndicator}>
                        <div className={styles.loadingSpinner} />
                        <span className={styles.loadingText}>Crafting copy and tags...</span>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {step === "success" && (
                      <div className="d-flex flex-column h-100">
                        {/* Tab header buttons */}
                        <div className={styles.platformPills}>
                          <button 
                            className={`${styles.pillBtn} ${activeTab === "instagram" ? styles.pillBtnActive : ""}`}
                            onClick={() => setActiveTab("instagram")}
                          >
                            <i className="bi-instagram" /> Instagram
                          </button>
                          <button 
                            className={`${styles.pillBtn} ${activeTab === "linkedin" ? styles.pillBtnActive : ""}`}
                            onClick={() => setActiveTab("linkedin")}
                          >
                            <i className="bi-linkedin" /> LinkedIn
                          </button>
                          <button 
                            className={`${styles.pillBtn} ${activeTab === "x" ? styles.pillBtnActive : ""}`}
                            onClick={() => setActiveTab("x")}
                          >
                            <i className="bi-twitter-x" /> X
                          </button>
                        </div>

                        {/* Rendering active card */}
                        {activeTab === "instagram" && (
                          <div className={styles.resultCard}>
                            <div className={styles.cardHeader}>
                              <div className={styles.avatar} style={{ background: MOCK_POSTS.instagram.avatarColor }}>
                                <i className="bi-instagram" />
                              </div>
                              <div className={styles.metaText}>
                                <span className={styles.name}>{MOCK_POSTS.instagram.handle}</span>
                                <span className={styles.handle}>Instagram Post</span>
                              </div>
                            </div>
                            <div 
                              className={styles.instagramImage} 
                              style={{ background: MOCK_POSTS.instagram.imageGradient }}
                            >
                              <span>{MOCK_POSTS.instagram.imageLabel}</span>
                            </div>
                            <div className={styles.cardBody}>
                              {MOCK_POSTS.instagram.caption}
                            </div>
                            <div className={styles.ctaBox}>
                              <span>CTA Option:</span>
                              <span>{MOCK_POSTS.instagram.cta}</span>
                            </div>
                          </div>
                        )}

                        {activeTab === "linkedin" && (
                          <div className={styles.resultCard}>
                            <div className={styles.cardHeader}>
                              <div className={styles.avatar} style={{ background: MOCK_POSTS.linkedin.avatarColor }}>
                                <i className="bi-linkedin" />
                              </div>
                              <div className={styles.metaText}>
                                <span className={styles.name}>{MOCK_POSTS.linkedin.name}</span>
                                <span className={styles.handle}>{MOCK_POSTS.linkedin.role}</span>
                                <span className={`${styles.handle} text-muted d-flex gap-1 align-items-center`} style={{ fontSize: "0.6875rem" }}>
                                  {MOCK_POSTS.linkedin.time}
                                </span>
                              </div>
                            </div>
                            <div className={styles.cardBody} style={{ fontSize: "0.75rem" }}>
                              {MOCK_POSTS.linkedin.caption}
                            </div>
                            <div className={styles.ctaBox}>
                              <span>Link Attachment:</span>
                              <span>{MOCK_POSTS.linkedin.cta}</span>
                            </div>
                          </div>
                        )}

                        {activeTab === "x" && (
                          <div className={styles.resultCard}>
                            <div className={styles.cardHeader}>
                              <div className={styles.avatar} style={{ background: MOCK_POSTS.x.avatarColor }}>
                                <i className="bi-twitter-x" />
                              </div>
                              <div className={styles.metaText}>
                                <span className={styles.name}>{MOCK_POSTS.x.name}</span>
                                <span className={styles.handle}>{MOCK_POSTS.x.handle}</span>
                              </div>
                            </div>
                            <div className={styles.cardBody}>
                              {MOCK_POSTS.x.caption}
                            </div>
                            <div className={styles.ctaBox}>
                              <span>Call to action:</span>
                              <span>{MOCK_POSTS.x.cta}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
