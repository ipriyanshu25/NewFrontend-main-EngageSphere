import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassContainer from './GlassContainer';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  platform: string;
  icon: React.ReactNode;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ platform, icon, description }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleViewServices = () => {
    const platformPath = `/services/${platform.toLowerCase()}`;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: platformPath } } });
    } else {
      navigate(platformPath);
    }
  };

  return (
    <GlassContainer className="group h-full p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-blue-600">{icon}</div>
        <h3 className="text-xl font-bold mb-2 capitalize">{platform}</h3>
        <p className="text-slate-600 mb-6 flex-grow">{description}</p>
        <button
          onClick={handleViewServices}
          className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors"
        >
          View {platform} Services
          <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </GlassContainer>
  );
};

export default ServiceCard;