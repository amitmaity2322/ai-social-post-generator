"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./TestimonialsSection.module.css";

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
}

const STATS: Stat[] = [
  { value: "5M+", label: "Posts Generated" },
  { value: "85%", label: "Time Saved" },
  { value: "12k+", label: "Happy Creators" },
  { value: "4.9/5", label: "User Rating" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Social Media Director @ BrandFlow",
    initials: "SJ",
    quote: "PostGen AI has literally given me back 10 hours a week. I write down one key campaign topic, and I get customized drafts for X, LinkedIn, and Instagram in under a minute.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Solo Founder @ ShipFast",
    initials: "DK",
    quote: "As a solo developer, marketing copy was always my bottleneck. Now I plan, generate, and edit a full week of high-engagement social media posts on Monday morning before standup.",
    rating: 5,
  },
  {
    name: "Maria G.",
    role: "Digital Marketer & Consultant",
    initials: "MG",
    quote: "The outputs here don't feel like robotic boilerplate. The platform-specific customization options and hooks generators keep my messaging sharp, fresh, and relevant.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <Container>
        {/* Section Header */}
        <div className="text-center">
          <span className={styles.badge}>
            <i className="bi-people-fill" /> Social Proof
          </span>
          <h2 className={styles.heading}>Loved by social media managers and founders</h2>
          <p className={styles.subheading}>
            See how creators and brands are scaling their social output and driving traffic using PostGen AI.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className={styles.statsContainer}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.value}</div>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <Row className={`${styles.testimonialsRow} g-4 justify-content-center`}>
          {TESTIMONIALS.map((testimonial) => (
            <Col key={testimonial.name} xs={12} lg={4}>
              <div className={styles.card}>
                <div className={styles.stars}>
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <i key={idx} className="bi-star-fill" aria-hidden="true" />
                  ))}
                </div>
                <p className={styles.quote}>&ldquo;{testimonial.quote}&rdquo;</p>
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>{testimonial.initials}</div>
                  <div className={styles.authorMeta}>
                    <span className={styles.name}>{testimonial.name}</span>
                    <span className={styles.role}>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
