import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center
      bg-gradient-to-br from-slate-900 via-blue-900 to-black
      px-4 sm:px-6 lg:px-8 py-8 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-slate-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-xs sm:max-w-md lg:max-w-lg w-full p-8 sm:p-10 lg:p-12 rounded-3xl
        bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl
        shadow-black/50 text-white z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/25 mb-3 sm:mb-4">
            <span className="text-lg sm:text-2xl font-bold text-white">E</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white/90 tracking-wide">
            LikLet
          </h3>
        </div>

        {/* Main 404 Display */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-transparent bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text mb-3 sm:mb-4 tracking-tight">
              404
            </h1>
            <div className="absolute inset-0 text-6xl sm:text-7xl lg:text-8xl font-black text-blue-600/10 blur-sm">
              404
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            Page Not Found
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm mx-auto px-2">
            The page you're looking for seems to have vanished into the digital void. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <a
            href="/"
            className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl
              font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/25
              transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-600/30
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
              group"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
            Return Home
          </a>

          <a
            href="/contact"
            className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20
              border border-white/20 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl
              font-medium text-sm sm:text-base transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/50
              group"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
            Go Back to Help Center
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 text-center z-10 px-4">
        <p className="text-white/40 text-xs sm:text-sm">
          © 2025 LikLet. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;