import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import ClassCueLogo from '../../images/ClassCueLogo.png'; 

const Login = ({ onSignupClick }) => {
  const [formData, setFormData] = useState({
    enrollment: '', // For students
    email: '',      // For faculty
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Check if device is mobile on component mount
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  // PWA Install functionality
  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
      return;
    }

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    console.log('Device detection:', { isMobile, isIOS, isAndroid, userAgent: navigator.userAgent });

    // Listen for beforeinstallprompt event (mainly for Android Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('PWA install prompt available');
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    // For mobile browsers, always show install button
    const checkPWAReadiness = () => {
      if ('serviceWorker' in navigator) {
        // Register service worker if not already registered
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
            // Always show install button for mobile devices
            if (isMobile || isIOS || isAndroid) {
              setShowInstallButton(true);
              console.log('PWA ready for mobile installation - showing button');
            }
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
            // Even if service worker fails, show button for mobile
            if (isMobile || isIOS || isAndroid) {
              setShowInstallButton(true);
              console.log('Showing install button despite SW failure');
            }
          });
      } else {
        // No service worker support, but still show button for mobile
        if (isMobile || isIOS || isAndroid) {
          setShowInstallButton(true);
          console.log('No SW support, but showing button for mobile');
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check PWA readiness immediately and after delay
    checkPWAReadiness();
    setTimeout(checkPWAReadiness, 1000);
    setTimeout(checkPWAReadiness, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (deferredPrompt) {
      // Android Chrome - use the prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } else if (isIOS) {
      // iOS Safari - show instructions
      alert('To install this app on your iOS device:\n\n1. Tap the Share button (square with arrow up)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install');
    } else if (isAndroid) {
      // Android - show instructions
      alert('To install this app on your Android device:\n\n1. Tap the menu button (⋮) in your browser\n2. Look for "Add to Home screen" or "Install app"\n3. Tap it to install the app');
    } else {
      // Desktop or other browsers
      alert('To install this app:\n\n1. Look for the install icon in your browser address bar\n2. Click it to install the app\n3. Or use your browser\'s menu to add to home screen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use enrollment number for students, email for faculty
      const identifier = formData.role === 'student' ? formData.enrollment : formData.email;
      
      const result = await login(identifier, formData.password, formData.role);
      
      if (result.success) {
        // Navigate to home after successful login
        navigate('/');
      } else {
        // Show error message
        alert(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 relative">
      {/* Custom Download Button - Top Right Corner */}
      {(showInstallButton || isMobileDevice) && (
        <button 
          className="button" 
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            fontSize: '12px',
            padding: '8px 16px',
            width: 'auto',
            minWidth: '80px'
          }}
        >
          <span>Download</span>
        </button>
      )}
      
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <img src={ClassCueLogo} alt='ClassCue'/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ClassCue
            </h1>
            <p className="text-gray-600">
              Smart Curriculum Activity & Attendance App
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'student'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('faculty')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'faculty'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Faculty</span>
                </button>
              </div>
            </div>

            {/* Enrollment or Email Input */}
            {formData.role === 'student' ? (
              <div>
                <label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  id="enrollment"
                  name="enrollment"
                  value={formData.enrollment}
                  onChange={handleInputChange}
                  pattern='^[0-9]{12}$'
                  onInvalid={e => e.target.setCustomValidity('Enrollment number must be exactly 12 digits.')}
                  onInput={e => e.target.setCustomValidity('')}
                  className="input-field"
                  placeholder="Enter your 12-digit enrollment number"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: 240173107002
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  minLength={6}
                  maxLength={15}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Demo credentials:
            </p>
            <div className="text-xs text-gray-500 mb-2">
              <p><strong>Students:</strong> Enrollment: 240173107002, Password: password123</p>
              <p><strong>Faculty:</strong> Email: teacher1@example.com, Password: password123</p>
            </div>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-medium underline">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
