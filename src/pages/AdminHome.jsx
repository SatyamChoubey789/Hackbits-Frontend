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
  const [selectedImage, setSelectedImage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    try {
      await adminApi.put(`/admin/teams/${teamId}/payment-status`, {
        paymentStatus: newStatus,
      });

      // Update teams list
      setTeams(
        teams.map((team) =>
          team._id === teamId ? { ...team, paymentStatus: newStatus } : team
        )
      );

      // Update stats
      if (stats) {
        const updatedStats = { ...stats };
        const currentTeam = teams.find((t) => t._id === teamId);
        if (currentTeam) {
          if (
            currentTeam.paymentStatus === "verified" &&
            newStatus !== "verified"
          ) {
            updatedStats.verifiedPayments--;
          } else if (
            currentTeam.paymentStatus !== "verified" &&
            newStatus === "verified"
          ) {
            updatedStats.verifiedPayments++;
          }
        }
        setStats(updatedStats);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
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
      setShowChangePassword(false);
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
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
                Manage teams and payment verification
              </p>
            </div>
            <div className="flex space-x-4">
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
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Teams
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalTeams}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Verified Payments
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.verifiedPayments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Review
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pendingPayments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.rejectedPayments}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teams Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Team Registrations
              </h2>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Filter by status:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Teams ({teams.length})</option>
                  <option value="verified">
                    Approved (
                    {teams.filter((t) => t.paymentStatus === "verified").length}
                    )
                  </option>
                  <option value="pending">
                    Pending (
                    {teams.filter((t) => t.paymentStatus === "pending").length})
                  </option>
                  <option value="rejected">
                    Rejected (
                    {teams.filter((t) => t.paymentStatus === "rejected").length}
                    )
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Screenshot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredTeams().map((team) => (
                  <tr key={team._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {team.teamName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {team.registrationNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {team.problemStatement}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>
                          <strong>Leader:</strong> {team.leader.name}
                        </div>
                        {team.members && team.members.length > 0 && (
                          <div className="mt-1">
                            <strong>Members:</strong>
                            {team.members.map((member, index) => (
                              <div
                                key={index}
                                className="text-xs text-gray-600"
                              >
                                {member.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {team.paymentScreenshot ? (
                        <div className="flex items-center">
                          <img
                            src={team.paymentScreenshot}
                            alt="Payment Screenshot"
                            className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              handleImageClick(team.paymentScreenshot)
                            }
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                          <div
                            style={{ display: "none" }}
                            className="text-xs text-gray-500"
                          >
                            Image not available
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No screenshot
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          team.paymentStatus
                        )}`}
                      >
                        {team.paymentStatus.charAt(0).toUpperCase() +
                          team.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {team.paymentStatus !== "verified" && (
                          <button
                            onClick={() =>
                              handlePaymentStatusChange(team._id, "verified")
                            }
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handlePaymentStatusChange(team._id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                          disabled={team.paymentStatus === "rejected"}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handlePaymentStatusChange(team._id, "pending")
                          }
                          className="text-yellow-600 hover:text-yellow-900 text-xs bg-yellow-50 px-2 py-1 rounded"
                          disabled={team.paymentStatus === "pending"}
                        >
                          Pending
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No teams found message */}
            {getFilteredTeams().length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">No teams found</div>
                <div className="text-gray-400 text-sm">
                  {statusFilter === "all"
                    ? "No teams have been registered yet."
                    : `No teams with "${statusFilter}" payment status found.`}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Password
                </h3>

                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
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
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
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

        {/* Image Zoom Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-full p-4">
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg
                  className="w-8 h-8"
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
              <img
                src={selectedImage}
                alt="Payment Screenshot - Full Size"
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div
                style={{ display: "none" }}
                className="text-white text-center"
              >
                Image not available
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
