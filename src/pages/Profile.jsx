import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    university: '',
    course: '',
    year: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [team, setTeam] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        university: user.university || '',
        course: user.course || '',
        year: user.year || '',
      });
    }
    fetchTeamStatus();
  }, [user]);

  const fetchTeamStatus = async () => {
    try {
      const response = await api.get('/teams/my-team');
      setTeam(response.data.team);
    } catch (error) {
      // No team found - user hasn't registered yet
      console.log('No team found');
    } finally {
      setLoadingTeam(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/users/profile', profileData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }

    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
    }

    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified ✓' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getRegistrationProgress = () => {
    if (!team) return 0;
    let progress = 25; // Registered
    if (team.razorpayPaymentId) progress = 50; // Paid
    if (team.paymentScreenshot && team.idCard) progress = 75; // Documents uploaded
    if (team.paymentStatus === 'verified') progress = 100; // Verified
    return progress;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and hackathon registration status
          </p>
        </div>

        {/* Registration Status Banner */}
        {!loadingTeam && (
          <div className="mb-8">
            {team ? (
              <div className="card bg-gradient-to-r from-primary-50 to-purple-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      🎉 Hackathon Registration Status
                    </h3>
                    <p className="text-gray-600">
                      Team: <strong>{team.teamName}</strong> ({team.registrationNumber})
                    </p>
                  </div>
                  {getStatusBadge(team.paymentStatus)}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Registration Progress</span>
                    <span className="font-semibold text-primary-600">{getRegistrationProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getRegistrationProgress()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className={`text-2xl mb-1 ${team ? 'text-green-500' : 'text-gray-300'}`}>
                      {team ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-600">Registered</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className={`text-2xl mb-1 ${team.razorpayPaymentId ? 'text-green-500' : 'text-gray-300'}`}>
                      {team.razorpayPaymentId ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-600">Payment</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className={`text-2xl mb-1 ${team.paymentScreenshot && team.idCard ? 'text-green-500' : 'text-gray-300'}`}>
                      {team.paymentScreenshot && team.idCard ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-600">Documents</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className={`text-2xl mb-1 ${team.paymentStatus === 'verified' ? 'text-green-500' : 'text-gray-300'}`}>
                      {team.paymentStatus === 'verified' ? '✓' : '○'}
                    </div>
                    <div className="text-xs text-gray-600">Verified</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/team-details')}
                    className="btn-primary"
                  >
                    View Team Details →
                  </button>
                </div>
              </div>
            ) : (
              <div className="card bg-blue-50 border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to Join the Hackathon?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't registered for the hackathon yet. Register now to secure your spot!
                  </p>
                  <button
                    onClick={() => navigate('/team-register')}
                    className="btn-primary"
                  >
                    Register for Hackathon →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
              <p className="text-gray-600">Update your personal information and contact details.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input-field"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="input-field"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                    University/College *
                  </label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    required
                    className="input-field"
                    value={profileData.university}
                    onChange={handleProfileChange}
                    placeholder="Your university name"
                  />
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Degree *
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    required
                    className="input-field"
                    value={profileData.course}
                    onChange={handleProfileChange}
                    placeholder="e.g., B.Tech CSE"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="input-field"
                    value={profileData.year}
                    onChange={handleProfileChange}
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>
              </div>

              {/* Profile Completion Warning */}
              {(!profileData.name || !profileData.phone || !profileData.university || !profileData.course || !profileData.year) && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Complete your profile:</strong> Please fill in all fields before registering for the hackathon.
                  </p>
                </div>
              )}

              {/* Read-only fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field bg-gray-50 cursor-not-allowed"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    className="input-field bg-gray-50 cursor-not-allowed"
                    value={user?.registrationNumber || ''}
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">Registration number cannot be changed</p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
              <p className="text-gray-600">Update your password to keep your account secure.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  className="input-field"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  className="input-field"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="input-field"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;