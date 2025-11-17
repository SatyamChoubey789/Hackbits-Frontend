import React, { useState, useEffect } from 'react';

const RazorpayPaymentButton = ({ team, onClose, onSuccess }) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [error, setError] = useState('');

  const PAYMENT_AMOUNT = team?.teamSize === 'Solo' ? 79 : team?.teamSize === 'Duo' ? 800 : 1200;
  const PAYMENT_BUTTON_ID = process.env.REACT_APP_RAZORPAY_BUTTON_ID || 'pl_RgmK6SNHKWdeUH';

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', PAYMENT_BUTTON_ID);
    script.async = true;

    const form = document.getElementById('razorpay-payment-form');
    if (form) {
      form.appendChild(script);
    }

    // Listen for payment success
    window.addEventListener('message', handlePaymentMessage);

    return () => {
      window.removeEventListener('message', handlePaymentMessage);
      if (form) {
        form.innerHTML = '';
      }
    };
  }, [PAYMENT_BUTTON_ID]);

  const handlePaymentMessage = (event) => {
    // Razorpay sends payment success event
    if (event.data && event.data.razorpay_payment_id) {
      setPaymentCompleted(true);
      setTransactionId(event.data.razorpay_payment_id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      setError('Please complete payment first and enter the payment ID');
      return;
    }

    setError('');

    try {
      onSuccess({
        transactionId: transactionId,
        amount: PAYMENT_AMOUNT
      });
    } catch (err) {
      setError('Failed to submit payment details');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-primary-600">₹{PAYMENT_AMOUNT}</p>
              <p className="text-sm text-gray-500 mt-2">For {team?.teamSize} Registration</p>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Click the "Pay Now" button below</li>
              <li>Complete payment using Razorpay (UPI, Card, NetBanking, Wallets)</li>
              <li>After successful payment, copy the Payment ID</li>
              <li>Enter the Payment ID in the field below</li>
              <li>Take a screenshot of payment confirmation</li>
              <li>Upload the screenshot along with your ID card in the next step</li>
            </ol>
          </div>

          {/* Razorpay Payment Button */}
          <div className="text-center mb-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Make Payment</h3>
            <form id="razorpay-payment-form">
              {/* Razorpay button will be injected here */}
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Secure payment powered by Razorpay
            </p>
          </div>

          {/* Transaction ID Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Enter Payment Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment ID / Transaction ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter Razorpay payment ID (e.g., pay_xxxxxxxxxxxxx)"
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll receive this after successful payment
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {paymentCompleted && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <p className="text-sm text-green-800">
                  ✓ Payment completed successfully! Payment ID: {transactionId}
                </p>
              </div>
            )}

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> After submitting payment details, you'll need to upload:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 ml-2">
                <li>Payment screenshot (from Razorpay confirmation)</li>
                <li>College ID card</li>
              </ul>
              <p className="text-sm text-yellow-800 mt-2">
                Admin will verify your payment and documents before generating your QR code.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!transactionId.trim()}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Payment ID
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Having trouble? Contact support at{' '}
              <a href="mailto:support@hackathon.com" className="text-primary-600 hover:underline">
                support@hackathon.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPaymentButton;