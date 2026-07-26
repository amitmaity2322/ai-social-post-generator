const FAQS = [
  {
    question: "How many suggestions do I get per platform?",
    answer:
      "Every generation gives you multiple drafts per platform so you can compare and pick the one that fits best.",
  },
  {
    question: "Why can't I select some platforms?",
    answer:
      "Your subscription plan controls how many platforms you can generate for at once. Upgrade from Settings to unlock more.",
  },
  {
    question: "Does saving a post count toward my usage?",
    answer:
      "Yes — your dashboard's Total Posts and Platforms Covered stats update as soon as you save a generated post.",
  },
  {
    question: "Can I delete a saved post?",
    answer: "Yes, from the History page — open a post and choose Delete to remove it permanently.",
  },
];

export default function HelpSupportPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Help &amp; Support</h2>
        <p className="pg-text-muted mb-0">Answers to common questions about PostGen AI.</p>
      </div>

      <div className="pg-surface p-4 mb-3">
        <h3 className="h6 mb-3">Frequently asked questions</h3>
        <div className="d-flex flex-column gap-3">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <p className="fw-bold mb-1">{faq.question}</p>
              <p className="pg-text-muted mb-0 small">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pg-surface p-4">
        <h3 className="h6 mb-2">Still need help?</h3>
        <p className="pg-text-muted mb-0 small">
          Email us at <a href="mailto:support@postgen.ai">support@postgen.ai</a> and we&apos;ll get
          back to you.
        </p>
      </div>
    </div>
  );
}
