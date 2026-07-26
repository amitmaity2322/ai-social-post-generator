"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./WorkflowSection.module.css";

interface Step {
  num: string;
  icon: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    icon: "bi-pencil-square",
    title: "Input Your Topic",
    description: "Type in a product launch, a blog post URL, or a simple marketing concept you want to share with the world.",
  },
  {
    num: "02",
    icon: "bi-sliders",
    title: "Customize Tone & Channels",
    description: "Choose which channels to target and choose an alignment tone—professional, humorous, educational, or promotional.",
  },
  {
    num: "03",
    icon: "bi-check2-all",
    title: "Refine & Publish",
    description: "Instantly preview your posts. Modify texts, swap hash suggestions, and push immediately to copy or your scheduler calendar.",
  },
];

export function WorkflowSection() {
  return (
    <section id="how-it-works" className={styles.section}>
      <Container>
        {/* Section Header */}
        <div className="text-center">
          <span className={styles.badge}>
            <i className="bi-cpu" /> Simple Workflow
          </span>
          <h2 className={styles.heading}>Generate campaigns in 3 easy steps</h2>
          <p className={styles.subheading}>
            Our automated pipeline handles the complex formatting, platform restrictions, and copywriting rules for you.
          </p>
        </div>

        {/* Steps Grid */}
        <Row className={`${styles.stepRow} g-4 justify-content-center`}>
          {STEPS.map((step) => (
            <Col key={step.num} xs={12} lg={4} className={styles.stepCol}>
              <div className={styles.card}>
                <span className={styles.stepNumber}>{step.num}</span>
                <div className={styles.iconWrap}>
                  <i className={step.icon} aria-hidden="true" />
                </div>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardText}>{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
