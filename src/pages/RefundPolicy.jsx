import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Refund Policy</h1>

      <p className="text-gray-600 mb-4">
        HackBits is a student-driven event with limited seats and pre-arranged
        resources. Our refund policy ensures fairness and clarity for all
        participants.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Registration Fee Policy
      </h2>
      <p className="text-gray-600 mb-4">
        Once a team completes registration and payment (if any), the amount is
        generally **non-refundable**. This is because resources and logistics are
        allocated per participant.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Refund Exceptions</h2>
      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>If the event is cancelled by organizers</li>
        <li>If payment is duplicated or made in error</li>
        <li>Technical issues resulting in failed registration</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Refund Request Procedure
      </h2>
      <ol className="list-decimal ml-6 text-gray-600 space-y-2">
        <li>Email your issue to our support team</li>
        <li>Include payment receipt and registered email</li>
        <li>Refunds may take 5–7 business days to process</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Contact</h2>
      <p className="text-gray-600">
        For refund-related questions contact:  
        <span className="text-primary-600 font-medium ml-1">
          hackbitsofficialteam@gmail.com
        </span>
      </p>
    </div>
  );
};

export default RefundPolicy;
