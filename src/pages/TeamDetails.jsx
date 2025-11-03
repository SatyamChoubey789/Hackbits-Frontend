import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";

const TeamDetails = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [compressionInfo, setCompressionInfo] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setPaymentScreenshot(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!paymentScreenshot) {
      setError("Please select a payment screenshot");
      return;
    }

    setUploading(true);
    setError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("paymentScreenshot", paymentScreenshot);
      formData.append("teamId", team._id);

      const response = await api.post("/teams/upload-payment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(
        "Payment screenshot uploaded and compressed successfully!"
      );
      setCompressionInfo(response.data.compressionInfo);
      setPaymentScreenshot(null);

      // Reset file input
      const fileInput = document.getElementById("paymentScreenshot");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error.response?.data?.message || "Failed to upload payment screenshot"
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadQRCode = () => {
    // You can replace this with your actual QR code image path
    const qrCodePath = "/images/team-qr-code.png"; // Place your QR code image in public/images/
    const link = document.createElement("a");
    link.download = `team-${team.registrationNumber}-qr.png`;
    link.href = qrCodePath;
    link.click();
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
                  Team Number
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
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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

        {/* QR Code Section - Only show if payment not verified */}
        {team.paymentStatus !== "verified" && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Team QR Code
            </h2>

            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                <img
                  src="/images/team-qr-code.png"
                  alt="Team QR Code"
                  className="mx-auto w-48 h-48 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div style={{ display: "none" }} className="text-gray-500">
                  QR Code image not found. Please place your QR code image at
                  /public/images/team-qr-code.png
                </div>
              </div>

              <div className="mt-4">
                <button onClick={downloadQRCode} className="btn-secondary">
                  Download QR Code
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                This QR code contains your team registration information
              </p>
            </div>
          </div>
        )}

        {/* Payment Upload Section */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Payment Confirmation
          </h2>

          {/* Payment Status Banner */}
          {team.paymentStatus === "verified" && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Payment Verified!</span>
              </div>
              <p className="text-sm mt-1">
                Your payment has been verified by the admin. You're all set for
                the hackathon!
              </p>
            </div>
          )}

          {team.paymentStatus === "rejected" && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Payment Rejected</span>
              </div>
              <p className="text-sm mt-1">
                Your payment screenshot was rejected. Please upload a new one or
                contact support.
              </p>
            </div>
          )}

          {team.paymentStatus === "pending" && team.paymentScreenshot && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Payment Under Review</span>
              </div>
              <p className="text-sm mt-1">
                Your payment screenshot has been uploaded and is being reviewed
                by our admin team.
              </p>
            </div>
          )}

          {/* Display existing payment screenshot if available */}
          {team.paymentScreenshot && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Payment Screenshot
              </label>
              <div className="border border-gray-200 rounded-lg p-4">
                <img
                  src={team.paymentScreenshot}
                  alt="Payment Screenshot"
                  className="max-w-full h-auto max-h-64 mx-auto rounded"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="text-gray-500 text-center"
                >
                  Payment screenshot not available
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      team.paymentStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : team.paymentStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    Status:{" "}
                    {team.paymentStatus.charAt(0).toUpperCase() +
                      team.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Form - Show if payment not verified or rejected */}
          {team.paymentStatus !== "verified" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {team.paymentScreenshot
                    ? "Update Payment Screenshot"
                    : "Upload Payment Screenshot"}
                </label>
                <input
                  id="paymentScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Max size: 10MB
                </p>
              </div>

              {paymentScreenshot && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected file: {paymentScreenshot.name}
                  </p>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      "Upload Payment Screenshot"
                    )}
                  </button>
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                  {uploadSuccess}
                  {compressionInfo && (
                    <div className="mt-2 text-sm">
                      <p>📊 Compression Stats:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>
                          Original size:{" "}
                          {(compressionInfo.originalSize / 1024).toFixed(1)} KB
                        </li>
                        <li>
                          Compressed size:{" "}
                          {(compressionInfo.compressedSize / 1024).toFixed(1)}{" "}
                          KB
                        </li>
                        <li>Space saved: {compressionInfo.compressionRatio}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
