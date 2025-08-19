import React, { useState } from 'react';
import { X, Shield, Lock, CreditCard } from 'lucide-react';
import { post } from '../api/axios';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    name: string;
    price: string;
    features: string[];
    platform: string;
  };
  userId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  packageData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;

  const amount = packageData.price.replace(/[^\d.]/g, '');

  const handleMakePayment = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      amount,
      packageName: packageData.name,
      packageFeatures: packageData.features,
      userId: localStorage.getItem('userId')
    };

    try {
      console.log('Starting payment with payload:', payload);
      const { approveLink } = await post<{ approveLink: string }>('/payment/create', payload);
      window.location.href = approveLink;
    } catch (err: any) {
      console.error('Error initiating payment:', err);
      setError(err.response?.data?.error || 'Could not start payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Secure Checkout</h2>
              <p className="text-gray-300 text-sm mt-1">Complete your order securely</p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-gray-700" /> Order Summary
            </h3>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-xl">{packageData.name}</h4>
                <p className="text-base text-gray-600">{packageData.platform} Growth Package</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-black">{packageData.price}</p>
                <p className="text-sm text-gray-500">USD</p>
              </div>
            </div>
            <ul className="space-y-2">
              {packageData.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-center text-base text-gray-700">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                  {feat}
                </li>
              ))}
              {packageData.features.length > 3 && (
                <li className="text-sm text-gray-500">
                  +{packageData.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>

          {/* Security Features */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-emerald-200 shadow-sm">
            <div className="flex justify-around text-base text-gray-800">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-700" /> SSL Secured
              </div>
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-700" /> 256-bit Encryption
              </div>
            </div>
          </div>

          {/* Make Payment Button */}
          <button
            onClick={handleMakePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white text-lg font-semibold py-3 rounded-xl flex items-center justify-center space-x-3 transition-all disabled:opacity-50"
          >
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            )}
            <span>Make Payment</span>
          </button>
          {error && <p className="mt-2 text-center text-red-600">{error}</p>}

          {/* Trust Indicators */}
          <div className="text-center text-sm text-gray-600">
            🔒 Secure Payment • 💳 PayPal Protected • 🛡️ Buyer Protection
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
