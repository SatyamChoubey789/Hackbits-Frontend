import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import RazorpayPaymentButton from "./PaymentModal";

const TeamDetails = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [idCard, setIdCard] = useState(null);

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

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const response = await api.post("/teams/save-transaction", {
        teamId: team._id,
        transactionId: paymentData.transactionId,
        amount: paymentData.amount
      });

      setShowPaymentModal(false);
      setSuccess(
        `Payment ID saved! Transaction ID: ${paymentData.transactionId}. Now upload payment screenshot and ID card for verification.`
      );
      fetchTeamDetails();
    } catch (error) {
      console.error("Save transaction error:", error);
      setError(error.response?.data?.message || "Failed to save payment ID");
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB");
        return;
      }
      if (type === "payment") {
        setPaymentScreenshot(file);
      } else {
        setIdCard(file);
      }
    }
  };

  const handleUploadDocuments = async () => {
    if (!paymentScreenshot || !idCard) {
      setError("Please select both payment screenshot and ID card");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("paymentScreenshot", paymentScreenshot);
      formData.append("idCard", idCard);
      formData.append("teamId", team._id);

      const response = await api.post("/teams/upload-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(response.data.message);
      setPaymentScreenshot(null);
      setIdCard(null);
      document.getElementById("paymentScreenshot").value = "";
      document.getElementById("idCard").value = "";
      
      fetchTeamDetails();
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const viewTicket = () => {
    if (!team.ticketHTML) {
      setError("Ticket not available");
      return;
    }

    // Open ticket in new window
    const ticketWindow = window.open("", "_blank");
    ticketWindow.document.write(team.ticketHTML);
    ticketWindow.document.close();
  };

  const downloadTicketPDF = () => {
    if (!team.ticketHTML) {
      setError("Ticket not available");
      return;
    }

    // Create blob and download
    const blob = new Blob([team.ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${team.ticketNumber}-Ticket.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPaymentAmount = () => {
    const amounts = {
      Solo: 500,
      Duo: 800,
      Team: 1200,
    };
    return amounts[team?.teamSize] || 500;
  };

  const getVerificationStatus = () => {
    if (team.paymentStatus === "verified" && team.ticketNumber) {
      return "complete";
    }
    if (team.transactionId && team.paymentScreenshot && team.idCard) {
      return "pending_admin";
    }
    if (team.transactionId) {
      return "pending_documents";
    }
    return "pending_payment";
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Team Found</h1>
          <p className="text-gray-600 mb-6">You haven't registered for any team yet.</p>
          <a href="/team-register" className="btn-primary inline-block">Register Team</a>
        </div>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Details</h1>
          <p className="text-lg text-gray-600">Your registration details and verification status</p>
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

        {/* Verification Status Banner */}
        {verificationStatus === "complete" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-800">🎉 Verification Complete!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your ticket has been generated! You're all set for the hackathon.
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === "pending_admin" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800">Pending Admin Verification</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your payment and documents are submitted. Ticket will be generated after admin approval.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{team.teamName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <p className="mt-1 text-lg font-mono text-primary-600">{team.registrationNumber}</p>
              </div>
              {team.ticketNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ticket Number</label>
                  <p className="mt-1 text-2xl font-bold font-mono text-purple-600">{team.ticketNumber}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Size</label>
                <p className="mt-1 text-gray-900">{team.teamSize}</p>
              </div>
              {team.transactionId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                  <p className="mt-1 text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded break-all">
                    {team.transactionId}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                    team.paymentStatus === "verified"
                      ? "bg-green-100 text-green-800"
                      : team.paymentStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {team.paymentStatus.charAt(0).toUpperCase() + team.paymentStatus.slice(1)}
                </span>
              </div>
              {team.paymentStatus === "rejected" && team.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded">{team.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Leader */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Participant Details</h2>
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="space-y-1">
                <p className="text-primary-700"><strong>Name:</strong> {team.leader.name}</p>
                <p className="text-primary-700"><strong>Email:</strong> {team.leader.email}</p>
                <p className="text-primary-700"><strong>Reg No:</strong> {team.leader.registrationNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {verificationStatus === "pending_payment" && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Payment</h2>
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Fee</h3>
                  <p className="text-sm text-gray-600">For {team.teamSize} Registration</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">₹{getPaymentAmount()}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full btn-primary py-3 text-lg"
            >
              Proceed to Payment (₹{getPaymentAmount()})
            </button>
          </div>
        )}

        {/* Document Upload Section */}
        {verificationStatus === "pending_documents" && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Verification Documents</h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
                <p className="text-sm text-green-800">
                  ✓ Payment completed with Payment ID: <strong>{team.transactionId}</strong>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot *</label>
                <input
                  type="file"
                  id="paymentScreenshot"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "payment")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {paymentScreenshot && <p className="mt-2 text-sm text-green-600">✓ {paymentScreenshot.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College ID Card *</label>
                <input
                  type="file"
                  id="idCard"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "idCard")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {idCard && <p className="mt-2 text-sm text-green-600">✓ {idCard.name}</p>}
              </div>
              <button
                onClick={handleUploadDocuments}
                disabled={uploading || !paymentScreenshot || !idCard}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Documents"}
              </button>
            </div>
          </div>
        )}

        {/* Ticket Section */}
        {team.paymentStatus === "verified" && team.ticketNumber && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">🎟️ Your Hackathon Ticket</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-2xl font-bold text-gray-900 mb-2">Ticket Generated!</p>
                <p className="text-lg font-mono font-bold text-purple-600">{team.ticketNumber}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={viewTicket}
                  className="btn-primary px-8 py-3"
                >
                  👁️ View Ticket
                </button>
                <button
                  onClick={downloadTicketPDF}
                  className="btn-secondary px-8 py-3"
                >
                  💾 Download Ticket
                </button>
              </div>
              <div className="mt-6 bg-white p-4 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-gray-700">
                  <strong>⚠️ Important:</strong> Save and bring this ticket (digital or printed) to the event venue for entry.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <RazorpayPaymentButton
          team={team}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default TeamDetails;