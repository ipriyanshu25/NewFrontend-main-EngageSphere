import React, { useState } from 'react';
import { post } from '../api/axios';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
  user_name: string;
  user_email: string;
  serviceType: string;
  platform: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_name: '',
    user_email: '',
    serviceType: '',
    platform: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { message } = await post<{ message: string }, FormData>(
        '/contact/contact',
        formData
      );
      alert(message);
      setFormData({
        user_name: '',
        user_email: '',
        serviceType: '',
        platform: '',
        message: '',
      });
    } catch (err: any) {
      alert(
        err?.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const platforms = [
    'YouTube',
    'Instagram',
    'LinkedIn',
    'Twitter',
    'TikTok',
    'Spotify',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-white via-blue-50 to-blue-100 text-gray-900 font-lexend">
      {/* Main Content */}
      <main className="flex-grow py-20 px-6 md:px-12 lg:px-20">
        {/* ───────────── Page Header ───────────── */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-3 text-blue-900 mt-5">
            Contact Our Team
          </h1>
          <p className="text-lg text-blue-700">
            We’d love to hear from you. Share your queries or feedback.
          </p>
        </motion.div>

        {/* ───────────── Section 1: Contact Us ───────────── */}
        <section id="contact-us" className="mb-24">
          <motion.div
            className="bg-white/70 backdrop-blur border border-blue-200/60 rounded-3xl max-w-3xl mx-auto p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-blue-900 text-center">
              Contact&nbsp;Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
                placeholder="Email Address"
              />
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Select Service
                </option>
                <option value="growth">Growth Service</option>
                <option value="management">Account Management</option>
                <option value="consultation">Strategy Consultation</option>
              </select>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Select Platform
                </option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-blue-200 rounded-lg px-4 py-3 resize-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
                rows={4}
                placeholder="Tell us how we can help you..."
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </form>
          </motion.div>
        </section>

        {/* ───────────── Section 2: Get in Touch ───────────── */}
        <section id="get-in-touch">
          <motion.div
            className="bg-white/70 backdrop-blur border border-blue-200/60 rounded-3xl max-w-3xl mx-auto p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-8 text-blue-900 text-center">
              Get&nbsp;in&nbsp;Touch
            </h2>

            {[
              {
                icon: <Mail className="w-5 h-5 text-blue-600" />,
                title: 'Email',
                info: 'support@engagesphere.com',
              },
              {
                icon: <Phone className="w-5 h-5 text-blue-600" />,
                title: 'Phone',
                info: '+1 (800) 123-4567',
              },
              {
                icon: <MapPin className="w-5 h-5 text-blue-600" />,
                title: 'Office',
                info: '123 Digital Ave, California, USA',
              },
              {
                icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
                title: 'Live Chat',
                info: 'Mon – Fri, 9 am – 6 pm PST',
              },
            ].map(({ icon, title, info }, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-4 mb-6 last:mb-0"
              >
                <div className="bg-blue-100 p-3 rounded-lg">{icon}</div>
                <div>
                  <h4 className="font-semibold text-blue-900">{title}</h4>
                  <p className="text-blue-700">{info}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="bg-gray-900 pb-8 text-center text-white">
        <div className="border-t border-gray-800 pt-8 text-gray-400">
          &copy; {new Date().getFullYear()} EngageSphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Contact;
