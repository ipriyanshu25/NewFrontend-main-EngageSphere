// src/layouts/RootLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  // hide on admin **or** login routes
  const hideLayout = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/services';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* only show on non-admin and non-login routes */}
      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* only show on non-admin and non-login routes */}
    </div>
  );
};

export default RootLayout;
