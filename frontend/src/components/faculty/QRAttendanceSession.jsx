import React, { useState, useEffect } from 'react';
import { QrCode, StopCircle, Clock, Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import qr from '../../images/qr.png';

const QRAttendanceSession = ({ onStopSession }) => {
  const { theme } = useTheme();
  const [sessionStartTime, setSessionStartTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [qrCodeData, setQrCodeData] = useState('');
  const [attendedStudents, setAttendedStudents] = useState([]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Generate QR code data (in a real app, this would be a unique session ID)
  useEffect(() => {
    const sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQrCodeData(JSON.stringify({
      sessionId,
      timestamp: sessionStartTime.toISOString(),
      type: 'attendance'
    }));
  }, [sessionStartTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopSession = () => {
    onStopSession({
      sessionId: JSON.parse(qrCodeData).sessionId,
      duration: elapsedTime,
      attendedCount: attendedStudents.length,
      attendedStudents
    });
  };

  return (
    <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="text-center space-y-6">
        {/* Session Header */}
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            Attendance Session Active
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
              <span className={`text-lg font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div className="flex items-center">
              <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mr-2`} />
              <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {attendedStudents.length} Students
              </span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className={`p-6 rounded-lg border-2 ${theme === 'dark' ? 'bg-black border-gray-300' : 'bg-white border-gray-200'}`}>
            <div className="text-center mb-4">
              <QrCode className={`w-16 h-16 mx-auto ${theme === 'dark' ? 'text-gray-800' : 'text-gray-600'}`} />
              <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'} mt-2`}>
                Students scan this QR code
              </p>
            </div>
            {/* In a real app, you would use a QR code library like qrcode.js */}
            <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <img src={qr} alt='QR Code' width={250} height={250}/>
                {/* <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400 mt-1">Session ID: {JSON.parse(qrCodeData || '{}').sessionId}</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          <p className="mb-2">Students should scan the QR code above to mark their attendance.</p>
          <p className="text-sm">Session started at {sessionStartTime.toLocaleTimeString()}</p>
        </div>

        {/* Attended Students List */}
        {attendedStudents.length > 0 && (
          <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              Attended Students
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {attendedStudents.map((student, index) => (
                <div key={`attended-student-${student.id || student.name || index}`} className={`flex items-center p-2 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                  <CheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mr-2`} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    {student.name || `Student ${index + 1}`}
                  </span>
                  <span className={`text-xs ml-auto ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {student.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stop Session Button */}
        <div className="pt-6">
          <button
            onClick={handleStopSession}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium flex items-center mx-auto transition-colors duration-200"
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Stop Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRAttendanceSession;
