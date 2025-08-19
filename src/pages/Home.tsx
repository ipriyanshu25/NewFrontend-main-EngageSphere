// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import HeroSection from '../components/HeroSection';
import SuccessStories from '../components/SuccessStories';
import GlassContainer from '../components/GlassContainer';
import slugify from 'slugify';
import {
  CheckCircle,
  Users,
  Shield,
  Zap,
  Clock,
  Home as HomeIcon,
  ArrowRight,
  ArrowDown,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react';

/**
 * Home page – updated service‑card styling to match reference UI.
 * A separate ServiceCard component is **not** used, per user request – the
 * markup is embedded directly inside the services grid below.
 */

const StepArrow: React.FC = () => (
  <div className="flex md:mx-4 my-4 md:my-0">
    <ArrowDown className="md:hidden h-6 w-6 text-blue-400" />
    <ArrowRight className="hidden md:block h-6 w-6 text-blue-400" />
  </div>
);

const Home: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/services/getAll', { params: { page, limit } });
        setServices(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [page, limit]);

  const steps = [
    { icon: <HomeIcon className="h-10 w-10 text-green-500" />, title: '1. Choose Your Service', desc: 'Select the platform & growth pack that matches your goals.' },
    { icon: <Shield className="h-10 w-10 text-blue-500" />, title: '2. Secure Payment', desc: 'Checkout with our safe gateway. No passwords required.' },
    { icon: <Zap className="h-10 w-10 text-yellow-500" />, title: '3. Watch Your Growth', desc: 'Relax while we deliver real‑time results to your account.' },
  ];

  return (
    <div className="font-sans text-gray-900">
      <HeroSection />

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-tr from-white via-blue-50 to-blue-100 px-4">
        <div className="container mx-auto max-w-6xl ">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">Our Services</h2>
            <p className="text-base md:text-lg text-gray-700">Comprehensive engagement solutions for your social media handle</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-700">Loading services...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service: any) => (
                <div
                  key={service.serviceId}
                  className="flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm transition hover:shadow-md"
                >
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    {service.logo ? (
                      <img
                        src={
                          service.logo.startsWith('/9j')
                            ? `data:image/jpeg;base64,${service.logo}`
                            : `data:image/png;base64,${service.logo}`
                        }
                        alt={`${service.serviceHeading} logo`}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <CheckCircle className="h-10 w-10 text-gray-700" />
                    )}
                  </div>

                  {/* Heading and description */}
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 text-center">
                    {service.serviceHeading}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-6 text-center">
                    {service.serviceDescription}
                  </p>

                  {/* Features */}
                  <ul className="w-full space-y-2 mb-6">
                    {service.serviceContent.map((item: any) => (
                      <li
                        key={item.contentId}
                        className="flex items-center justify-center text-gray-800 text-center"
                      >
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        <span>
                          {item.key}: <span className="font-medium">{item.value}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* CTA */}
                  <button
                    onClick={() => (window.location.href = `/services/${slugify(service.serviceHeading)}`)}
                    className="mt-auto w-full py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-blue-500 font-medium"
                  >
                    View More
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  window.location.href = '/services';
                }}
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-blue-500 transition"
              >
                View More Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="py-16 px-4 mb-16 sm:mb-20">
        <motion.div
          className="rounded-3xl border border-blue-200/60 bg-white/80 p-6 sm:p-10 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10 tracking-wide text-blue-900">
            Simple 3‑Step Process
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  className="text-center w-full md:w-auto px-6 py-4 transition-all hover:-translate-y-1 hover:scale-[1.03] duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-900">
                    {step.title}
                  </h3>
                  <p className="text-base sm:text-lg text-blue-700 max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </motion.div>
                {index < steps.length - 1 && <StepArrow />}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10 text-center tracking-wide text-blue-900">
          Why Choose EngageSphere?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {[
            {
              icon: <CheckCircle className="h-7 w-7 text-emerald-500" />,
              title: '100% Safe & Secure',
              desc: 'Our methods comply with all platform guidelines and terms of service. Your account safety is our top priority.',
            },
            {
              icon: <Users className="h-7 w-7 text-green-500" />,
              title: 'Real Engagement',
              desc: 'All engagement comes from real, active accounts. No bots or fake profiles.',
            },
            {
              icon: <Clock className="h-7 w-7 text-yellow-500" />,
              title: 'Fast Delivery',
              desc: 'See results within 24‑48 hours with our efficient delivery system.',
            },
            {
              icon: <Shield className="h-7 w-7 text-blue-500" />,
              title: 'Money‑Back Guarantee',
              desc: '30‑day satisfaction guarantee ensures your investment is protected.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <GlassContainer className="rounded-3xl border border-blue-200 bg-white/70 p-6 sm:p-8 group-hover:border-blue-300">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-blue-900">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-blue-700">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            </motion.div>
          ))}
        </div>
      </section>

      <SuccessStories />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 text-black">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-lexend mb-6 bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-white"
          >
            Ready to Boost Your Social Reach?
          </motion.h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied clients now!</p>

          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            viewport={{ once: true }}
          >
            <a
              href="/services"
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-m font-medium text-white shadow hover:from-blue-700 hover:to-blue-700"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div>
              <a
                href="/"
                className="flex items-center space-x-3 mb-4 hover:opacity-90"
              >
                <Globe className="w-8 h-8" />
                <span className="text-xl font-bold">EngageSphere</span>
              </a>
              <p className="text-gray-400 mb-6">
                Your premier destination for authentic social media engagement
                and growth services.
              </p>
              {/* Social Media Icons */}
              <div className="flex space-x-3">
                {[
                  { Icon: Instagram, color: '#C13584' },
                  { Icon: Twitter, color: '#1DA1F2' },
                  { Icon: Facebook, color: '#1877F2' },
                  { Icon: Linkedin, color: '#0077B5' },
                  { Icon: Youtube, color: '#FF0000' },
                ].map(({ Icon, color }, i) => (
                  <a
                    key={i}
                    href="#"
                    className="transition-colors"
                    style={{ color }}
                    aria-label="Social Media Link"
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                {[
                  'Youtube',
                  'Instagram',
                  'X',
                  'Threads',
                  'Telegram',
                  'LinkedIn',
                  'TikTok',
                  'Facebook',
                ].map((platform) => (
                  <li key={platform}>
                    <a
                      href={`/services/${platform.toLowerCase()}`}
                      className="hover:text-white transition-colors"
                    >
                      {platform} Services
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/refund" className="hover:text-white transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EngageSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
