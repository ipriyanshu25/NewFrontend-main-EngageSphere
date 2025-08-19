// import React from 'react';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

// interface PayPalButtonProps {
//   amount: string;
//   packageName: string;
//   packageFeatures: string[];
//   onSuccess: (details: any) => void;
//   onError: (error: any) => void;
// }

// const PayPalButton: React.FC<PayPalButtonProps> = ({
//   amount,
//   packageName,
//   packageFeatures,
//   onSuccess,
//   onError
// }) => {
//   const [{ isPending }] = usePayPalScriptReducer();

//   if (isPending) {
//     return (
//       <div className="flex justify-center items-center py-8">
//         <div className="relative">
//           <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-6 h-6 bg-slate-600 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <PayPalButtons
//         style={{
//           layout: 'vertical',
//           color: 'blue',
//           shape: 'rect',
//           label: 'paypal',
//           height: 50,
//           tagline: false
//         }}
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             purchase_units: [
//               {
//                 amount: {
//                   value: amount,
//                   currency_code: 'USD'
//                 },
//                 description: `${packageName} - EngageSphere Premium Growth Package`,
//                 custom_id: `engagesphere_${packageName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
//                 soft_descriptor: 'ENGAGESPHERE'
//               }
//             ],
//             application_context: {
//               shipping_preference: 'NO_SHIPPING',
//               user_action: 'PAY_NOW',
//               brand_name: 'EngageSphere',
//               landing_page: 'BILLING'
//             }
//           });
//         }}
//         onApprove={async (data, actions) => {
//           try {
//             const details = await actions.order?.capture();
//             if (details) {
//               onSuccess({
//                 ...details,
//                 packageName,
//                 packageFeatures,
//                 amount
//               });
//             }
//           } catch (error) {
//             onError(error);
//           }
//         }}
//         onError={onError}
//         onCancel={() => {
//           console.log('Payment cancelled by user');
//         }}
//       />
      
//       <div className="text-center">
//         <p className="text-xs text-slate-500">
//           Secure payment powered by PayPal • Buyer Protection included
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PayPalButton;



import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  amount: string;
  packageName: string;
  packageFeatures: string[];
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  packageName,
  packageFeatures,
  onSuccess,
  onError
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-slate-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
          tagline: false,
        }}
        createOrder={async () => {
          try {
            const response = await fetch('http://localhost:5000/payments/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, packageName }),
            });

            const data = await response.json();
            return data.orderID;
          } catch (error) {
            console.error('Error creating order:', error);
            onError(error);
            return '';
          }
        }}
        onApprove={async (data) => {
          try {
            const response = await fetch('http://localhost:5000/payments/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderID: data.orderID,
                amount,
                packageName,
                packageFeatures,
              }),
            });

            const result = await response.json();
            if (response.ok) {
              onSuccess(result.payment);
            } else {
              onError(result.error || 'Payment capture failed.');
            }
          } catch (error) {
            console.error('Error capturing payment:', error);
            onError(error);
          }
        }}
        onError={onError}
        onCancel={() => {
          console.log('Payment cancelled by user');
        }}
      />

      <div className="text-center">
        <p className="text-xs text-slate-500">
          Secure payment powered by PayPal • Buyer Protection included
        </p>
      </div>
    </div>
  );
};

export default PayPalButton;
