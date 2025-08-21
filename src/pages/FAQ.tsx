import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FAQPage: React.FC = () => {
  const faqSections = [
    {
      title: "General Questions",
      questions: [
        {
          q: "What is LikLet?",
          a: "LikLet is a premium social media growth service that helps individuals and businesses increase their online presence through authentic engagement methods."
        },
        {
          q: "Is LikLet safe to use?",
          a: "Yes, we use only safe and compliant methods that adhere to each platform's terms of service. We never require passwords and protect your account security."
        },
        {
          q: "How long does it take to see results?",
          a: "Most services begin showing results within 24-48 hours, with full delivery depending on your package size and platform."
        }
      ]
    },
    {
      title: "Services & Pricing",
      questions: [
        {
          q: "What services do you offer?",
          a: "We offer growth services for major social platforms including YouTube, Instagram, X, Threads, Telegram, LinkedIn, Spotify, and Facebook."
        },
        {
          q: "How do you calculate pricing?",
          a: "Our pricing is based on service type, quantity, and delivery speed. We offer different packages to suit various needs and budgets."
        },
        {
          q: "Do you offer custom packages?",
          a: "Yes, we can create custom packages for specific needs. Contact our support team to discuss custom solutions."
        }
      ]
    },
    {
      title: "Payment & Refunds",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and various other payment methods. All payments are processed securely."
        },
        {
          q: "Do you offer refunds?",
          a: "Yes, we offer a 30-day money-back guarantee if we're unable to deliver services as promised. See our Refund Policy for details."
        },
        {
          q: "Are there any hidden fees?",
          a: "No, all our prices are transparent with no hidden fees. The price you see is the price you pay."
        }
      ]
    },
    {
      title: "Account & Security",
      questions: [
        {
          q: "Do you need my password?",
          a: "No, we never require your account passwords. We only need your username or profile URL to deliver our services."
        },
        {
          q: "How do you protect my information?",
          a: "We use industry-standard security measures to protect your data. See our Privacy Policy for detailed information."
        },
        {
          q: "Can I cancel my service?",
          a: "Yes, you can cancel any ongoing service at any time. Contact our support team for assistance."
        }
      ]
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-gradient-to-tr from-[#000e1f] via-[#001e3c] to-[#001730] min-h-screen text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Frequently Asked Questions
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            Get the answers you seek — quickly and clearly.
          </p>
        </motion.div>

        {/* FAQ Sections */}
        {faqSections.map((section, index) => (
          <section key={index} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 border-[#4ca3dd] pb-2">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.questions.map((item, qIndex) => (
                <motion.div
                  key={qIndex}
                  className="p-6 bg-black/20 border border-[#00264D]/60 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: qIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {item.q}
                  </h3>
                  <p className="leading-relaxed text-white/90">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <motion.div
          className="p-10 mt-16 text-center bg-black/20 border border-[#00264D]/60 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Still Have Questions?
          </h2>
          <p className="mb-8 leading-relaxed max-w-xl mx-auto text-white/80">
            Our support team is available 24/7 to help you with any questions or concerns. We’re here to assist you every step of the way.
          </p>
          <Link to="/contact">
            <button className="bg-gradient-to-r from-[#1a2a6c] to-[#4b6cb7] hover:from-[#0b1a3f] hover:to-[#1a2a6c] text-white px-10 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
              Contact Support
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
