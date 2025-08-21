import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import ServiceFeatures from '../components/ServiceFeatures';
import PricingTier from '../components/PricingTier';
import {Globe, Twitter, Linkedin, Facebook, Instagram, Youtube, MessagesSquare, Send } from 'lucide-react';
import { SiYoutube, SiInstagram } from 'react-icons/si';
import { post } from '../api/axios';

// Static service data (description, features)
const serviceData: any = {
  youtube: {
    title: 'YouTube Growth Services',
    description:
      'Boost your YouTube channel with premium engagement: views, subscribers, likes, and comments to elevate reach and revenue.',
    icon: <SiYoutube className="h-16 w-16 text-red-600" />,
    features: [
      'High-retention views from real users',
      'Active subscribers who engage',
      'Genuine likes and comments',
      'Increased watch time and session duration',
      'Improved search ranking',
      'Enhanced channel credibility',
      'Natural growth trajectory',
      'Higher monetization potential',
    ],
  },
  instagram: {
    title: 'Instagram Growth Services',
    description:
      'Elevate your Instagram presence with authentic followers, likes, and comments for maximum engagement and brand visibility.',
    icon: <SiInstagram className="h-16 w-16 text-pink-500" />,
    features: [
      'Targeted, active followers',
      'Real likes from genuine accounts',
      'Authentic, value-driven comments',
      'Explore page visibility boost',
      'Strengthened profile credibility',
      'Higher engagement rates',
      'Organic growth pattern',
      'Better brand recognition',
    ],
  },
    x: {
    title: 'X Growth Services',
    description: 'Expand your X presence with premium services: followers, likes, retweets to boost engagement and visibility.',
    icon: <Twitter className="h-16 w-16" style={{ color: '#1DA1F2' }} />, 
    features: [
      'Real X followers delivered organically',
      'Genuine likes from active profiles',
      'Authentic retweets to widen reach',
      'Better visibility in trending feeds',
      'Enhanced profile credibility',
      'Higher engagement rates',
      'Steady, natural growth'
    ]
  },
  threads: {
    title: 'Threads Growth Services',
    description: 'Build your Threads voice with followers, likes, and replies to establish credibility on Meta’s new platform.',
    icon: <MessagesSquare className="h-16 w-16" />, 
    features: [
      'Real Threads followers',
      'Genuine likes on posts',
      'Authentic replies for engagement',
      'Enhanced content visibility',
      'Early adopter advantage',
      'Organic growth patterns'
    ]
  },
  telegram: {
    title: 'Telegram Growth Services',
    description: 'Grow your Telegram channel with real members, post views, and engagement to expand your community.',
    icon: <Send className="h-16 w-16" style={{ color: '#0088CC' }} />, 
    features: [
      'Real channel members',
      'Active group participants',
      'Genuine post views',
      'Improved channel trust',
      'Steady, natural growth'
    ]
  },
  linkedin: {
    title: 'LinkedIn Growth Services',
    description: 'Expand your professional network with genuine connections, endorsements, and post engagement.',
    icon: <Linkedin className="h-16 w-16" style={{ color: '#0A66C2' }} />, 
    features: [
      'Real professional connections',
      'Genuine skill endorsements',
      'Authentic post engagement',
      'Enhanced profile visibility'
    ]
  },
  tiktok: {
    title: 'TikTok Growth Services',
    description: 'Boost your TikTok presence with real followers, views, and engagement for viral potential.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-16 w-16" fill="#000"><path d="M12.5 2.75c0-.69.56-1.25..."/></svg>),
    features: [
      'Real active followers',
      'Genuine video views and likes',
      'Targeted audience engagement',
      'Organic growth patterns'
    ],
  
  },
  facebook: {
    title: 'Facebook Growth Services',
    description: 'Elevate your Facebook page with real likes, followers, and post engagement to build authority.',
    icon: <Facebook className="h-16 w-16" style={{ color: '#1877F2' }} />, 
    features: [
      'Real page likes',
      'Genuine followers',
      'Authentic post engagement',
      'Enhanced brand credibility'
    ]
  }
};

