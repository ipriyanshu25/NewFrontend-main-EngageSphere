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
    id: "info-we-collect",
    title: "1. Information We Collect",
    content:
      "We collect personal data you provide when registering, purchasing services, or contacting us. This includes:",
    list: [
      "Name, email, and account information",
      "Social media handles strictly for service delivery",
      "Payment information (processed securely by trusted providers)",
      "Service usage data, device info, and communication preferences",
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Data",
    content: "We use your information to:",
    list: [
      "Deliver real, organic engagement services",
      "Process payments and manage your account",
      "Improve features, performance, and security",
      "Send service updates and (if opted in) marketing messages",
      "Comply with legal and regulatory obligations",
    ],
  },
  {
    id: "sharing",
    title: "3. Data Sharing",
    content:
      "We do not sell personal information. We may share limited data with:",
    list: [
      "Payment processors and vetted service providers under contract",
      "Legal/regulatory authorities where required by law",
      "Business partners only with your explicit consent",
    ],
  },
  {
    id: "security",
    title: "4. Security Measures",
    content:
      "We apply encryption, access controls, and regular security reviews to protect your data. No method is 100% secure, but we take appropriate and proportionate safeguards.",
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: "Subject to applicable law, you may:",
    list: [
      "Access, correct, or update your personal data",
      "Request deletion (erasure) of your information",
      "Object to or restrict certain processing activities",
      "Opt out of marketing communications at any time",
      "Lodge a complaint with a supervisory authority",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    content:
      "We use cookies and similar technologies for functionality, analytics, and to improve user experience. You can manage cookies via your browser settings.",
  },
  {
    id: "transfers",
    title: "7. International Data Transfers",
    content:
      "Your data may be processed in countries outside your own. Where required, we use appropriate safeguards (such as contractual clauses) to protect your information.",
  },
  {
    id: "retention",
    title: "8. Data Retention",
    content:
      "We retain personal data only as long as necessary for the purposes outlined in this Policy, to comply with legal obligations, resolve disputes, and enforce agreements.",
  },
  {
    id: "children",
    title: "9. Children’s Privacy",
    content:
      "Our services are not directed to children under 13 (or the age defined by local law). We do not knowingly collect data from children. If you believe a child has provided data, contact us to delete it.",
  },
  {
    id: "law",
    title: "10. Governing Law",
    content:
      "This Privacy Policy is governed by the laws of India. Any disputes will be resolved in the courts of Mathura, Uttar Pradesh, India.",
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content:
      "We may update this Policy to reflect changes in practices or legal requirements. Material changes will be communicated via our website or email notifications where appropriate.",
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content:
      "If you have questions or requests regarding your privacy, contact us at privacy@LikLet.com.",
  },
];

const Privacy: React.FC = () => {
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
            <li className="text-gray-700 font-medium">Privacy Policy</li>
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
            Privacy Policy
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            We respect your privacy and are committed to protecting your personal data.
          </p>
          <p className="mt-1 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </motion.header>

        {/* Grid: sticky ToC + content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sticky TOC */}
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

          {/* Main content */}
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
                  This Policy should be read with our Terms of Service and Refund Policy.
                  Depending on your location, additional rights may apply under local law.
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

export default Privacy;
