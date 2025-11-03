import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const TeamRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: 'Solo', // Only "Solo" option remains
    problemStatement: '',
    members: []
  });
  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingTeam, setCheckingTeam] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProblemStatements();
    checkExistingTeam();
  }, []);

  const checkExistingTeam = async () => {
    try {
      const response = await api.get('/teams/my-team');
      if (response.data.team) {
        // Team already exists, redirect to team details
        navigate('/team-details');
        return;
      }
    } catch (error) {
      // No team found or error, continue with registration
      console.log('No existing team found, proceeding with registration');
    } finally {
      setCheckingTeam(false);
    }
  };

  const fetchProblemStatements = async () => {
    try {
      const response = await api.get('/teams/problem-statements');
      setProblemStatements(response.data.problemStatements);
    } catch (error) {
      console.error('Error fetching problem statements:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset members when team size changes
    if (name === 'teamSize' && value === 'Solo') {
      setFormData(prev => ({ ...prev, members: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate the form
      const validMembers = [];
      if (formData.teamSize === 'Solo') {
        validMembers.push({
          email: user?.email,
          registrationNumber: user?.registrationNumber
        });
      }

      const teamData = {
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        problemStatement: formData.problemStatement,
        members: validMembers
      };

      const response = await api.post('/teams/register', teamData);
      setSuccess('Team registered successfully! Redirecting to team details...');
      
      // Redirect to team details after 2 seconds
      setTimeout(() => {
        navigate('/team-details');
      }, 2000);
    } catch (error) {
      console.error('Team registration error:', error);
      const errorMessage = error.response?.data?.message || 
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Registration</h1>
          <p className="text-lg text-gray-600">
            Register your team for the hackathon and start your innovation journey.
          </p>
        </div>

        <div className="card">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Leader Info */}
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Team Leader</h3>
              <p className="text-primary-700">
                <strong>Name:</strong> {user?.name}<br />
                <strong>Email:</strong> {user?.email}<br />
                <strong>Registration Number:</strong> {user?.registrationNumber}
              </p>
            </div>

            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Team Size */}
            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                Team Size *
              </label>
              <select
                id="teamSize"
                name="teamSize"
                required
                className="input-field"
                value={formData.teamSize}
                onChange={handleChange}
              >
                <option value="Solo">Solo (1 member)</option>
              </select>
            </div>

            {/* Problem Statement */}
            <div>
              <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-2">
                Problem Statement *
              </label>
              <select
                id="problemStatement"
                name="problemStatement"
                required
                className="input-field"
                value={formData.problemStatement}
                onChange={handleChange}
              >
                <option value="">Select a problem statement</option>
                {problemStatements.map((statement, index) => (
                  <option key={index} value={statement}>
                    {statement}
                  </option>
                ))}
              </select>
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
                    Registering Team...
                  </div>
                ) : (
                  'Register Team'
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
