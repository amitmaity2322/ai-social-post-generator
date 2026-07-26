"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import { buttonClassNames } from "@/presentation/components/ui";
import { PLAN_FEATURES } from "@/shared/constants/planFeatures";
import styles from "./PricingSection.module.css";

interface PricingPlan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  note: string;
  highlighted?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: PLAN_FEATURES.free.tagline,
    features: PLAN_FEATURES.free.features,
    cta: "Start 15-Day Free Trial",
    href: "/register",
    note: "Includes a 15-day free trial, no card required",
  },
  {
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 15,
    tagline: PLAN_FEATURES.pro.tagline,
    features: PLAN_FEATURES.pro.features,
    cta: "Get Pro Plan",
    href: "/register?plan=pro",
    note: "No trial — instant access after payment",
    highlighted: true,
  },
  {
    name: "Business",
    priceMonthly: 49,
    priceYearly: 39,
    tagline: PLAN_FEATURES.business.tagline,
    features: PLAN_FEATURES.business.features,
    cta: "Get Business Plan",
    href: "/register?plan=business",
    note: "No trial — instant access after payment",
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className={styles.section}>
      <Container>
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className={styles.badge}>
            <i className="bi-credit-card-fill" /> Pricing Plans
          </span>
          <h2 className={styles.heading}>Simple pricing for every creator</h2>
          <p className={styles.subheading}>
            Choose the plan that fits your needs. Upgrade anytime as your content grows.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="text-center">
          <div className={styles.toggleContainer}>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`${styles.toggleBtn} ${billingCycle === "monthly" ? styles.toggleBtnActive : ""}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`${styles.toggleBtn} ${billingCycle === "yearly" ? styles.toggleBtnActive : ""}`}
            >
              Yearly
            </button>
            <span className={styles.discountBadge}>
              <i className="bi-gift-fill" /> Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <Row className="g-4 justify-content-center align-items-stretch">
          {PLANS.map((plan) => {
            const currentPrice = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            const hasBilledAmount = billingCycle === "yearly" && plan.priceYearly > 0;

            return (
              <Col key={plan.name} xs={12} md={6} lg={4}>
                <div
                  className={[
                    styles.card,
                    plan.highlighted ? styles.cardHighlighted : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {plan.highlighted && <span className={styles.cardBadge}>Most Popular</span>}

                  <h3 className={plan.name === "Pro" ? `${styles.planName} pg-brand-gradient` : styles.planName}>
                    {plan.name}
                  </h3>

                  <div className={styles.priceContainer}>
                    <span className={styles.priceSymbol}>£</span>
                    <span className={styles.price}>{currentPrice}</span>
                    <span className={styles.priceSuffix}>/month</span>
                  </div>

                  <div className={styles.yearlyBilled}>
                    {hasBilledAmount ? `Billed £${plan.priceYearly * 12}/year` : " "}
                  </div>

                  <p className={styles.tagline}>{plan.tagline}</p>

                  <ul className={styles.featureList}>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <i className="bi-check-circle-fill" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={buttonClassNames({
                      variant: plan.highlighted ? "primary" : "secondary",
                      size: "lg",
                      className: `${styles.pricingButton} ${plan.highlighted ? "shimmer-btn" : ""}`,
                      fullWidth: true,
                    })}
                  >
                    {plan.cta}
                  </Link>
                  <p className={styles.planNote}>{plan.note}</p>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
