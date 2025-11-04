import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const TeamRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teamName: ''
  });

  const [loading, setLoading] = useState(false);
  const [checkingTeam, setCheckingTeam] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkExistingTeam();
  }, []);

  // Check if user already registered a team
  const checkExistingTeam = async () => {
    try {
      const response = await api.get('/teams/my-team');
      if (response.data.team) {
        navigate('/team-details');
        return;
      }
    } catch (error) {
      console.log('No existing team found, proceeding with registration');
    } finally {
      setCheckingTeam(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.teamName.trim()) {
      setError('Team name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const teamData = {
        teamName: formData.teamName,
        teamSize: 'Solo',
        members: []
      };

      const response = await api.post('/teams/register', teamData);
      
      // Redirect to team details to complete payment
      navigate('/team-details');
    } catch (error) {
      console.error('Team registration error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(', ') ||
        'Failed to register team';
      setError(errorMessage);
    }

    setLoading(false);
  };

  if (checkingTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking for existing team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Solo Registration
          </h1>
          <p className="text-lg text-gray-600">
            Register yourself for the hackathon and complete the payment process.
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info */}
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Participant</h3>
              <p className="text-primary-700">
                <strong>Name:</strong> {user?.name}<br />
                <strong>Email:</strong> {user?.email}<br />
                <strong>Registration Number:</strong> {user?.registrationNumber}
              </p>
            </div>

            {/* Team Name */}
            <div>
              <label
                htmlFor="teamName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Team Name *
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                required
                className="input-field"
                placeholder="Enter your team name"
                value={formData.teamName}
                onChange={handleChange}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Complete payment verification</li>
                <li>Upload payment screenshot</li>
                <li>Upload college ID card</li>
                <li>Get your team QR code after admin approval</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamRegister;