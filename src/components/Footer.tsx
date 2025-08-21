import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link
              to="/"
              className="flex items-center space-x-3 mb-4 hover:opacity-90"
            >
              <Globe className="w-8 h-8" />
              <span className="text-xl font-bold">LikLet</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Your premier destination for authentic social media engagement and
              growth services.
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
                  <Link
                    to={`/services/${platform.toLowerCase()}`}
                    className="hover:text-white transition-colors"
                  >
                    {platform} Services
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LikLet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