const getDefaultData = (platform: string) => ({
  title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Growth Services`,
  description: `Boost your ${platform} presence with our reliable growth solutions.`,
  icon: <SiYoutube className="h-16 w-16 text-blue-500" />,
  features: [],
});

type PricingItem = {
  pricingId: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
};

interface PlanResponse {
  _id: string;
  name: string;
  pricing: PricingItem[];
  status: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
}
const ServiceDetail: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const key = platform?.toLowerCase() || '';
  const staticInfo = serviceData[key] || getDefaultData(key);

  const [planId, setPlanId] = useState<string>('');
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchPricing = async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await post<PlanResponse>('/plan/getByName', { name: key });
      // now resp.planId exists
      setPlanId(resp.planId);
      setPricing(resp.pricing);
    } catch (err: any) {
      console.error('Error fetching pricing:', err);
      setError(err.response?.data?.message || 'Unable to load pricing.');
    } finally {
      setLoading(false);
    }
  };

  fetchPricing();
}, [key]);

  if (loading) return <div className="py-12 text-center text-gray-600">Loading...</div>;
  if (error)   return <div className="py-12 text-center text-red-600">{error}</div>;

  return (
    <div className="font-lexend bg-blue-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-16 mt-12">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center mb-12">
          <div className="bg-blue-100 p-6 rounded-full">
            {staticInfo.icon}
          </div>
          <div className="mt-6 md:mt-0 md:ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {staticInfo.title}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              {staticInfo.description}
            </p>
          </div>
        </div>

        {/* Features Section */}
        {staticInfo.features.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Premium Features
            </h2>
            <div>
              <ServiceFeatures features={staticInfo.features} />
            </div>
          </section>
        )}

        {/* Pricing Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Our Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((tier) => (
                <PricingTier
                  key={tier.pricingId}
                  planId={planId}
                  pricingId={tier.pricingId}
                  name={tier.name}
                  price={tier.price}
                  description={tier.description}
                  features={tier.features}
                  isPopular={tier.isPopular}
                />
              ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16">
          <GlassContainer className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-xl shadow-lg p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to grow your {key} presence?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Join thousands of happy clients who achieved real growth with our professional services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-100 transition"
              >
                Get Started Now
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border border-white text-white font-medium rounded-full hover:bg-white hover:text-blue-500 transition"
              >
                Contact Support
              </Link>
            </div>
          </GlassContainer>
        </section>
      </div>
      {/* Footer fixed to bottom */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 hover:opacity-90">
              <Globe className="w-8 h-8" />
              <span className="text-xl font-semibold">LikLet</span>
            </Link>
            <p className="text-blue-100 mb-6">
              Your go-to partner for genuine social media growth and engagement.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Instagram, color: '#C13584' },
                { Icon: Twitter, color: '#1DA1F2' },
                { Icon: Facebook, color: '#1877F2' },
                { Icon: Linkedin, color: '#0077B5' },
                { Icon: Youtube, color: '#FF0000' },
              ].map(({color }, i) => (
                <a key={i} href="#" className="text-xl hover:opacity-80" style={{ color }} />
              ))}
            </div>
          </div>
          {/* Links Sections */}
          {['Services', 'Company', 'Legal'].map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-4">{section}</h4>
              <ul className="space-y-2 text-blue-100">
                {(
                  section === 'Services'
                    ? ['youtube','instagram','x','threads','telegram','linkedin','tiktok','facebook']
                    : section === 'Company'
                    ? ['About Us','Contact Us','FAQ']
                    : ['Terms of Service','Privacy Policy','Refund Policy']
                ).map((item) => (
                  <li key={item}>
                    <Link
                      to={
                        section === 'Services'
                          ? `/services/${item}`.toLowerCase()
                          : `/${item.replace(/\s+/g, '-').toLowerCase()}`
                      }
                      className="hover:text-white transition"
                    >
                      {section === 'Services' ? `${item.charAt(0).toUpperCase() + item.slice(1)} Services` : item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-black-200">
          &copy; {new Date().getFullYear()} LikLet. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ServiceDetail;