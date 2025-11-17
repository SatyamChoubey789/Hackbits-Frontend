import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";

const AdminCheckin = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, checkedin, pending
  const [checking, setChecking] = useState(null);

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
        adminApi.get("/admin/checkin-stats"),
      ]);

      const verifiedTeams = teamsResponse.data.teams.filter(
        (team) => team.paymentStatus === "verified"
      );
      setTeams(verifiedTeams);
      setFilteredTeams(verifiedTeams);
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

  useEffect(() => {
    filterAndSearchTeams();
  }, [searchQuery, filterStatus, teams]);

  const filterAndSearchTeams = () => {
    let filtered = [...teams];

    // Apply status filter
    if (filterStatus === "checkedin") {
      filtered = filtered.filter((team) => team.checkedIn === true);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((team) => team.checkedIn !== true);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (team) =>
          team.ticketNumber?.toLowerCase().includes(query) ||
          team.teamName.toLowerCase().includes(query) ||
          team.registrationNumber.toLowerCase().includes(query) ||
          team.leader.name.toLowerCase().includes(query) ||
          team.leader.email.toLowerCase().includes(query)
      );
    }

    setFilteredTeams(filtered);
  };

  const handleCheckIn = async (teamId, currentStatus) => {
    setChecking(teamId);
    try {
      const response = await adminApi.put(`/admin/teams/${teamId}/checkin`, {
        checkedIn: !currentStatus,
        checkinTime: new Date(),
      });

      // Update teams list
      setTeams(
        teams.map((team) =>
          team._id === teamId ? response.data.team : team
        )
      );

      // Refresh stats
      fetchData();
    } catch (error) {
      console.error("Error updating check-in:", error);
      alert(error.response?.data?.message || "Failed to update check-in status");
    } finally {
      setChecking(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading check-in dashboard...</p>
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
                Check-in Dashboard
              </h1>
              <p className="text-gray-600">Venue entry management system</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/admin/home")}
                className="btn-secondary"
              >
                ← Back to Admin
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Verified</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalVerified}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Checked In</p>
                  <p className="text-2xl font-semibold text-green-600">{stats.checkedIn}</p>
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
                  <p className="text-sm font-medium text-gray-600">Not Checked In</p>
                  <p className="text-2xl font-semibold text-yellow-600">{stats.notCheckedIn}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Check-in Rate</p>
                  <p className="text-2xl font-semibold text-purple-600">{stats.checkinRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Ticket number, team name, registration no., name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Participants ({teams.length})</option>
                <option value="checkedin">Checked In ({teams.filter(t => t.checkedIn).length})</option>
                <option value="pending">Not Checked In ({teams.filter(t => !t.checkedIn).length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No participants found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team._id}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
                  team.checkedIn ? "border-l-4 border-green-500" : "border-l-4 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {team.leader.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{team.teamName}</h3>
                        <p className="text-sm text-gray-500">{team.leader.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Ticket Number</p>
                        <p className="font-mono text-lg font-semibold text-primary-600">
                          {team.ticketNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Registration No.</p>
                        <p className="font-medium text-gray-900">{team.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Team Size</p>
                        <p className="font-medium text-gray-900">{team.teamSize}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="text-sm text-gray-700">{team.leader.email}</p>
                      </div>
                      {team.leader.phone && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Phone</p>
                          <p className="text-sm text-gray-700">{team.leader.phone}</p>
                        </div>
                      )}
                    </div>

                    {team.checkedIn && team.checkinTime && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          ✓ Checked in at {new Date(team.checkinTime).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-3">
                    {team.checkedIn ? (
                      <>
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                          ✓ Checked In
                        </div>
                        <button
                          onClick={() => handleCheckIn(team._id, team.checkedIn)}
                          disabled={checking === team._id}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
                        >
                          {checking === team._id ? "Updating..." : "✗ Mark Absent"}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-sm">
                          ⏱️ Pending
                        </div>
                        <button
                          onClick={() => handleCheckIn(team._id, team.checkedIn)}
                          disabled={checking === team._id}
                          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
                        >
                          {checking === team._id ? "Checking in..." : "✓ Check In"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCheckin;