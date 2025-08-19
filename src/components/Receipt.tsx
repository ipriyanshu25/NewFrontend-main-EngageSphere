// import React from 'react';
// import { Download, Check, X, Shield, Award, Clock } from 'lucide-react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// interface ReceiptProps {
//   paymentDetails: {
//     id: string;
//     status: string;
//     payer: {
//       name: { given_name: string; surname: string };
//       email_address: string;
//     };
//     purchase_units: Array<{
//       amount: { value: string; currency_code: string };
//       description: string;
//     }>;
//     packageName: string;
//     packageFeatures: string[];
//     create_time: string;
//   };
//   onClose: () => void;
// }

// const Receipt: React.FC<ReceiptProps> = ({ paymentDetails, onClose }) => {
//   const downloadReceipt = async () => {
//     const receiptElement = document.getElementById('receipt-content');
//     if (!receiptElement) return;

//     try {
//       const canvas = await html2canvas(receiptElement, {
//         backgroundColor: '#ffffff',
//         scale: 2,
//         useCORS: true,
//         allowTaint: true
//       });

//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');

//       const imgWidth = 210;
//       const pageHeight = 295;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;

//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`EngageSphere_Receipt_${paymentDetails.id}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating receipt. Please try again.');
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       timeZoneName: 'short'
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white p-8 rounded-t-2xl relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-6">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
//                   <Check className="h-8 w-8 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-bold">Payment Successful!</h2>
//                   <p className="text-slate-300 text-lg">Your order has been processed</p>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                 <div className="flex items-center space-x-3">
//                   <Shield className="h-6 w-6 text-emerald-400" />
//                   <div>
//                     <p className="font-semibold">Secure Transaction</p>
//                     <p className="text-sm text-slate-300">256-bit SSL encrypted</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                 <div className="flex items-center space-x-3">
//                   <Award className="h-6 w-6 text-blue-400" />
//                   <div>
//                     <p className="font-semibold">Premium Service</p>
//                     <p className="text-sm text-slate-300">High-quality delivery</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                 <div className="flex items-center space-x-3">
//                   <Clock className="h-6 w-6 text-amber-400" />
//                   <div>
//                     <p className="font-semibold">Fast Delivery</p>
//                     <p className="text-sm text-slate-300">Starts within 24-48h</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-8" id="receipt-content">
//           <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
//             <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
//               EngageSphere
//             </h1>
//             <p className="text-slate-600 text-lg">Premium Social Media Growth Services</p>
//             <p className="text-sm text-slate-500 mt-2">Invoice & Payment Receipt</p>
//           </div>

//           {/* Transaction and Customer Info */}
//           <div className="grid md:grid-cols-2 gap-8 mb-8">
//             <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
//               <h3 className="font-bold text-xl text-slate-800 mb-4">Transaction Details</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between py-2 border-b border-slate-200">
//                   <span className="text-slate-600 font-medium">Transaction ID</span>
//                   <span className="font-mono text-sm bg-slate-200 px-2 py-1 rounded">{paymentDetails.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-slate-200">
//                   <span className="text-slate-600 font-medium">Status</span>
//                   <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
//                     {paymentDetails.status.toUpperCase()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-slate-200">
//                   <span className="text-slate-600 font-medium">Date & Time</span>
//                   <span className="text-slate-800 font-medium">{formatDate(paymentDetails.create_time)}</span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-slate-600 font-medium">Payment Method</span>
//                   <span className="text-slate-800 font-medium">PayPal</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//               <h3 className="font-bold text-xl text-slate-800 mb-4">Customer Information</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between py-2 border-b border-blue-200">
//                   <span className="text-slate-600 font-medium">Full Name</span>
//                   <span className="text-slate-800 font-medium">
//                     {paymentDetails.payer.name.given_name} {paymentDetails.payer.name.surname}
//                   </span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-blue-200">
//                   <span className="text-slate-600 font-medium">Email Address</span>
//                   <span className="text-slate-800 font-medium">{paymentDetails.payer.email_address}</span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-slate-600 font-medium">Customer ID</span>
//                   <span className="font-mono text-sm bg-blue-200 px-2 py-1 rounded">
//                     ES{paymentDetails.id.slice(-8).toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 mb-8 transition-all duration-300 hover:shadow-xl">
//             <h3 className="font-extrabold text-2xl text-neutral-900 mb-6 flex items-center">
//               <div className="w-2 h-6 bg-yellow-500 rounded-full mr-3"></div>
//               Order Summary
//             </h3>
//             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h4 className="text-2xl font-bold text-neutral-900">{paymentDetails.packageName}</h4>
//                   <p className="text-gray-600 text-base mt-1">Premium Growth Package</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-4xl font-extrabold text-neutral-900">
//                     ${paymentDetails.purchase_units[0].amount.value}
//                   </p>
//                   <p className="text-sm text-gray-500">{paymentDetails.purchase_units[0].amount.currency_code}</p>
//                 </div>
//               </div>
//               <div className="border-t border-gray-300 pt-5">
//                 <p className="font-bold text-neutral-800 text-lg mb-3">Package Features:</p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {paymentDetails.packageFeatures.map((feature, index) => (
//                     <div key={index} className="flex items-center text-base text-neutral-700">
//                       <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                       {feature}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="bg-neutral-900 text-white rounded-xl p-6">
//               <div className="flex justify-between items-center">
//                 <span className="text-xl font-semibold">Total Amount Paid:</span>
//                 <span className="text-3xl font-bold">
//                   ${paymentDetails.purchase_units[0].amount.value} {paymentDetails.purchase_units[0].amount.currency_code}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center border-t-2 border-slate-200 pt-6">
//             <div className="mb-4">
//               <p className="text-lg font-semibold text-slate-800 mb-2">Thank you for choosing EngageSphere!</p>
//               <p className="text-slate-600">Your order will begin processing within 24-48 hours.</p>
//             </div>
//             <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
//               <p className="font-semibold mb-2">Need Help?</p>
//               <p>📧 support@engagesphere.com | 📞 +1 (555) 123-4567</p>
//               <p className="mt-2">🌐 www.engagesphere.com</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-slate-200">
//           <button
//             onClick={downloadReceipt}
//             className="flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             <Download className="h-5 w-5 mr-3" />
//             Download Receipt (PDF)
//           </button>
//           <button
//             onClick={onClose}
//             className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Receipt;




