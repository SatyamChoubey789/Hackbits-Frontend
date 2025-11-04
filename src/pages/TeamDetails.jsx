import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import PaymentModal from "./PaymentModal";
import toast from "react-hot-toast";

const TeamDetails = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
      toast.error("Failed to load team details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setShowPaymentModal(false);
    toast.success(
      `Payment successful! ID: ${paymentData.paymentId}. Please upload documents for verification.`
    );
    fetchTeamDetails();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      if (type === "payment") {
        setPaymentScreenshot(file);
      } else {
        setIdCard(file);
      }
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleUploadDocuments = async () => {
    if (!paymentScreenshot || !idCard) {
      toast.error("Please upload both payment screenshot and college ID card");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("paymentScreenshot", paymentScreenshot);
      formData.append("idCard", idCard);
      formData.append("teamId", team._id);

      const response = await api.post("/teams/upload-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Documents uploaded successfully!");
      setPaymentScreenshot(null);
      setIdCard(null);
      document.getElementById("paymentScreenshot").value = "";
      document.getElementById("idCard").value = "";
      fetchTeamDetails();
    } catch (error) {
      console.error("Upload error:", error);
      const msg =
        error.response?.data?.message || "Failed to upload documents";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const downloadQRCode = () => {
    if (!team.qrCode) {
      toast.error("QR code not available yet");
      return;
    }

    const link = document.createElement("a");
    link.download = `${team.registrationNumber}-QRCode.png`;
    link.href = team.qrCode;
    link.click();

    toast.success("QR Code downloaded successfully!");
  };

  const getPaymentAmount = () => {
    const amounts = { Solo: 500, Duo: 800, Team: 1200 };
    return amounts[team?.teamSize] || 500;
  };

  const getVerificationStatus = () => {
    if (team.paymentStatus === "verified" && team.qrCode) return "complete";
    if (team.razorpayPaymentId && team.paymentScreenshot && team.idCard)
      return "pending_admin";
    if (team.razorpayPaymentId) return "pending_documents";
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

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Team Details
          </h1>
          <p className="text-lg text-gray-600">
            Your registration details and verification status
          </p>
        </div>

        {/* ✅ Status banners (kept same for clarity) */}
        {verificationStatus === "complete" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-1">
              Verification Complete! ✓
            </h3>
            <p className="text-sm text-green-700">
              Your registration is complete. You're ready for the hackathon!
            </p>
          </div>
        )}

        {verificationStatus === "pending_admin" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-1">
              Pending Admin Verification
            </h3>
            <p className="text-sm text-yellow-700">
              Your documents are submitted. Admin will verify and issue your QR
              code soon.
            </p>
          </div>
        )}

        {/* Team Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              {team.razorpayPaymentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction ID
                  </label>
                  <p className="mt-1 text-sm font-mono bg-gray-50 p-2 rounded text-gray-900">
                    {team.razorpayPaymentId}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verification Status
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
            </div>
          </div>

          {/* Participant Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Participant Details
            </h2>
            <div className="bg-primary-50 p-4 rounded-lg">
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
        </div>

        {/* Payment Section */}
        {verificationStatus === "pending_payment" && (
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
                    For {team.teamSize} Registration
                  </p>
                </div>
                <p className="text-3xl font-bold text-primary-600">
                  ₹{getPaymentAmount()}
                </p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Upload Verification Documents
            </h2>
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Upload both payment screenshot and
                  college ID for verification.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot *
                </label>
                <input
                  type="file"
                  id="paymentScreenshot"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "payment")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College ID Card *
                </label>
                <input
                  type="file"
                  id="idCard"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "idCard")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <button
                onClick={handleUploadDocuments}
                disabled={uploading || !paymentScreenshot || !idCard}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  "Upload Documents"
                )}
              </button>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        {team.paymentStatus === "verified" && team.qrCode && (
          <div className="card mt-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Team QR Code
            </h2>
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
                Download QR Code
              </button>
              <p className="text-sm text-gray-600">
                Keep this QR code safe for event entry.
              </p>
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
