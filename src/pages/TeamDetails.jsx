import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import PaymentModal from "./PaymentModal";

const TeamDetails = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  const fetchTeamDetails = async () => {
    try {
      const response = await api.get("/teams/my-team");
      setTeam(response.data.team);
    } catch (error) {
      console.error("Error fetching team details:", error);
      setError("Failed to load team details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    setSuccess(
      `Payment successful! Your team QR code has been generated. Payment ID: ${paymentData.paymentId}`
    );
    // Refresh team details to get QR code
    fetchTeamDetails();
  };

  const downloadQRCode = () => {
    if (!team.qrCode) {
      setError("QR code not available");
      return;
    }

    // Convert data URL to blob and download
    const link = document.createElement("a");
    link.download = `${team.registrationNumber}-QRCode.png`;
    link.href = team.qrCode;
    link.click();
  };

  const getPaymentAmount = () => {
    const amounts = {
      Solo: 500,
      Duo: 800,
      Team: 1200,
    };
    return amounts[team?.teamSize] || 500;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Team Found
          </h1>
          <p className="text-gray-600 mb-6">
            You haven't registered for any team yet.
          </p>
          <a href="/team-register" className="btn-primary inline-block">
            Register Team
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Team Details
          </h1>
          <p className="text-lg text-gray-600">
            Your team registration details and payment information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Payment Status Banner */}
        {team.paymentStatus === "verified" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-800">
                  Payment Verified! ✓
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your registration is complete. Your team is all set for the
                  hackathon!
                </p>
              </div>
            </div>
          </div>
        )}

        {team.paymentStatus === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Payment Required
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please complete the payment to confirm your registration and
                  generate your team QR code.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Team Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {team.teamName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <p className="mt-1 text-lg font-mono text-primary-600">
                  {team.registrationNumber}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Team Size
                </label>
                <p className="mt-1 text-gray-900">{team.teamSize}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Problem Statement
                </label>
                <p className="mt-1 text-gray-900">{team.problemStatement}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                    team.paymentStatus === "verified"
                      ? "bg-green-100 text-green-800"
                      : team.paymentStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {team.paymentStatus.charAt(0).toUpperCase() +
                    team.paymentStatus.slice(1)}
                </span>
              </div>

              {team.paymentStatus === "verified" && team.paymentVerifiedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Verified On
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(team.paymentVerifiedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Team Members
            </h2>

            <div className="space-y-4">
              {/* Team Leader */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-800 mb-2">
                  Team Leader
                </h3>
                <div className="space-y-1">
                  <p className="text-primary-700">
                    <strong>Name:</strong> {team.leader.name}
                  </p>
                  <p className="text-primary-700">
                    <strong>Email:</strong> {team.leader.email}
                  </p>
                  <p className="text-primary-700">
                    <strong>Reg No:</strong> {team.leader.registrationNumber}
                  </p>
                </div>
              </div>

              {/* Team Members */}
              {team.members && team.members.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Team Members
                  </h3>
                  <div className="space-y-3">
                    {team.members.map((member, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-gray-700">
                            <strong>Name:</strong> {member.name}
                          </p>
                          <p className="text-gray-700">
                            <strong>Email:</strong> {member.email}
                          </p>
                          <p className="text-gray-700">
                            <strong>Reg No:</strong> {member.registrationNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {team.paymentStatus === "pending" && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Complete Payment
            </h2>

            <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Registration Fee
                  </h3>
                  <p className="text-sm text-gray-600">
                    For {team.teamSize} Team
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">
                    ₹{getPaymentAmount()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <h4 className="font-semibold text-blue-900 mb-2">
                  What happens after payment?
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li>Your payment will be verified instantly</li>
                  <li>
                    Team QR code will be generated automatically for event entry
                  </li>
                  <li>You'll receive a confirmation email</li>
                  <li>Your team registration will be complete</li>
                </ul>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full btn-primary py-3 text-lg"
              >
                Proceed to Payment (₹{getPaymentAmount()})
              </button>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        {team.paymentStatus === "verified" && team.qrCode && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Team QR Code
            </h2>

            <div className="text-center">
              <div className="inline-block p-6 bg-white rounded-lg shadow-lg border-2 border-primary-200">
                <img
                  src={team.qrCode}
                  alt="Team QR Code"
                  className="mx-auto w-64 h-64 object-contain"
                />
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={downloadQRCode}
                  className="btn-primary px-6 py-3"
                >
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download QR Code
                </button>

                <p className="text-sm text-gray-600">
                  Save this QR code and present it at the event venue for entry
                </p>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Important:</strong> This QR code is unique to your
                  team. Keep it safe and bring it to the event!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          team={team}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default TeamDetails;