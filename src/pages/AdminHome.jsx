import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";

const AdminHome = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifying, setVerifying] = useState(null);

  const checkAdminAuth = useCallback(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      const [teamsResponse, statsResponse] = await Promise.all([
        adminApi.get("/admin/teams"),
        adminApi.get("/admin/stats"),
      ]);

      setTeams(teamsResponse.data.teams);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAdminAuth();
    fetchData();
  }, [checkAdminAuth, fetchData]);

  const handlePaymentStatusChange = async (teamId, newStatus) => {
    setVerifying(teamId);
    try {
      const response = await adminApi.put(`/admin/teams/${teamId}/payment-status`, {
        paymentStatus: newStatus,
      });

      setTeams(
        teams.map((team) =>
          team._id === teamId ? response.data.team : team
        )
      );

      fetchData();
      
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert(error.response?.data?.message || "Failed to update payment status");
    } finally {
      setVerifying(null);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      await adminApi.put("/admin/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setShowChangePassword(false), 2000);
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError(
        error.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const handleImageClick = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage({ url: "", title: "" });
  };

  const getFilteredTeams = () => {
    if (statusFilter === "all") {
      return teams;
    }
    return teams.filter((team) => team.paymentStatus === statusFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canVerify = (team) => {
    return team.razorpayPaymentId && team.paymentScreenshot && team.idCard;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage teams and verify registrations
              </p>
            </div>
            <div className="flex space-x-4">
              {/* QR Scanner Button - NEW */}
              <button
                onClick={() => navigate("/admin/qr-scanner")}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>QR Scanner</span>
              </button>
              <button
                onClick={() => setShowChangePassword(true)}
                className="btn-secondary"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTeams}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.verifiedPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Docs Uploaded</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.documentsUploaded}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Card - NEW */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎫 Event Check-In</h3>
              <p className="text-purple-100">Scan QR codes for participant entry verification</p>
            </div>
            <button
              onClick={() => navigate("/admin/qr-scanner")}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Open Scanner</span>
            </button>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Team Registrations</h2>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All ({teams.length})</option>
                  <option value="verified">Verified ({teams.filter((t) => t.paymentStatus === "verified").length})</option>
                  <option value="pending">Pending ({teams.filter((t) => t.paymentStatus === "pending").length})</option>
                  <option value="rejected">Rejected ({teams.filter((t) => t.paymentStatus === "rejected").length})</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment TXN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredTeams().map((team) => (
                  <tr key={team._id} className={!canVerify(team) && team.paymentStatus === 'pending' ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                        <div className="text-sm text-gray-500">{team.registrationNumber}</div>
                        <div className="text-xs text-gray-400">{team.teamSize}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{team.leader.name}</div>
                        <div className="text-gray-500">{team.leader.email}</div>
                        <div className="text-gray-400">{team.leader.registrationNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {team.razorpayPaymentId ? (
                        <div className="text-xs">
                          <div className="font-mono bg-gray-100 p-1 rounded">{team.razorpayPaymentId}</div>
                          <div className="text-gray-500 mt-1">₹{team.paymentAmount ? team.paymentAmount / 100 : 0}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500">Not paid</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {team.paymentScreenshot ? (
                          <img
                            src={team.paymentScreenshot}
                            alt="Payment"
                            className="h-12 w-12 object-cover rounded cursor-pointer border-2 border-green-300"
                            onClick={() => handleImageClick(team.paymentScreenshot, "Payment Screenshot")}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-red-100 rounded flex items-center justify-center">
                            <span className="text-xs text-red-600">No SS</span>
                          </div>
                        )}
                        {team.idCard ? (
                          <img
                            src={team.idCard}
                            alt="ID Card"
                            className="h-12 w-12 object-cover rounded cursor-pointer border-2 border-blue-300"
                            onClick={() => handleImageClick(team.idCard, "College ID Card")}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-red-100 rounded flex items-center justify-center">
                            <span className="text-xs text-red-600">No ID</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(team.paymentStatus)}`}>
                        {team.paymentStatus.charAt(0).toUpperCase() + team.paymentStatus.slice(1)}
                      </span>
                      {team.qrCode && (
                        <div className="mt-1">
                          <span className="text-xs text-green-600">✓ QR Generated</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {team.paymentStatus !== "verified" && (
                          <button
                            onClick={() => handlePaymentStatusChange(team._id, "verified")}
                            disabled={!canVerify(team) || verifying === team._id}
                            className={`text-xs px-3 py-1 rounded ${
                              canVerify(team)
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            title={!canVerify(team) ? "Payment and documents required" : "Verify and generate QR"}
                          >
                            {verifying === team._id ? "Verifying..." : "✓ Verify"}
                          </button>
                        )}
                        <button
                          onClick={() => handlePaymentStatusChange(team._id, "rejected")}
                          disabled={team.paymentStatus === "rejected" || verifying === team._id}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          ✗ Reject
                        </button>
                        <button
                          onClick={() => handlePaymentStatusChange(team._id, "pending")}
                          disabled={team.paymentStatus === "pending" || verifying === team._id}
                          className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                        >
                          ⟳ Pending
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {getFilteredTeams().length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">No teams found</div>
                <div className="text-gray-400 text-sm">
                  {statusFilter === "all" ? "No teams registered yet." : `No teams with "${statusFilter}" status.`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordError("");
                        setPasswordSuccess("");
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
            <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white p-2 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
                  <button onClick={closeImageModal} className="text-gray-600 hover:text-gray-900">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;