import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const TeamRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: 'Solo',
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
        navigate('/team-details');
        return;
      }
    } catch (error) {
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
    if (name === 'teamSize') {
      let newMembers = [];
      if (value === 'Duo') {
        newMembers = [{ email: '', registrationNumber: '' }];
      } else if (value === 'Team') {
        newMembers = [
          { email: '', registrationNumber: '' },
          { email: '', registrationNumber: '' }
        ];
      }
      setFormData(prev => ({ ...prev, members: newMembers }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const addMember = () => {
    if (formData.members.length < 3) {
      setFormData({
        ...formData,
        members: [...formData.members, { email: '', registrationNumber: '' }]
      });
    }
  };

  const removeMember = (index) => {
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers });
  };

  const validateForm = () => {
    if (!formData.teamName.trim()) {
      setError('Team name is required');
      return false;
    }

    if (!formData.problemStatement) {
      setError('Please select a problem statement');
      return false;
    }

    if (formData.teamSize === 'Duo' && formData.members.length !== 1) {
      setError('Duo teams must have exactly 1 additional member');
      return false;
    }

    if (formData.teamSize === 'Team' && (formData.members.length < 2 || formData.members.length > 3)) {
      setError('Squad teams must have 2-3 additional members');
      return false;
    }

    // Validate member details
    for (let i = 0; i < formData.members.length; i++) {
      const member = formData.members[i];
      if (!member.email.trim() || !member.registrationNumber.trim()) {
        setError(`Please fill in all details for member ${i + 1}`);
        return false;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email)) {
        setError(`Invalid email format for member ${i + 1}`);
        return false;
      }

      // Check if member is trying to add themselves
      if (member.email === user?.email || member.registrationNumber === user?.registrationNumber) {
        setError('You cannot add yourself as a team member');
        return false;
      }
    }

    // Check for duplicate members
    const emails = formData.members.map(m => m.email);
    const regNumbers = formData.members.map(m => m.registrationNumber);
    
    if (new Set(emails).size !== emails.length) {
      setError('Duplicate member emails detected');
      return false;
    }
    
    if (new Set(regNumbers).size !== regNumbers.length) {
      setError('Duplicate registration numbers detected');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const teamData = {
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        problemStatement: formData.problemStatement,
        members: formData.teamSize === 'Solo' ? [] : formData.members
      };

      const response = await api.post('/teams/register', teamData);
      setSuccess('Team registered successfully! Redirecting to team details...');
      
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

  const getTeamSizeInfo = () => {
    switch (formData.teamSize) {
      case 'Solo':
        return 'Individual participation - just you!';
      case 'Duo':
        return 'Team of 2 - you + 1 member';
      case 'Team':
        return 'Squad of 3-4 - you + 2-3 members';
      default:
        return '';
    }
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
                <option value="Duo">Duo (2 members)</option>
                <option value="Team">Squad (3-4 members)</option>
              </select>
              <p className="mt-2 text-sm text-gray-600">{getTeamSizeInfo()}</p>
            </div>

            {/* Team Members Section */}
            {formData.teamSize !== 'Solo' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                  {formData.teamSize === 'Team' && formData.members.length < 3 && (
                    <button
                      type="button"
                      onClick={addMember}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      + Add Member
                    </button>
                  )}
                </div>

                {formData.members.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Member {index + 1}</h4>
                      {formData.teamSize === 'Team' && formData.members.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="input-field"
                        placeholder="member@example.com"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="Enter registration number"
                        value={member.registrationNumber}
                        onChange={(e) => handleMemberChange(index, 'registrationNumber', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> All team members must be registered on the platform with the same email and registration number provided here.
                  </p>
                </div>
              </div>
            )}

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