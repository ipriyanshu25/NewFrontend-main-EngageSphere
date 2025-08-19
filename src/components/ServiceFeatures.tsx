import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ServiceFeaturesProps {
  features: string[];
}

const ServiceFeatures: React.FC<ServiceFeaturesProps> = ({ features }) => {
  return (
    <div
      className="
        bg-gradient-to-r
        rounded-2xl shadow-lg border border-blue-400
        backdrop-blur-sm bg-opacity-60
        font-lexend
        p-6 md:p-8
      "
    >
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-6 w-6 text-black mr-4 flex-shrink-0 mt-1" />
            <span className="text-lg">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceFeatures;
