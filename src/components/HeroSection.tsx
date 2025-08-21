import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Award, Shield, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: <Award className="h-12 w-12 text-blue-500" />,
      title: 'Premium Quality',
      desc: 'Real engagement from real users',
    },
    {
      icon: <Zap className="h-12 w-12 text-blue-400" />,
      title: 'Fast Delivery',
      desc: 'Get noticed quickly',
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: 'Top Security',
      desc: 'Safe & encrypted',
    },
    {
      icon: <Users className="h-12 w-12 text-blue-700" />,
      title: '24/7 Support',
      desc: 'We’re always here',
    },
  ];

  return (
    <>
      {/* Main Hero Section */}
      <section className="py-32 md:py-40 lg:py-48 bg-gradient-to-r from-blue-300 text-blue-900 shadow-inner relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-300 rounded-full opacity-25 blur-[180px]" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-100 rounded-full opacity-25 blur-[180px]" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="mb-4 text-5xl font-extrabold md:text-6xl lg:text-7xl mb-8 drop-shadow-lg ">
          Elevate Your Social Media{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Presence
          </span>
        </h1>
          <p className="text-2xl md:text-3xl mb-12 leading-relaxed">
            <span className="font-semibold">LikLet</span>{' '}
            helps you build your online empire with authentic and organic engagement across major platforms.
          </p>
          <Link
            to="/services"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-blue-700 text-white px-10 py-4 rounded-full font-semibold text-xl transition-transform hover:shadow-2xl hover:-translate-y-2"
          >
            View Services
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="p-10 bg-white shadow-xl border border-gray-100 rounded-[2.5rem] transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-blue-50 p-6 rounded-full border border-gray-200 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-2xl text-blue-900">{item.title}</h3>
                  <p className="text-lg text-blue-700 max-w-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;