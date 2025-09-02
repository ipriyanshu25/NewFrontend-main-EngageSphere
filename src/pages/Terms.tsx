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
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using LikLet's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  },
  {
    id: "service-description",
    title: "2. Service Description",
    content:
      "LikLet provides 100% real and organic social media growth services across multiple platforms. We do not use bots, fake accounts, or automated systems. Our services are designed to help increase your social media presence through authentic engagement.",
  },
  {
    id: "user-obligations",
    title: "3. User Obligations",
    list: [
      "You must be at least 18 years old to use our services or have parental consent.",
      "You must provide accurate and complete information when using our services.",
      "You are responsible for maintaining the security of your account.",
      "You agree not to use our services for any illegal or unauthorized purpose.",
    ],
  },
  {
    id: "prohibited-activities",
    title: "4. Prohibited Activities",
    list: [
      "Engaging in spamming, misleading promotions, or fraudulent activities.",
      "Uploading or sharing harmful, offensive, or unlawful content.",
      "Interfering with the platform’s operation or attempting to bypass security features.",
      "Using the service to promote hate speech, harassment, or abusive behavior.",
    ],
  },
  {
    id: "payments",
    title: "5. Payment Terms",
    content:
      "All payments are processed securely through our payment providers. Prices are subject to change with notice. Refunds are handled according to our Refund Policy.",
  },
  {
    id: "delivery",
    title: "6. Service Delivery",
    content:
      "We strive to deliver services promptly within 24–48 hours, but delivery times may vary based on order size, platform policies, or technical issues.",
  },
  {
    id: "privacy",
    title: "7. Privacy and Data Protection",
    content:
      "We respect your privacy and handle your data in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your information as outlined in our Privacy Policy.",
  },
  {
    id: "suspension",
    title: "8. Account Suspension & Termination",
    content:
      "We reserve the right to suspend or terminate accounts at our discretion if users violate these terms, misuse our services, or engage in harmful activities. Suspended or terminated accounts may lose access to services without refund.",
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content:
      "LikLet’s liability is strictly limited to the amount charged from the customer, less the costs incurred by us in providing the services. We are not liable for indirect, incidental, or consequential damages resulting from your use of our services.",
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    content:
      "All content on www.liklet.com, including branding, design, graphics, and software, is owned by LikLet and protected by applicable intellectual property laws. You may not copy, modify, or redistribute our content without written consent.",
  },
  {
    id: "indemnity",
    title: "11. Indemnification",
    content:
      "You agree to indemnify and hold LikLet, its affiliates, partners, and employees harmless from any claims, liabilities, damages, or expenses arising out of your use of our services or violation of these terms.",
  },
  {
    id: "warranty",
    title: "12. Disclaimer of Warranties",
    content:
      "Our services are provided on an 'as is' and 'as available' basis. We do not guarantee that services will be uninterrupted, error-free, or that results will meet your expectations.",
  },
  {
    id: "third-party",
    title: "13. Third-Party Platforms",
    content:
      "Our services depend on third-party social media platforms. We are not responsible for changes, restrictions, or suspensions made by those platforms that may affect service delivery.",
  },
  {
    id: "law",
    title: "14. Governing Law & Jurisdiction",
    content:
      "These Terms are governed by the laws of India. Any disputes will be resolved in the courts of Mathura, Uttar Pradesh, India.",
  },
  {
    id: "changes",
    title: "15. Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.",
  },
  {
    id: "contact",
    title: "16. Contact Information",
    content:
      "For questions about these Terms of Service, please contact us at legal@LikLet.com.",
  },
];

const Terms: React.FC = () => {
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

      {/* Page wrapper */}
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
            <li className="text-gray-700 font-medium">Terms of Service</li>
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
            Terms of Service
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Please review these terms carefully before using LikLet.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </motion.header>

        {/* Main grid: sticky ToC + content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar TOC */}
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
              {sections.map(({ id, title, content, list }, idx) => (
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

              {/* Gentle legal note */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  These terms constitute a general framework for using LikLet’s
                  services and do not constitute legal advice. You should
                  consult your own legal counsel for advice specific to your
                  situation.
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

export default Terms;
