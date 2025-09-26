import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, User, Palette, Save, GraduationCap, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const FacultySettings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState(null);
  
  // Store original settings to compare against
  const originalSettings = useRef({
    profile: {
      name: user?.full_name || '',
      email: user?.user_email || user?.email || '',
      department: user?.department || '',
      designation: 'Professor',
      specialization: 'Computer Science',
      experience: '10+ years',
      bio: 'Experienced educator with expertise in computer science and software engineering.'
    },
    appearance: {
      theme: theme
    },
    notifications: {
      attendanceAlerts: true,
      studentUpdates: true,
      systemNotifications: true,
      emailDigest: true,
      weeklyReports: false
    },
    teaching: {
      autoAttendance: false,
      attendanceThreshold: 75,
      lateMarking: true,
      bulkOperations: true
    }
  });

  const [settings, setSettings] = useState(originalSettings.current);

  // Check for unsaved changes whenever settings change
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings.current);
    setHasUnsavedChanges(hasChanges);
  }, [settings]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Update theme if changed
    if (settings.appearance.theme !== theme) {
      setTheme(settings.appearance.theme);
    }
    
    // Update user profile
    updateUser({
      full_name: settings.profile.name,
      bio: settings.profile.bio,
      specialization: settings.profile.specialization
    });

    // Update original settings
    originalSettings.current = { ...settings };
    setHasUnsavedChanges(false);
    
    // Show success message
    alert('Settings saved successfully!');
  };

  const handleTabChange = (newTab) => {
    if (hasUnsavedChanges) {
      setPendingTabChange(newTab);
      setShowDiscardAlert(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleDiscardChanges = () => {
    setSettings(originalSettings.current);
    setHasUnsavedChanges(false);
    setShowDiscardAlert(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleKeepEditing = () => {
    setShowDiscardAlert(false);
    setPendingTabChange(null);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'teaching', label: 'Teaching', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Settings</h1>
            <p className="text-gray-600 mt-1">Manage your faculty account and teaching preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className={`btn-primary flex items-center ${
                !hasUnsavedChanges ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={settings.profile.department}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={settings.profile.designation}
                      onChange={(e) => handleSettingChange('profile', 'designation', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={settings.profile.specialization}
                      onChange={(e) => handleSettingChange('profile', 'specialization', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={settings.profile.experience}
                      onChange={(e) => handleSettingChange('profile', 'experience', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Tell us about yourself and your teaching philosophy..."
                  />
                </div>
              </div>
            )}

            {/* Teaching Tab */}
            {activeTab === 'teaching' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Teaching Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Auto Attendance</h3>
                      <p className="text-sm text-gray-500">Automatically mark attendance based on QR scans</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.teaching.autoAttendance}
                        onChange={(e) => handleSettingChange('teaching', 'autoAttendance', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attendance Threshold (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.teaching.attendanceThreshold}
                      onChange={(e) => handleSettingChange('teaching', 'attendanceThreshold', parseInt(e.target.value))}
                      className="input-field w-32"
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum attendance percentage for students</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Late Marking</h3>
                      <p className="text-sm text-gray-500">Allow marking attendance after class time</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.teaching.lateMarking}
                        onChange={(e) => handleSettingChange('teaching', 'lateMarking', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Bulk Operations</h3>
                      <p className="text-sm text-gray-500">Enable bulk attendance operations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.teaching.bulkOperations}
                        onChange={(e) => handleSettingChange('teaching', 'bulkOperations', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Attendance Alerts</h3>
                      <p className="text-sm text-gray-500">Get notified about attendance issues</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.attendanceAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'attendanceAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Student Updates</h3>
                      <p className="text-sm text-gray-500">Get notified about student activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.studentUpdates}
                        onChange={(e) => handleSettingChange('notifications', 'studentUpdates', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">System Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified about system updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'systemNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Digest</h3>
                      <p className="text-sm text-gray-500">Receive daily email summaries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailDigest}
                        onChange={(e) => handleSettingChange('notifications', 'emailDigest', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                      <p className="text-sm text-gray-500">Receive weekly attendance reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Appearance Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light', description: 'Clean and bright' },
                      { id: 'dark', label: 'Dark', description: 'Easy on the eyes' },
                      { id: 'system', label: 'System', description: 'Follow system' }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => handleSettingChange('appearance', 'theme', themeOption.id)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          settings.appearance.theme === themeOption.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{themeOption.label}</div>
                        <div className="text-sm text-gray-500">{themeOption.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discard Changes Alert */}
      {showDiscardAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discard Changes?</h3>
            <p className="text-gray-600 mb-4">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDiscardChanges}
                className="btn-secondary"
              >
                Discard
              </button>
              <button
                onClick={handleKeepEditing}
                className="btn-primary"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultySettings;
