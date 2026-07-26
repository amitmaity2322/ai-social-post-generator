"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import styles from "./FAQSection.module.css";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the AI post generator work?",
    answer: "PostGen AI uses advanced large language models tuned specifically on social media engagement trends. When you provide an idea, it crafts structured, platform-specific content tailored for X (concise structure), LinkedIn (professional thought-leadership), and Instagram (caption hook and visual details) in a single request.",
  },
  {
    question: "Can I connect and publish directly to my social networks?",
    answer: "Yes! Our visual marketing planner dashboard allows you to link your official profiles for direct scheduled publication. You can manage everything inside a calendar pipeline without swapping between multiple tools.",
  },
  {
    question: "Which social media platforms are supported?",
    answer: "We fully support generation and direct scheduling for Instagram, LinkedIn, X (formerly Twitter), and Facebook pages. We're actively working on adding support for Threads, YouTube Community, and TikTok in upcoming feature updates.",
  },
  {
    question: "Is there a free trial and do I need a credit card?",
    answer: "No credit card is required to try PostGen AI. Our Free tier includes 10 AI generation campaigns per month so you can test the quality of outputs. You can upgrade to a paid Pro tier at any time for unlimited campaigns.",
  },
  {
    question: "What are image prompts and how do I use them?",
    answer: "Along with social copy, our engine writes highly detailed text-to-image prompts optimized for Midjourney, DALL-E, and Stable Diffusion. You can copy and paste these directly into your generator of choice to build matching visuals.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <Container>
        {/* Section Header */}
        <div className="text-center">
          <span className={styles.badge}>
            <i className="bi-question-circle-fill" /> Help Center
          </span>
          <h2 className={styles.heading}>Frequently Asked Questions</h2>
          <p className={styles.subheading}>
            Got questions about PostGen AI? Find answers to commonly asked questions below.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className={styles.faqContainer}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={[
                  styles.faqItem,
                  isOpen ? styles.faqItemActive : ""
                ].filter(Boolean).join(" ")}
              >
                <button 
                  onClick={() => toggleFAQ(index)}
                  className={styles.faqHeader}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <i className={`bi-chevron-down ${styles.faqIcon}`} aria-hidden="true" />
                </button>
                <div 
                  className={styles.faqCollapse}
                  style={{ maxHeight: isOpen ? "200px" : "0" }}
                >
                  <div className={styles.faqBody}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
