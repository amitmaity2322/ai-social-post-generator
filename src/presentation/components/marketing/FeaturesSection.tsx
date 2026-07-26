"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./FeaturesSection.module.css";

interface Feature {
  icon: string;
  title: string;
  description: string;
  theme: {
    hoverColor: string;
    hoverShadow: string;
    hoverGradient: string;
    iconBg: string;
    iconColor: string;
  };
}

const FEATURES: Feature[] = [
  {
    icon: "bi-instagram",
    title: "Instagram posts",
    description: "Scroll-stopping captions tuned for engagement and reach.",
    theme: {
      hoverColor: "#e1306c",
      hoverShadow: "rgba(225, 48, 108, 0.15)",
      hoverGradient: "linear-gradient(90deg, #f97316, #e1306c, #b5179e)",
      iconBg: "rgba(225, 48, 108, 0.1)",
      iconColor: "#e1306c"
    }
  },
  {
    icon: "bi-facebook",
    title: "Facebook posts",
    description: "Conversational copy built to drive comments and shares.",
    theme: {
      hoverColor: "#1877f2",
      hoverShadow: "rgba(24, 119, 242, 0.15)",
      hoverGradient: "linear-gradient(90deg, #1877f2, #0d6efd)",
      iconBg: "rgba(24, 119, 242, 0.1)",
      iconColor: "#1877f2"
    }
  },
  {
    icon: "bi-linkedin",
    title: "LinkedIn posts",
    description: "Professional, thought-leadership tone for your network.",
    theme: {
      hoverColor: "#0077b5",
      hoverShadow: "rgba(0, 119, 181, 0.15)",
      hoverGradient: "linear-gradient(90deg, #0077b5, #0a66c2)",
      iconBg: "rgba(0, 119, 181, 0.1)",
      iconColor: "#0077b5"
    }
  },
  {
    icon: "bi-twitter-x",
    title: "X posts",
    description: "Punchy, concise copy that fits the platform's pace.",
    theme: {
      hoverColor: "var(--pg-text)",
      hoverShadow: "rgba(100, 100, 100, 0.15)",
      hoverGradient: "linear-gradient(90deg, var(--pg-text-muted), var(--pg-text))",
      iconBg: "rgba(100, 100, 100, 0.1)",
      iconColor: "var(--pg-text)"
    }
  },
  {
    icon: "bi-hash",
    title: "Hashtags",
    description: "Relevant, discoverable hashtag sets for every platform.",
    theme: {
      hoverColor: "#eab308",
      hoverShadow: "rgba(234, 179, 8, 0.15)",
      hoverGradient: "linear-gradient(90deg, #eab308, #ca8a04)",
      iconBg: "rgba(234, 179, 8, 0.1)",
      iconColor: "#ca8a04"
    }
  },
  {
    icon: "bi-megaphone",
    title: "Calls to action",
    description: "Clear CTAs that turn readers into customers.",
    theme: {
      hoverColor: "#ef4444",
      hoverShadow: "rgba(239, 68, 68, 0.15)",
      hoverGradient: "linear-gradient(90deg, #ef4444, #dc2626)",
      iconBg: "rgba(239, 68, 68, 0.1)",
      iconColor: "#dc2626"
    }
  },
  {
    icon: "bi-magic",
    title: "Hooks",
    description: "Attention-grabbing opening lines that stop the scroll.",
    theme: {
      hoverColor: "#8b5cf6",
      hoverShadow: "rgba(139, 92, 246, 0.15)",
      hoverGradient: "linear-gradient(90deg, #8b5cf6, #d946ef)",
      iconBg: "rgba(139, 92, 246, 0.1)",
      iconColor: "#8b5cf6"
    }
  },
  {
    icon: "bi-image",
    title: "Image prompts",
    description: "Ready-to-use prompts for your image generator of choice.",
    theme: {
      hoverColor: "#06b6d4",
      hoverShadow: "rgba(6, 182, 212, 0.15)",
      hoverGradient: "linear-gradient(90deg, #06b6d4, #3b82f6)",
      iconBg: "rgba(6, 182, 212, 0.1)",
      iconColor: "#06b6d4"
    }
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className={styles.section}>
      <Container>
        <div className="text-center mb-5">
          <span className={styles.badge}>
            <i className="bi-grid-fill" /> Key Features
          </span>
          <h2 className={styles.heading}>Everything you need for a post, generated at once</h2>
          <p className={styles.subheading}>One topic in, a complete multi-platform content set out.</p>
        </div>
        <Row className="g-4">
          {FEATURES.map((feature) => (
            <Col key={feature.title} xs={12} sm={6} lg={3}>
              <div 
                className={styles.card}
                style={{
                  ["--hover-color" as string]: feature.theme.hoverColor,
                  ["--hover-shadow" as string]: feature.theme.hoverShadow,
                  ["--hover-gradient" as string]: feature.theme.hoverGradient,
                  ["--icon-bg" as string]: feature.theme.iconBg,
                  ["--icon-color" as string]: feature.theme.iconColor,
                } as React.CSSProperties}
              >
                <div className={styles.iconWrap}>
                  <i className={feature.icon} aria-hidden="true" />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardText}>{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
