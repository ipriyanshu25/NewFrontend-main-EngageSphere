import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-gradient-to-tr from-[#000e1f] via-[#001e3c] to-[#001730] text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-white/80 mt-2 text-lg">
            Know the rules of the realm before joining EngageSphere.
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
              title: "1. Acceptance of Terms",
              content:
                "By accessing and using EngageSphere's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
            },
            {
              title: "2. Service Description",
              content:
                "EngageSphere provides social media growth services across various platforms. Our services are designed to help increase your social media presence through authentic engagement methods.",
            },
            {
              title: "3. User Obligations",
              list: [
                "You must be at least 18 years old to use our services.",
                "You must provide accurate and complete information when using our services.",
                "You are responsible for maintaining the security of your account.",
                "You agree not to use our services for any illegal or unauthorized purpose.",
              ],
            },
            {
              title: "4. Payment Terms",
              content:
                "All payments are processed securely through our payment providers. Prices are subject to change with notice. Refunds are handled according to our Refund Policy.",
            },
            {
              title: "5. Service Delivery",
              content:
                "We strive to deliver our services within the specified timeframes. However, delivery times may vary based on order size and platform conditions.",
            },
            {
              title: "6. Limitation of Liability",
              content:
                "EngageSphere is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.",
            },
            {
              title: "7. Changes to Terms",
              content:
                "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.",
            },
            {
              title: "8. Contact Information",
              content:
                "For questions about these Terms of Service, please contact us at legal@engagesphere.com.",
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

export default Terms;
