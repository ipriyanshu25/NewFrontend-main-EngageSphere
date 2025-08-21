import React from 'react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-gradient-to-br from-[#000e1f] via-[#001e3c] to-[#001730] min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/80 mt-2 text-lg">
            Your data is sacred in our kingdom. Here's how we protect it.
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
              title: "1. Information We Collect",
              content:
                "We collect information that you provide directly to us, including:",
              list: [
                "Account information (name, email, social media handles)",
                "Payment information (processed securely by our payment providers)",
                "Communication preferences",
                "Service usage information",
              ],
            },
            {
              title: "2. How We Use Your Information",
              content: "We use the collected information to:",
              list: [
                "Provide and improve our services",
                "Process your payments",
                "Send you updates and marketing communications",
                "Respond to your inquiries",
                "Ensure compliance with our terms",
              ],
            },
            {
              title: "3. Information Sharing",
              content:
                "We do not sell your personal information. We may share your information with:",
              list: [
                "Service providers who assist in our operations",
                "Legal authorities when required by law",
                "Business partners with your consent",
              ],
            },
            {
              title: "4. Data Security",
              content:
                "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
            },
            {
              title: "5. Your Rights",
              content: "You have the right to:",
              list: [
                "Access your personal information",
                "Correct inaccurate information",
                "Request deletion of your information",
                "Opt-out of marketing communications",
              ],
            },
            {
              title: "6. Cookies",
              content:
                "We use cookies and similar technologies to enhance your experience on our website. You can control cookie preferences through your browser settings.",
            },
            {
              title: "7. Contact Us",
              content:
                "For privacy-related inquiries, please contact our Data Protection Officer at privacy@LikLet.com.",
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

export default Privacy;
