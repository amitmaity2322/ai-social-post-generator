"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/presentation/components/ui/Input";
import { Button } from "@/presentation/components/ui/Button";
import { useToast } from "@/presentation/hooks/useToast";
import { changePlan } from "@/presentation/services/accountService";
import { PLAN_LABELS, PLAN_MONTHLY_PRICE, type SubscriptionPlan } from "@/shared/constants/plans";
import { PLAN_FEATURES } from "@/shared/constants/planFeatures";
import styles from "./CheckoutForm.module.css";

interface CheckoutFormProps {
  plan: Extract<SubscriptionPlan, "pro" | "business">;
}

/** Simulated payment gateway latency - nothing here is transmitted or stored, it only gates the moment `changePlan` is called. */
const PROCESSING_DELAY_MS = 1400;
const REDIRECT_DELAY_MS = 1400;

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutForm({ plan }: CheckoutFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!cardName.trim()) nextErrors.cardName = "Enter the name on the card.";
    if (cardNumber.replace(/\D/g, "").length !== 16) {
      nextErrors.cardNumber = "Enter a valid 16-digit card number.";
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      nextErrors.expiry = "Use MM/YY format.";
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      nextErrors.cvc = "Enter a valid CVC.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, PROCESSING_DELAY_MS));
      await changePlan(plan);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, REDIRECT_DELAY_MS);
    } catch (error) {
      setIsProcessing(false);
      showToast("error", error instanceof Error ? error.message : "Payment failed. Please try again.");
    }
  }

  if (isSuccess) {
    return (
      <div className={`pg-surface ${styles.successPanel}`}>
        <span className={styles.successIcon}>
          <i className="bi-check-lg" aria-hidden="true" />
        </span>
        <h2 className={styles.successTitle}>Payment successful</h2>
        <p className={styles.successText}>
          Your {PLAN_LABELS[plan]} plan is now active — every {PLAN_LABELS[plan]} feature is
          unlocked. Taking you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={`pg-surface ${styles.summary}`}>
        <span className={styles.summaryBadge}>Order summary</span>
        <h2 className={styles.planName}>{PLAN_LABELS[plan]} Plan</h2>
        <div className={styles.priceRow}>
          <span className={styles.price}>£{PLAN_MONTHLY_PRICE[plan]}</span>
          <span className={styles.priceSuffix}>/month, billed monthly</span>
        </div>
        <p className={styles.tagline}>{PLAN_FEATURES[plan].tagline}</p>
        <ul className={styles.featureList}>
          {PLAN_FEATURES[plan].features.map((feature) => (
            <li key={feature}>
              <i className="bi-check-circle-fill" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={styles.noTrialNote}>
          <i className="bi-info-circle" aria-hidden="true" />
          <span>Paid plans activate immediately after payment — no trial period applies.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`pg-surface ${styles.paymentCard}`} noValidate>
        <h2 className={styles.paymentTitle}>
          <i className="bi-credit-card-fill me-2" aria-hidden="true" />
          Payment details
        </h2>

        <Input
          label="Name on card"
          name="cardName"
          placeholder="Jamie Doe"
          value={cardName}
          onChange={(event) => setCardName(event.target.value)}
          error={errors.cardName}
          required
        />
        <Input
          label="Card number"
          name="cardNumber"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
          error={errors.cardNumber}
          required
        />
        <div className={styles.row}>
          <Input
            label="Expiry"
            name="expiry"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry}
            onChange={(event) => setExpiry(formatExpiry(event.target.value))}
            error={errors.expiry}
            required
          />
          <Input
            label="CVC"
            name="cvc"
            inputMode="numeric"
            placeholder="123"
            value={cvc}
            onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
            error={errors.cvc}
            required
          />
        </div>

        <Button type="submit" fullWidth isLoading={isProcessing} leftIcon="bi-lock-fill">
          {isProcessing ? "Processing payment…" : `Pay £${PLAN_MONTHLY_PRICE[plan]} & activate ${PLAN_LABELS[plan]}`}
        </Button>

        <p className={styles.secureNote}>
          <i className="bi-shield-lock-fill me-1" aria-hidden="true" />
          This is a demo checkout — no real payment is processed or stored.
        </p>

        <Link href="/subscription" className={styles.backLink}>
          <i className="bi-arrow-left me-1" aria-hidden="true" />
          Back to plans
        </Link>
      </form>
    </div>
  );
}
