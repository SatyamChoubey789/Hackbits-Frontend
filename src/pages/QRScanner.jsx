import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { checkInTeam, getCheckInStats, getCheckInHistory, undoCheckIn } from '../api/checkInApi';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingCheckIn, setProcessingCheckIn] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchHistory();
  }, []);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      window.location.href = '/admin/login';
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getCheckInStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await getCheckInHistory();
      setHistory(data.teams || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const startScanner = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setCheckInStatus(null);

    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
    }

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: ['QR_CODE']
      },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
    html5QrcodeScannerRef.current = scanner;
  };

  const stopScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const onScanSuccess = (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      setScanResult(data);
      processCheckIn(data.registrationNumber, 'qr_scan');
      stopScanner();
    } catch (err) {
      setError('Invalid QR Code format');
    }
  };

  const onScanFailure = (err) => {
    // Ignore scan failures - they happen continuously while scanning
  };

  const processCheckIn = async (registrationNumber, method = 'qr_scan') => {
    setProcessingCheckIn(true);
    setError(null);
    
    try {
      const response = await checkInTeam(registrationNumber, method);
      
      if (response.success) {
        setCheckInStatus({
          success: true,
          message: response.message,
          timestamp: response.team.checkInTime,
          alreadyCheckedIn: false
        });
        setScanResult(response.team);
        
        // Refresh stats and history
        await fetchStats();
        await fetchHistory();
        
        // Play success sound
        playSuccessSound();
      } else if (response.alreadyCheckedIn) {
        setCheckInStatus({
          success: false,
          message: response.message,
          timestamp: response.checkInTime,
          alreadyCheckedIn: true
        });
        setScanResult(response.team);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setError(error.message || 'Failed to check-in. Please try again.');
      setCheckInStatus({
        success: false,
        message: error.message || 'Check-in failed',
        alreadyCheckedIn: false
      });
    } finally {
      setProcessingCheckIn(false);
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi+K1O7RgC8IA1q37OihUBELTKXh8bllHAU2jdXuzoMvBwZVsuLsoVIRC0un4PGzaBwFN4/U7s+FMAcEV7Th66JTEgpJpuDws2kcBTiP1O3Phjf/');
    audio.play().catch(() => {});
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) {
      setError('Please enter QR code data');
      return;
    }

    try {
      const data = JSON.parse(manualCode);
      setScanResult(data);
      processCheckIn(data.registrationNumber, 'manual_entry');
      setManualCode('');
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setCheckInStatus(null);
    setManualCode('');
  };

  const handleUndoCheckIn = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to undo check-in for ${teamName}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await undoCheckIn(teamId);
      
      if (response.success) {
        await fetchStats();
        await fetchHistory();
        alert('Check-in undone successfully');
      }
    } catch (error) {
      console.error('Undo check-in error:', error);
      alert('Failed to undo check-in: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checkin-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleBack = () => {
    window.location.href = '/admin/home';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🎫 Event Check-In Scanner
                </h1>
                <p className="text-gray-600">Scan QR codes for participant entry</p>
              </div>
            </div>
            <button
              onClick={() => {
                fetchStats();
                fetchHistory();
              }}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-all"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Verified</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.totalVerifiedTeams}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Checked In</p>
                  <p className="text-3xl font-bold text-green-600">{stats.checkedInTeams}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingCheckIns}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Check-In Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.checkInRate}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📷 QR Code Scanner</h2>
            
            {!isScanning && !scanResult && !processingCheckIn && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <button
                  onClick={startScanner}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Scanning
                </button>
              </div>
            )}

            {isScanning && (
              <div>
                <div id="qr-reader" ref={scannerRef} className="rounded-lg overflow-hidden"></div>
                <button
                  onClick={stopScanner}
                  className="w-full mt-4 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  Stop Scanning
                </button>
              </div>
            )}

            {processingCheckIn && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing check-in...</p>
              </div>
            )}

            {/* Manual Entry */}
            {!isScanning && !processingCheckIn && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Manual Entry (JSON)</h3>
                <textarea
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder='Paste QR code JSON data here...'
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono"
                  rows="4"
                />
                <button
                  onClick={handleManualEntry}
                  className="w-full mt-2 bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Submit Manual Entry
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Scan Result</h2>
            
            {!scanResult ? (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Scan a QR code to see details</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Check-in Status */}
                {checkInStatus && (
                  <div className={`p-4 rounded-lg border-2 ${
                    checkInStatus.success 
                      ? 'bg-green-50 border-green-300' 
                      : checkInStatus.alreadyCheckedIn
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">
                        {checkInStatus.success ? '✅' : checkInStatus.alreadyCheckedIn ? '⚠️' : '❌'}
                      </span>
                      <span className={`font-bold ${
                        checkInStatus.success 
                          ? 'text-green-800' 
                          : checkInStatus.alreadyCheckedIn 
                          ? 'text-yellow-800'
                          : 'text-red-800'
                      }`}>
                        {checkInStatus.message}
                      </span>
                    </div>
                    {checkInStatus.timestamp && (
                      <div className="text-sm text-gray-600">
                        {new Date(checkInStatus.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Team Details */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200">
                  <h3 className="font-bold text-lg text-indigo-900 mb-3">🏆 {scanResult.teamName}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration:</span>
                      <span className="font-semibold">{scanResult.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-semibold">{scanResult.teamSize}</span>
                    </div>
                    {scanResult.checkInTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in Time:</span>
                        <span className="font-semibold">{new Date(scanResult.checkInTime).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Leader Details */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">👤 Team Leader</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{scanResult.leader?.name}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{scanResult.leader?.email}</span></div>
                    <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{scanResult.leader?.phone}</span></div>
                    <div><span className="text-gray-600">University:</span> <span className="font-medium">{scanResult.leader?.university}</span></div>
                  </div>
                </div>

                {/* Members */}
                {scanResult.members && scanResult.members.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">👥 Team Members ({scanResult.members.length})</h4>
                    <div className="space-y-3">
                      {scanResult.members.map((member, idx) => (
                        <div key={idx} className="text-sm bg-white p-2 rounded border border-purple-100">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-gray-600 text-xs">{member.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Scan Next Team
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Check-in History */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">📜 Check-in History (Real-time)</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchHistory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                🔄 Refresh
              </button>
              <button
                onClick={exportHistory}
                disabled={history.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 Export
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No teams checked in yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((team, idx) => (
                    <tr key={team._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                        <div className="text-xs text-gray-500">{team.teamSize}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{team.leader?.name}</div>
                        <div className="text-xs text-gray-500">{team.leader?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{team.registrationNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {team.checkInTime ? new Date(team.checkInTime).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleUndoCheckIn(team._id, team.teamName)}
                          disabled={loading}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          Undo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;