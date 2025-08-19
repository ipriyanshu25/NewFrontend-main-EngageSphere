import React, { useState } from 'react';
import axios from '../api/axios';
import { Check } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface PricingTierProps {
  planId: string;
  pricingId: string;
  name: string;
  price: string;
  durationLabel?: string;
  footerText?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  currency?: string;
}

const RAZORPAY_KEY = 'rzp_test_2oIQzZ7i0uQ6sn';

const isValidUrl = (value: string) => {
  try {
    const u = new URL(value);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
};

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PricingTier: React.FC<PricingTierProps> = ({
  planId,
  pricingId,
  name,
  price,
  durationLabel,
  footerText,
  description,
  features,
  isPopular = false,
  currency = 'USD',
}) => {
  const [loading, setLoading] = useState(false);

  const handleChoosePlan = async () => {
    if (loading) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      await Swal.fire({ icon: 'error', title: 'Login required', text: 'Please log in to continue.' });
      return;
    }

    // Ask for profile link and CREATE ORDER inside preConfirm
    const result = await Swal.fire({
      title: 'Add your profile link',
      input: 'url',
      inputLabel: 'Profile URL',
      inputPlaceholder: 'https://example.com/your-profile',
      confirmButtonText: 'Proceed to payment',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      inputValidator: (val) => {
        if (!val?.trim()) return 'Profile link is required';
        if (!isValidUrl(val.trim())) return 'Please enter a valid URL';
        return undefined;
      },
      preConfirm: async (val) => {
        try {
          const profileLink = String(val).trim();
          // IMPORTANT: ensure your route is exactly '/payment/order'
          const { data } = await axios.post('/payment/order', {
            userId, planId, pricingId, currency, profileLink
          });
          if (!data?.order?.id) throw new Error('Order creation failed');
          return { order: data.order, profileLink };
        } catch (e: any) {
          Swal.showValidationMessage(
            e?.response?.data?.message || e?.message || 'Failed to create order'
          );
          return undefined as any;
        }
      },
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const { order, profileLink } = result.value as { order: any; profileLink: string };

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        await Swal.fire({ icon: 'error', title: 'Payment SDK error', text: 'Failed to load Razorpay.' });
        return;
      }

      const rz = new (window as any).Razorpay({
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name,
        description,
        order_id: order.id,
        notes: { planId, pricingId, userId, profileLink },
        theme: { color: '#7C3AED' },

        // The success callback: VERIFY here
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(true);
          try {
            // OPEN the loading swal — DO NOT await this
            Swal.fire({
              title: 'Verifying payment…',
              allowEscapeKey: false,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            // Now call your backend (this will actually run)
            await axios.post(
              '/payment/verify',
              {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
              { timeout: 25000 } // optional timeout
            );

            // Close spinner and show success
            Swal.close();
            await Swal.fire({
              icon: 'success',
              title: 'Verified successfully',
              text: 'Your payment is verified and the subscription is active.',
              confirmButtonText: 'OK',
            });
          } catch (verifyErr: any) {
            // Always close spinner if open
            Swal.close();
            console.error('Verification error:', verifyErr);
            await Swal.fire({
              icon: 'error',
              title: 'Verification failed',
              text:
                verifyErr?.response?.data?.message ||
                verifyErr?.message ||
                'We could not verify the payment. Please contact support.',
            });
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            // User closed Razorpay without paying — nothing to verify
          },
        },
      });

      rz.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Payment error',
        text: err?.response?.data?.message || err.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative bg-white border ${isPopular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        } rounded-2xl overflow-hidden flex flex-col`}
    >
      {isPopular && (
        <div className="absolute inset-x-0 top-0 bg-blue-700 text-white text-center text-xs font-bold uppercase py-2 rounded-t-2xl">
          Most Popular
        </div>
      )}
      <div className="p-6 mt-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-center mb-2">{name}</h3>
        <p className="text-center text-4xl font-extrabold text-gray-900">
          {price}
          <span className="text-lg font-medium text-gray-500">/{durationLabel || 'mo'}</span>
        </p>
        {durationLabel && (
          <p className="text-center text-sm font-medium text-blue-600 mt-1">{durationLabel}</p>
        )}
        <p className="text-gray-600 text-center mt-3">{description}</p>

        <button
          onClick={handleChoosePlan}
          disabled={loading}
          className={`mt-6 w-full py-3 font-semibold rounded-lg transition ${isPopular
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
            }`}
        >
          {loading ? 'Processing…' : 'Choose plan'}
        </button>

        {footerText && <p className="text-xs text-gray-500 mt-4 text-center">{footerText}</p>}
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <ul className="space-y-2">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <span className="ml-2 text-gray-700 text-sm">{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingTier;
