// File: src/api/checkInApi.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.hackbits.tech/backend/api';

// Create axios instance
const checkInApi = axios.create({
  baseURL: API_URL,
});

// Add token to all requests
checkInApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
checkInApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// CHECK-IN API METHODS
// ============================================

/**
 * Check-in a team
 * @param {string} registrationNumber - Team registration number
 * @param {string} method - 'qr_scan' or 'manual_entry'
 * @returns {Promise} - Check-in response
 */
export const checkInTeam = async (registrationNumber, method = 'qr_scan') => {
  try {
    const response = await checkInApi.post('/checkin', {
      registrationNumber,
      method
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to check-in team' };
  }
};

/**
 * Get check-in statistics
 * @returns {Promise} - Statistics object
 */
export const getCheckInStats = async () => {
  try {
    const response = await checkInApi.get('/checkin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stats' };
  }
};

/**
 * Get check-in history (all checked-in teams)
 * @returns {Promise} - List of checked-in teams
 */
export const getCheckInHistory = async () => {
  try {
    const response = await checkInApi.get('/checkin/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch history' };
  }
};

/**
 * Undo a team's check-in
 * @param {string} teamId - Team ID
 * @returns {Promise} - Undo response
 */
export const undoCheckIn = async (teamId) => {
  try {
    const response = await checkInApi.post(`/checkin/undo/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to undo check-in' };
  }
};

/**
 * Verify if a team can be checked in
 * @param {string} registrationNumber - Team registration number
 * @returns {Promise} - Verification response
 */
export const verifyCheckIn = async (registrationNumber) => {
  try {
    const response = await checkInApi.post('/checkin/verify', {
      registrationNumber
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify team' };
  }
};

export default checkInApi;