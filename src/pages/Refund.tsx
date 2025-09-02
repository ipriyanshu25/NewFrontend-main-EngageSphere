import React from "react";
import { motion } from "framer-motion";

type Section = {
  id: string;
  title: string;
  content?: string;
  list?: string[];
};

const sections: Section[] = [
  {
    id: "eligibility",
    title: "1. Refund Eligibility",
    content:
      "We aim to deliver top-quality, real, and organic engagement services. Refunds are considered under the following conditions:",
    list: [
      "The service was not delivered as promised or failed to start.",
      "Technical issues prevented successful service delivery.",
      "Duplicate payments or accidental duplicate orders.",
      "Orders that are eligible for cancellation prior to completion (subject to review).",
    ],
  },
  {
    id: "request-process",
    title: "2. Refund Request Process",
    content:
      "To initiate a refund request, contact our support team within 10 days of your purchase and include your order ID, payment reference, and a clear explanation of the issue. Our review may take 7–10 business days. Approved refunds are processed within this timeframe.",
  },
  {
    id: "exclusions",
    title: "3. Non-Refundable Items",
    content: "The following scenarios are not eligible for a refund:",
    list: [
      "Services that have been fully delivered or completed.",
      "Custom or one-time promotional campaigns.",
      "Services used in violation of our Terms of Service.",
      "Orders older than 30 days from the date of purchase.",
    ],
  },
  {
    id: "method",
    title: "4. Refund Method",
    content:
      "Approved refunds will be returned to the original payment method used at checkout. Processing times may vary by your bank or payment provider. We cannot expedite external provider timelines.",
  },
  {
    id: "partial",
    title: "5. Partial Refunds & Credits",
    content: "At LikLet’s discretion, we may issue partial refunds or credits if:",
    list: [
      "Only part of the service was successfully delivered.",
      "There were minor delivery delays or service discrepancies.",
      "An alternative resolution has been mutually agreed upon.",
    ],
  },
  {
    id: "chargebacks",
    title: "6. Disputes & Chargebacks",
    content:
      "If you believe a charge is incorrect, please contact us first. Initiating a chargeback without engaging our support may delay resolution. We reserve the right to suspend services for accounts involved in unfounded chargebacks.",
  },
  {
    id: "subs",
    title: "7. Cancellations (Subscriptions & Recurring)",
    content:
      "If your plan includes recurring billing, you may cancel future renewals at any time before the next billing date. Cancellation stops future charges but does not retroactively refund prior periods unless explicitly stated in an applicable promotion.",
  },
  {
    id: "force-majeure",
    title: "8. Service Interruptions & Force Majeure",
    content:
      "We are not liable for delays or failures caused by events beyond our reasonable control (including third-party platform policy changes, outages, API limits, legal or regulatory actions, natural events). Where feasible, we may offer pro-rata credits rather than refunds.",
  },
  {
    id: "currency",
    title: "9. Currency, Fees & Taxes",
    content:
      "Refunds are issued in the original transaction currency. Exchange rate differences, intermediary bank fees, gateway fees, or taxes are non-refundable unless required by law.",
  },
  {
    id: "contact",
    title: "10. Contact Information",
    content:
      "For refund-related inquiries or assistance, please contact support@LikLet.com. We’ll make every effort to resolve your concerns quickly and fairly.",
  },
];

const Refund: React.FC = () => {
  const lastUpdated = "September 2, 2025";

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:bg-white focus:text-blue-700 focus:ring-2 focus:ring-blue-600 focus:rounded-md focus:px-3 focus:py-2 shadow"
      >
        Skip to content
      </a>

      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10 pt-24 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li>
              <a href="/" className="hover:text-gray-700">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700 font-medium">Refund Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Refund Policy
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            We value transparency and fairness. Here’s how refunds work at LikLet.
          </p>
          <p className="mt-1 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </motion.header>

        {/* Grid: sticky ToC + content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* TOC */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  On this page
                </h2>
                <ul className="space-y-2 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-gray-700 hover:text-blue-700 hover:underline"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main id="main-content" className="lg:col-span-8 xl:col-span-9">
            <motion.div
              className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-lg space-y-10 print:shadow-none print:border-0 print:p-0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {sections.map(({ id, title, content, list }) => (
                <section
                  key={id}
                  id={id}
                  aria-labelledby={`${id}-title`}
                  className="scroll-mt-28"
                >
                  <h2
                    id={`${id}-title`}
                    className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-900"
                  >
                    {title}
                  </h2>
                  {content && (
                    <p className="text-gray-700 leading-relaxed text-base">
                      {content}
                    </p>
                  )}
                  {list && (
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2 pl-2">
                      {list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Legal note */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  This Refund Policy should be read together with our Terms of
                  Service and Privacy Policy. Nothing in this policy limits any
                  statutory rights you may have under applicable law.
                </p>
              </div>
            </motion.div>

            {/* Back to top */}
            <div className="mt-6">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center text-sm font-medium text-blue-700 hover:underline"
              >
                Back to top
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Refund;
