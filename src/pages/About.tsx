import React from 'react';
import GlassContainer from '../components/GlassContainer';
import { Users, Award, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Updated About page
 * - Footer now sticks to bottom without extra space
 * - Implemented flex layout on page wrapper
 * - Removed extra bottom padding that caused gap
 * - Maintains existing styling and sections
 */

const About: React.FC = () => {
  const values = [
    {
      icon: <Users className="h-8 w-8 text-[#2563EB]" />,
      title: 'Authenticity',
      desc: 'We believe in real engagement from real users, never compromising on quality.',
    },
    {
      icon: <Award className="h-8 w-8 text-[#FBBF24]" />,
      title: 'Excellence',
      desc: 'We strive for excellence in every interaction and service we provide.',
    },
    {
      icon: <Globe className="h-8 w-8 text-[#10B981]" />,
      title: 'Innovation',
      desc: 'We continuously evolve our services to stay ahead of platform changes.',
    },
    {
      icon: <Zap className="h-8 w-8 text-[#EC4899]" />,
      title: 'Integrity',
      desc: 'We maintain the highest standards of honesty and transparency.',
    },
  ];

  const sectionClasses =
    'p-8 md:p-12 bg-gradient-to-r blue-100  rounded-lg border border-blue-200/60 shadow-md';

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 text-gray-900 font-lexend">
      {/* Main Content Wrapper */}
      <div className="container mx-auto px-4 flex-grow pt-28">
        {/* Hero Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 mt-5 tracking-wide">About LikLet</h1>
          <p className="text-lg font-semibold">
            Empowering creators and businesses to reach their full potential through authentic social media growth.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <GlassContainer className={sectionClasses}>
            <h2 className="text-2xl font-extrabold mb-6 tracking-wide">Our Story</h2>
            <p className="mb-6 leading-relaxed">
              Founded in 2023, LikLet emerged from a simple observation: genuine social media growth shouldn't be complicated or risky.
              Our founders, having experienced the challenges of building online presence firsthand, set out to create a service that would provide
              authentic engagement while maintaining the highest standards of safety and quality.
            </p>
            <p className="leading-relaxed">
              Today, we're proud to serve thousands of clients worldwide, from emerging content creators to established brands, helping them
              achieve their social media goals through legitimate and effective growth strategies.
            </p>
          </GlassContainer>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <GlassContainer className={sectionClasses}>
              <h2 className="text-2xl font-extrabold mb-6 tracking-wide">Our Mission</h2>
              <p className="leading-relaxed">
                To democratize social media success by providing accessible, authentic, and effective growth solutions that empower creators and
                businesses to reach their full potential in the digital space.
              </p>
            </GlassContainer>

            <GlassContainer className={sectionClasses}>
              <h2 className="text-2xl font-extrabold mb-6 tracking-wide">Our Vision</h2>
              <p className="leading-relaxed">
                To become the world's most trusted partner in social media growth, setting the industry standard for authenticity, transparency,
                and results.
              </p>
            </GlassContainer>
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-extrabold mb-8 tracking-wide">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <GlassContainer className={sectionClasses + ' text-center'}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-black/10">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p>{desc}</p>
                </GlassContainer>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <GlassContainer className={sectionClasses + ' text-center'}>
            <h2 className="text-2xl font-extrabold mb-8 tracking-wide">Our Global Team</h2>
            <p className="mb-6 max-w-2xl mx-auto leading-relaxed">
              With team members across multiple continents, we bring diverse perspectives and expertise to deliver exceptional service 24/7.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-4xl font-extrabold mb-2">50+</p>
                <p className="text-[#2563EB]">Team Members</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold mb-2">20+</p>
                <p className="text-[#2563EB]">Countries</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold mb-2">24/7</p>
                <p className="text-[#2563EB]">Support</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold mb-2">100K+</p>
                <p className="text-[#2563EB]">Happy Clients</p>
              </div>
            </div>
          </GlassContainer>
        </motion.section>
      </div>

      {/* Global Footer */}
      <footer className="bg-gray-900 pb-8 text-center text-white mt-10">
        <div className="border-t border-gray-800 pt-8 text-gray-400 ">
          &copy; {new Date().getFullYear()} LikLet. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default About;
