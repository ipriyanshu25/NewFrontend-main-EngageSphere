import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Globe, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Fixed, translucent navbar (glass‑morphism) with Lexend font
 * --------------------------------------------------
 * – Admin logic removed
 * – Links: Services | About Us | Contact | Learn More
 * – Auth controls: Profile icon with tooltip showing user name | Logout | Sign In button
 * – Mobile drawer mirrors desktop links
 */
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) navigate('/profile');
    else navigate('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 font-lexend">
      {/* Main bar */}
      <div className="w-full border-b border-white/20 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4 md:py-5">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-transform">
            <Globe className="h-10 w-10 text-blue-600 drop-shadow-xl" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
              LikLet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-black">
            <Link to="/services" className="text-xl font-semibold hover:text-blue-600">
              Services
            </Link>
            <Link to="/about" className="text-xl font-semibold hover:text-blue-600">
              About Us
            </Link>
            <Link to="/contact" className="text-xl font-semibold hover:text-blue-600">
              Contact Us
            </Link>

            {/* Auth / Profile */}
            <div className="flex items-center space-x-5 border-l pl-6 border-black/10">
              <button
                onClick={handleProfileClick}
                className="hover:text-blue-600"
                title={user?.name ?? 'Profile'}
              >
                <User className="w-6 h-6" />
              </button>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-lg font-medium hover:text-red-500"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white text-lg px-7 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu toggle */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black p-2 rounded-lg"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35 }}
            className="fixed top-0 left-0 w-full h-full bg-white/70 backdrop-blur-lg z-50 p-8 flex flex-col space-y-8 text-black font-lexend"
          >
            {/* Drawer header */}
            <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-transform">
              <Globe className="h-10 w-10 text-black drop-shadow-xl" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                LikLet
              </span>
            </Link>

            <Link to="/services" className="text-2xl font-semibold" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link to="/about" className="text-2xl font-semibold" onClick={() => setIsOpen(false)}>
              About Us
            </Link>
            <Link to="/contact" className="text-2xl font-semibold" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            <Link to="/learn-more" className="text-2xl font-semibold" onClick={() => setIsOpen(false)}>
              Learn More
            </Link>

            <div className="flex flex-col gap-6 mt-auto">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 text-2xl hover:text-blue-600"
                title={user?.name ?? 'Profile'}
              >
                <User className="w-6 h-6" /> Profile
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-2xl"
                >
                  <LogOut className="w-6 h-6" /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl bg-blue-600 px-6 py-3 rounded-full text-white text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
