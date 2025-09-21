import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const QRCodeAttendance = ({ onAttendanceMarked, classId }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader");
        const cameras = await Html5Qrcode.getCameras();
        
        if (cameras && cameras.length) {
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              html5QrCode.stop();
              setScanResult(decodedText);
              setScanning(false);
              setTimeout(() => {
                onAttendanceMarked && onAttendanceMarked();
              }, 1500);
            },
            (errorMessage) => {
              // Don't set error for normal scanning attempts
              if (errorMessage.includes("NotFoundError")) {
                setError("Please ensure the QR code is clearly visible");
              }
            }
          );
        } else {
          setError("No camera found");
          setScanning(false);
        }
      } catch (err) {
        setError("Failed to start camera: " + err.message);
        setScanning(false);
      }
    };

    if (scanning) {
      startScanner();
    }

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [scanning, onAttendanceMarked]);

  const startScanning = () => {
    setScanning(true);
    setScanResult(null);
    setError(null);
  };

  const videoStyle = {
    display: 'inline',
    width: '100%',
    height: 'auto'
  };
  
  return (
    <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="text-center mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          QR Code Attendance
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Scan the QR code displayed by your instructor to mark attendance
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {!scanning && !scanResult && (
          <button
            onClick={startScanning}
            className="btn-primary flex items-center justify-center w-full md:w-auto px-6 py-2"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Start Scanning
          </button>
        )}

        {scanning && (
          <div className="w-full max-w-sm" style={videoStyle}>
            <div id="qr-reader" style={{
              minHeight: '300px',
              position: 'relative',
              zIndex: 999
            }}
            className="w-full overflow-hidden rounded-lg"></div>
          </div>
        )}

        {scanResult && (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'} w-full max-w-sm`}>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-green-100' : 'text-green-800'}`}>
                  Attendance Marked Successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900' : 'bg-red-50'} w-full max-w-sm`}>
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-800'}`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure QR code is clearly visible</li>
            <li>Hold your device steady</li>
            <li>Position QR code within the scanner frame</li>
            <li>Ensure good lighting conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRCodeAttendance;