import React from 'react';
import { Download, Check, X, Shield, Award, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptProps {
  paymentDetails: {
    id: string;
    status: string;
    payer: {
      name: { given_name: string; surname: string };
      email_address: string;
    };
    purchase_units: Array<{
      amount: { value: string; currency_code: string };
      description?: string;
    }>;
    packageName: string;
    packageFeatures: string[];
    create_time: string;
  };
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ paymentDetails, onClose }) => {
  const downloadReceipt = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) return;

    try {
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`EngageSphere_Receipt_${paymentDetails.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating receipt. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const {
    id,
    status,
    create_time,
    payer = { name: { given_name: '', surname: '' }, email_address: '' },
    purchase_units = [],
    packageName,
    packageFeatures,
  } = paymentDetails;

  const purchase = purchase_units[0] || {
    amount: { value: '0.00', currency_code: 'USD' },
    description: '',
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white p-8 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Payment Successful!</h2>
                  <p className="text-slate-300 text-lg">Your order has been processed</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Secure Transaction</p>
                    <p className="text-sm text-slate-300">256-bit SSL encrypted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Premium Service</p>
                    <p className="text-sm text-slate-300">High-quality delivery</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="font-semibold">Fast Delivery</p>
                    <p className="text-sm text-slate-300">Starts within 24-48h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8" id="receipt-content">
          <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              EngageSphere
            </h1>
            <p className="text-slate-600 text-lg">Premium Social Media Growth Services</p>
            <p className="text-sm text-slate-500 mt-2">Invoice & Payment Receipt</p>
          </div>

          {/* Transaction and Customer Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-xl text-slate-800 mb-4">Transaction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Transaction ID</span>
                  <span className="font-mono text-sm bg-slate-200 px-2 py-1 rounded">{id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Status</span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Date & Time</span>
                  <span className="text-slate-800 font-medium">{formatDate(create_time)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600 font-medium">Payment Method</span>
                  <span className="text-slate-800 font-medium">PayPal</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-xl text-slate-800 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="text-slate-600 font-medium">Full Name</span>
                  <span className="text-slate-800 font-medium">
                    {payer.name.given_name} {payer.name.surname}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="text-slate-600 font-medium">Email Address</span>
                  <span className="text-slate-800 font-medium">{payer.email_address}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600 font-medium">Customer ID</span>
                  <span className="font-mono text-sm bg-blue-200 px-2 py-1 rounded">
                    ES{id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 mb-8 transition-all duration-300 hover:shadow-xl">
            <h3 className="font-extrabold text-2xl text-neutral-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-yellow-500 rounded-full mr-3"></div>
              Order Summary
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-neutral-900">{packageName}</h4>
                  <p className="text-gray-600 text-base mt-1">Premium Growth Package</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-extrabold text-neutral-900">
                    ${purchase.amount.value}
                  </p>
                  <p className="text-sm text-gray-500">{purchase.amount.currency_code}</p>
                </div>
              </div>
              <div className="border-t border-gray-300 pt-5">
                <p className="font-bold text-neutral-800 text-lg mb-3">Package Features:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packageFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-base text-neutral-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 text-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total Amount Paid:</span>
                <span className="text-3xl font-bold">
                  ${purchase.amount.value} {purchase.amount.currency_code}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t-2 border-slate-200 pt-6">
            <div className="mb-4">
              <p className="text-lg font-semibold text-slate-800 mb-2">Thank you for choosing EngageSphere!</p>
              <p className="text-slate-600">Your order will begin processing within 24-48 hours.</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
              <p className="font-semibold mb-2">Need Help?</p>
              <p>📧 support@engagesphere.com | 📞 +1 (555) 123-4567</p>
              <p className="mt-2">🌐 www.engagesphere.com</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Download className="h-5 w-5 mr-3" />
            Download Receipt (PDF)
          </button>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
