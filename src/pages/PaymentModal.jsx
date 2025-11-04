import React, { useState } from 'react';
import api from '../api/axios';

const PaymentModal = ({ team, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  
  const PAYMENT_AMOUNTS = {
    Solo: 500,
    Duo: 800,
    Team: 1200,
  };

  const getPaymentAmount = () => {
    return PAYMENT_AMOUNTS[team.teamSize] || 500;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await api.post('/payments/create-order', {
        teamId: team._id,
      });

      const { orderId, amount, currency } = orderResponse.data;

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Hackathon Registration',
        description: `Payment for ${team.teamName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              teamId: team._id,
            });

            // Success callback
            onSuccess(verifyResponse.data);
          } catch (error) {
            console.error('Payment verification error:', error);
            setError(
              error.response?.data?.message || 'Payment verification failed'
            );
          }
        },
        prefill: {
          name: team.leader?.name || '',
          email: team.leader?.email || '',
        },
        notes: {
          teamName: team.teamName,
          registrationNumber: team.registrationNumber,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Team Name:</span>
                <span className="font-semibold">{team.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registration No:</span>
                <span className="font-semibold">{team.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team Size:</span>
                <span className="font-semibold">{team.teamSize}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Registration Fee:
              </span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{getPaymentAmount()}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After successful payment, your team QR code
              will be generated automatically. You'll need this QR code for event
              entry.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay ₹${getPaymentAmount()}`
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secured by Razorpay</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;