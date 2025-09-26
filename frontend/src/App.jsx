import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import PWARegistration from './components/PWARegistration.jsx';
import Login from './components/shared/Login.jsx';
import Signup from './components/shared/Signup.jsx';
import Navigation from './components/shared/Navigation.jsx';
import QRCodeAttendance from './components/shared/QRCodeAttendance.jsx';

// Student Components
import StudentDashboard from './components/student/StudentDashboard.jsx';
// import StudentTimetable from './components/student/StudentTimetable.jsx';
import StudentTasks from './components/student/StudentTasks.jsx';
import StudentSettings from './components/student/StudentSettings.jsx';

// Faculty Components
import FacultyDashboard from './components/faculty/FacultyDashboard.jsx';
import FacultyStudents from './components/faculty/FacultyStudents.jsx';
import FacultyAttendance from './components/faculty/FacultyAttendance.jsx';
import FacultySettings from './components/faculty/FacultySettings.jsx';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleAttendanceMarked = () => {
    setAttendanceMarked(true);
    setTimeout(() => setAttendanceMarked(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <div className="min-h-screen bg-gray-50">
                <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="lg:ml-64 transition-all duration-300">
                  <main className="p-4 lg:p-8">
                    {(user.user_role || user.role) === 'student' ? (
                      <>
                        {activeTab === 'dashboard' && <StudentDashboard />}
                        {activeTab === 'attendance' && (
                          <div className="space-y-6">
                            {attendanceMarked && (
                              <div className="card bg-green-50 border-green-200">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-green-800">Attendance Marked Successfully!</h3>
                                    <p className="text-sm text-green-600">Your attendance has been recorded for today.</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <QRCodeAttendance onAttendanceMarked={handleAttendanceMarked} />
                          </div>
                        )}
                        {/* {activeTab === 'timetable' && <StudentTimetable />} */}
                        {activeTab === 'tasks' && <StudentTasks />}
                        {activeTab === 'settings' && <StudentSettings />}
                      </>
                    ) : (
                      <>
                        {activeTab === 'dashboard' && <FacultyDashboard />}
                        {activeTab === 'attendance' && <FacultyAttendance />}
                        {activeTab === 'students' && <FacultyStudents />}
                        {activeTab === 'settings' && <FacultySettings />}
                      </>
                    )}
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PWARegistration />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
