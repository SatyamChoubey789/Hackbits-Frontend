import React, { useState } from 'react';

const PaymentQR = ({ team, onClose, onSuccess }) => {
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Payment QR code - Replace with your actual payment QR
  const PAYMENT_QR_URL = process.env.REACT_APP_PAYMENT_QR_URL || '/payment-qr.png';
  const UPI_ID = process.env.REACT_APP_UPI_ID || 'hackathon@upi';
  const PAYMENT_AMOUNT = team?.teamSize === 'Solo' ? 500 : team?.teamSize === 'Duo' ? 800 : 1200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Just save the transaction ID, actual verification done by admin
      onSuccess({
        transactionId: transactionId,
        amount: PAYMENT_AMOUNT
      });
    } catch (err) {
      setError('Failed to submit transaction ID');
    } finally {
      setLoading(false);
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
              <li>Scan the QR code below using any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Or use UPI ID: <strong>{UPI_ID}</strong></li>
              <li>Pay exactly ₹{PAYMENT_AMOUNT}</li>
              <li>After successful payment, enter the Transaction ID below</li>
              <li>Take a screenshot of the payment confirmation</li>
              <li>You'll need to upload the screenshot in the next step</li>
            </ol>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-lg shadow-lg border-2 border-primary-200">
              <img
                src={PAYMENT_QR_URL}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }} className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-2">QR Code Not Available</p>
                  <p className="text-sm text-gray-500">Please use UPI ID: <strong>{UPI_ID}</strong></p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Scan with any UPI app</p>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">UPI ID: <strong className="text-gray-900">{UPI_ID}</strong></p>
            </div>
          </div>

          {/* Transaction ID Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID / UTR Number *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter 12-digit transaction ID"
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Find this in your payment app after successful payment
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> After submitting, you'll need to upload:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 ml-2">
                <li>Payment screenshot</li>
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
                disabled={loading || !transactionId.trim()}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Transaction ID'}
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

export default PaymentQR;