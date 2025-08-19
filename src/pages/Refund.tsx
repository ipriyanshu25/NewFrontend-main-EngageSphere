import React from 'react';
import { motion } from 'framer-motion';

const Refund: React.FC = () => {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-gradient-to-tr from-[#000e1f] via-[#001e3c] to-[#001730] text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold">Refund Policy</h1>
          <p className="text-white/80 mt-2 text-lg">
            Learn how we handle returns and maintain transparency in the kingdom.
          </p>
        </motion.div>

        <motion.div
          className="bg-black/20 border border-[#00264D]/60 rounded-3xl p-10 shadow-xl space-y-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            {
              title: "1. Refund Eligibility",
              content:
                "We offer a 30-day money-back guarantee on our services under the following conditions:",
              list: [
                "Service was not delivered as described",
                "Technical issues prevented service delivery",
                "Order was accidentally duplicated",
                "Service is no longer needed (subject to review)",
              ],
            },
            {
              title: "2. Refund Process",
              content: "To request a refund:",
              list: [
                "Contact our support team within 30 days of purchase",
                "Provide your order number and reason for refund",
                "Allow up to 5-7 business days for review",
                "Approved refunds are processed within 3-5 business days",
              ],
            },
            {
              title: "3. Non-Refundable Items",
              content: "The following are not eligible for refunds:",
              list: [
                "Services that have been fully delivered",
                "Custom or personalized orders",
                "Services used in violation of our terms",
                "Purchases older than 30 days",
              ],
            },
            {
              title: "4. Refund Methods",
              content:
                "Refunds are processed to the original payment method used for the purchase. Processing times may vary depending on your payment provider.",
            },
            {
              title: "5. Partial Refunds",
              content: "In some cases, we may issue partial refunds if:",
              list: [
                "Service was partially delivered",
                "Quality issues affected only part of the service",
                "Alternative resolution is agreed upon",
              ],
            },
            {
              title: "6. Contact Information",
              content:
                "For refund requests or questions about our refund policy, please contact our support team at support@engagesphere.com.",
            },
          ].map(({ title, content, list }, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-semibold mb-4 border-b border-[#4ca3dd] pb-2">
                {title}
              </h2>
              {content && (
                <p className="text-white leading-relaxed text-base">{content}</p>
              )}
              {list && (
                <ul className="list-disc list-inside text-white space-y-2 mt-2 pl-2">
                  {list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Refund;
