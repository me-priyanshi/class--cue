import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Users, Clock, Play, Square, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import apiService from '../../services/api.js';

const DynamicQRAttendanceSession = ({ onStopSession }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [session, setSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [qrExpired, setQrExpired] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);
  const qrIntervalRef = useRef(null);

  useEffect(() => {
    // Load subjects
    loadSubjects();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    };
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await apiService.getSubjects();
      setSubjects(response);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setError('Failed to load subjects');
    }
  };

  const startSession = async () => {
    if (!sessionName.trim() || !selectedSubject) {
      setError('Please provide session name and select a subject');
      return;
    }

    try {
      const response = await apiService.createAttendanceSession({
        session_name: sessionName,
        subject_id: selectedSubject
      });
      
      setSession(response);
      setIsActive(true);
      setError(null);
      
      // Start QR code rotation
      startQRCodeRotation(response.id);
      
      // Start attendance polling
      startAttendancePolling(response.id);
      
    } catch (error) {
      console.error('Failed to start session:', error);
      setError('Failed to start attendance session');
    }
  };

  const stopSession = async () => {
    if (!session) return;

    try {
      await apiService.endAttendanceSession(session.id);
      setIsActive(false);
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
      
      onStopSession({
        sessionId: session.id,
        duration: Math.floor((Date.now() - new Date(session.start_time).getTime()) / 1000),
        attendedCount: attendanceCount
      });
      
    } catch (error) {
      console.error('Failed to stop session:', error);
      setError('Failed to stop session');
    }
  };

  const startQRCodeRotation = (sessionId) => {
    // Get initial QR code
    updateQRCode(sessionId);
    
    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setQrExpired(true);
          updateQRCode(sessionId); // Get new QR code
          return 10; // Reset to 10 seconds
        }
        return prev - 1;
      });
    }, 1000);
    
    // Rotate QR code every 10 seconds
    qrIntervalRef.current = setInterval(() => {
      updateQRCode(sessionId);
    }, 10000);
  };

  const updateQRCode = async (sessionId) => {
    try {
      const response = await apiService.getCurrentQRCode(sessionId);
      setQrCode(response.qr_code);
      setQrImage(response.qr_image);
      setQrExpired(false);
      
      // Calculate time remaining
      const expiresAt = new Date(response.expires_at);
      const now = new Date();
      const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setTimeRemaining(remaining);
      
    } catch (error) {
      console.error('Failed to update QR code:', error);
      setQrExpired(true);
    }
  };

  const startAttendancePolling = (sessionId) => {
    // Poll attendance every 2 seconds
    intervalRef.current = setInterval(async () => {
      try {
        const response = await apiService.getSessionAttendance(sessionId);
        setAttendanceCount(response.total_attended);
        setAttendanceRecords(response.attendance_records);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = () => {
    if (!session) return '0:00';
    const startTime = new Date(session.start_time);
    const now = new Date();
    const duration = Math.floor((now - startTime) / 1000);
    return formatTime(duration);
  };

  if (!isActive && !session) {
    return (
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            Start Dynamic QR Attendance Session
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Create a session with rotating QR codes that change every 10 seconds
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Session Name
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="input-field"
              placeholder="e.g., Data Structures - Lecture 1"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} (Semester {subject.semester})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={startSession}
            className="btn-primary w-full flex items-center justify-center"
            disabled={!sessionName.trim() || !selectedSubject}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
          {session?.session_name}
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {session?.subject_name} • Duration: {getSessionDuration()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div className={`p-6 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-primary-600 mr-2" />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Dynamic QR Code
              </h3>
            </div>
            
            {qrImage ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img 
                    src={qrImage} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className={`p-3 rounded-lg ${qrExpired ? (theme === 'dark' ? 'bg-red-900' : 'bg-red-50') : (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50')}`}>
                  <div className="flex items-center justify-center">
                    <Clock className={`w-4 h-4 mr-2 ${qrExpired ? 'text-red-600' : 'text-blue-600'}`} />
                    <span className={`text-sm font-medium ${qrExpired ? (theme === 'dark' ? 'text-red-200' : 'text-red-800') : (theme === 'dark' ? 'text-blue-200' : 'text-blue-800')}`}>
                      {qrExpired ? 'QR Code Expired - Generating New One...' : `Expires in: ${formatTime(timeRemaining)}`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 p-8 rounded-lg inline-block">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Loading QR Code...</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">
                      Initializing QR Code...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="space-y-4">
          <div className={`p-6 rounded-lg border-2 ${theme === 'dark' ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-green-600 mr-2" />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Attendance Count
              </h3>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {attendanceCount}
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                Students Present
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Recent Attendance
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {attendanceRecords.slice(-5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium">{record.student_name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(record.marked_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {attendanceRecords.length === 0 && (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center py-2`}>
                  No attendance yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={stopSession}
          className="btn-primary flex items-center"
        >
          
          End Session
        </button>
        
      </div>

      {/* Instructions */}
      <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
          Instructions for Students:
        </h4>
        <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          <li>• QR code changes every 10 seconds for security</li>
          <li>• Students must scan the current QR code to mark attendance</li>
          <li>• Each student can only mark attendance once per session</li>
          <li>• Attendance is marked in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicQRAttendanceSession;
