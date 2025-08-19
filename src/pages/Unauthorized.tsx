import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 shadow-2xl text-center transition-all duration-300 hover:shadow-3xl hover:bg-white/15">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/20 rounded-full border border-red-500/40 animate-pulse">
            <Lock className="h-10 w-10 text-red-300" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>

        {/* Description */}
        <p className="text-slate-300 text-base mb-6">
          You do not have the necessary permissions to view this page.
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          aria-label="Back to Home"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
