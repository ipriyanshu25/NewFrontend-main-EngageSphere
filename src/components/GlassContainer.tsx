import React, { ReactNode } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
}

const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassContainer;