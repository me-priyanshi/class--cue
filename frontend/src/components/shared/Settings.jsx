import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, User, Palette, Save, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Select from 'react-select';

const Settings = () => {
  const { user, updateUser, updateUserProfile } = useAuth();
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
      role: user?.role || '',
      enrollment: user?.enrollment_number || '',
      department: user?.department || '',
      semester: user?.semester || '',
      interests: Array.isArray(user?.interests) ? user.interests : [],
      skills: Array.isArray(user?.skills) ? user.skills : [],
      goals: Array.isArray(user?.goals) ? user.goals : []
    },
    appearance: {
      theme: theme || 'light'
    },
    academic: {
      notifications: true,
      assignmentReminders: true,
      examReminders: true,
      attendanceAlerts: true
    }
  });

  const [settings, setSettings] = useState(originalSettings.current);

  // Update settings when user data changes
  useEffect(() => {
    const updatedSettings = {
      profile: {
        name: user?.full_name || '',
        email: user?.user_email || user?.email || '',
        role: user?.role || '',
        enrollment: user?.enrollment_number || '',
        department: user?.department || '',
        semester: user?.semester || '',
        interests: Array.isArray(user?.interests) ? user.interests : [],
        skills: Array.isArray(user?.skills) ? user.skills : [],
        goals: Array.isArray(user?.goals) ? user.goals : []
      },
      appearance: {
        theme: theme || 'light'
      },
      academic: {
        notifications: true,
        assignmentReminders: true,
        examReminders: true,
        attendanceAlerts: true
      }
    };
    
    setSettings(updatedSettings);
    originalSettings.current = updatedSettings;
  }, [user, theme]);

  const interestsData = [
    { text: 'Programming', value: 'programming' },
    { text: 'Web Development', value: 'web-dev' },
    { text: 'Artificial Intelligence', value: 'ai' },
    { text: 'Machine Learning', value: 'ml' },
    { text: 'Data Science', value: 'data-science' },
    { text: 'Cybersecurity', value: 'cybersecurity' },
    { text: 'Mobile Development', value: 'mobile-dev' },
    { text: 'Cloud Computing', value: 'cloud' },
    { text: 'DevOps', value: 'devops' }
  ];

  const skillsData = [
    { text: 'Python', value: 'python' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'Java', value: 'java' },
    { text: 'C++', value: 'cpp' },
    { text: 'React', value: 'react' },
    { text: 'Node.js', value: 'nodejs' },
    { text: 'SQL', value: 'sql' },
    { text: 'Git', value: 'git' },
    { text: 'Docker', value: 'docker' }
  ];

  const goalsData = [
    { text: 'Learn New Technologies', value: 'learn-tech' },
    { text: 'Build Projects', value: 'build-projects' },
    { text: 'Get Internship', value: 'internship' },
    { text: 'Improve Problem Solving', value: 'problem-solving' },
    { text: 'Master Programming Language', value: 'master-lang' },
    { text: 'Contribute to Open Source', value: 'open-source' },
    { text: 'Network with Peers', value: 'networking' },
    { text: 'Research Opportunities', value: 'research' }
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      boxShadow: 'none',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      borderColor: state.isFocused 
        ? '#6366f1' 
        : theme === 'dark' ? '#374151' : '#d1d5db',
      '&:hover': {
        borderColor: theme === 'dark' ? '#4b5563' : '#9fa6b2'
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      borderColor: theme === 'dark' ? '#374151' : '#d1d5db'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme === 'dark' ? '#374151' : '#e0e7ff'
        : theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#374151' : '#e0e7ff'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#374151' : '#e0e7ff'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme === 'dark' ? '#ffffff' : '#4f46e5'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: theme === 'dark' ? '#ffffff' : '#4f46e5',
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#4b5563' : '#c7d2fe',
        color: theme === 'dark' ? '#e5e7eb' : '#4338ca'
      }
    }),
    input: (base) => ({
      ...base,
      color: theme === 'dark' ? '#ffffff' : '#000000'
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === 'dark' ? '#ffffff' : '#000000'
    })
  };

  // Check for unsaved changes whenever settings change (ignore appearance/theme changes)
  useEffect(() => {
    const currentComparable = JSON.stringify({ profile: settings.profile, academic: settings.academic });
    const originalComparable = JSON.stringify({ profile: originalSettings.current.profile, academic: originalSettings.current.academic });
    const hasChanges = currentComparable !== originalComparable;
    setHasUnsavedChanges(hasChanges);
    try {
      localStorage.setItem('settingsHasUnsaved', hasChanges ? '1' : '0');
    } catch (_) {}
  }, [settings]);

  // Keep appearance theme out of unsaved-changes flow by syncing original when theme changes
  useEffect(() => {
    originalSettings.current = {
      ...originalSettings.current,
      appearance: { theme }
    };
    setSettings(prev => ({
      ...prev,
      appearance: { theme }
    }));
  }, [theme]);

  // Listen for external discard requests (e.g., when navigating away from Settings)
  useEffect(() => {
    const discardListener = () => {
      handleDiscardChanges();
    };
    window.addEventListener('settings:discard', discardListener);
    return () => window.removeEventListener('settings:discard', discardListener);
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleTabChange = (tabId) => {
    // If moving from profile -> appearance with unsaved changes, prompt
    if (activeTab === 'profile' && (tabId === 'appearance' || tabId === 'academic') && hasUnsavedChanges) {
      setPendingTabChange(tabId);
      setShowDiscardAlert(true);
      return;
    }

    if (activeTab === 'academic' && (tabId === 'appearance' || tabId === 'profile') && hasUnsavedChanges) {
      setPendingTabChange(tabId);
      setShowDiscardAlert(true);
      return;
    }

    // Otherwise allow switching freely (including appearance -> profile)
    if (hasUnsavedChanges && activeTab !== 'appearance' && tabId !== 'appearance' ) {
      setPendingTabChange(tabId);
      setShowDiscardAlert(true);
      return;
    }

    setActiveTab(tabId);
  };

  const handleDiscardChanges = () => {
    setSettings(originalSettings.current);
    setHasUnsavedChanges(false);
    setShowDiscardAlert(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    try { localStorage.setItem('settingsHasUnsaved', '0'); } catch (_) {}
  };

  const handleKeepChanges = () => {
    setShowDiscardAlert(false);
    setPendingTabChange(null);
  };

  const handleSave = async () => {
    try {
      // Prepare profile data for backend
      const profileData = {
        full_name: settings.profile.name,
        interests: settings.profile.interests,
        skills: settings.profile.skills,
        goals: settings.profile.goals
      };

      // Save to backend
      const updatedProfile = await updateUserProfile(profileData);
      
      // Update local user context with the response from backend
      updateUser({
        full_name: updatedProfile.full_name,
        interests: updatedProfile.interests || [],
        skills: updatedProfile.skills || [],
        goals: updatedProfile.goals || []
      });
      
      // Update the settings state with the updated profile data
      const updatedSettings = {
        ...settings,
        profile: {
          ...settings.profile,
          name: updatedProfile.full_name,
          interests: updatedProfile.interests || [],
          skills: updatedProfile.skills || [],
          goals: updatedProfile.goals || []
        }
      };
      
      setSettings(updatedSettings);
      
      // Update original settings to current settings
      originalSettings.current = JSON.parse(JSON.stringify(updatedSettings));
      setHasUnsavedChanges(false);
      try { localStorage.setItem('settingsHasUnsaved', '0'); } catch (_) {}
      
      console.log('Settings saved successfully:', updatedProfile);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'academic', label: 'Academic', icon: GraduationCap, show: user.role === 'student'},
    { id: 'appearance', label: 'Appearance', icon: Palette }
    // { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Discard Changes Modal
      {showDiscardAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-opacity-50" onClick={handleKeepChanges}>
          <div className={`relative p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-black' : 'bg-white'} max-w-sm w-full m-4`}>
            <div className={`flex items-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} mb-4`}>
              <span className="text-xl font-semibold">Discard Changes?</span>
            </div>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              You have unsaved changes. Are you sure you want to discard them and switch tabs?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleKeepChanges}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
        </div>
      )} */}
      
      {/* Header */}
      <div className="card">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <SettingsIcon className={`w-5 h-5 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </div>
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1 rounded-lg">
              {tabs
              .filter(tab => tab.show === undefined || tab.show)
              .map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
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
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        disabled
                        className="input-field bg-gray-100"
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
                        className="input-field bg-gray-100"
                      />
                    </div>
                    {user?.role === 'teacher' ? (
                      <></>
                    ) : (
                      <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollment Number
                        </label>
                        <input
                          type="text"
                          value={user?.enrollment_number || ''}
                          disabled
                          className="input-field bg-gray-100"
                        />
                      </div>
                    {/* // )}
                    // {user?.role === 'student' ? ( */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Interests</label>
                          <Select
                            isMulti
                            options={interestsData.map(item => ({ value: item.value, label: item.text }))}
                            value={(settings.profile.interests || []).map(value => ({ value, label: interestsData.find(i => i.value === value)?.text }))}
                            onChange={(selected) => handleSettingChange('profile', 'interests', selected ? selected.map(s => s.value) : [])}
                            styles={selectStyles}
                            classNamePrefix="dropdown"
                            placeholder="Select your interests"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Skills</label>
                          <Select
                            isMulti
                            options={skillsData.map(item => ({ value: item.value, label: item.text }))}
                            value={(settings.profile.skills || []).map(value => ({ value, label: skillsData.find(i => i.value === value)?.text }))}
                            onChange={(selected) => handleSettingChange('profile', 'skills', selected ? selected.map(s => s.value) : [])}
                            styles={selectStyles}
                            classNamePrefix="dropdown"
                            placeholder="Select your skills"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Goals</label>
                          <Select
                            isMulti
                            options={goalsData.map(item => ({ value: item.value, label: item.text }))}
                            value={(settings.profile.goals || []).map(value => ({ value, label: goalsData.find(i => i.value === value)?.text }))}
                            onChange={(selected) => handleSettingChange('profile', 'goals', selected ? selected.map(s => s.value) : [])}
                            styles={selectStyles}
                            classNamePrefix="dropdown"
                            placeholder="Select your goals"
                          />
                        </div>
                      </div>
                    {/* // ) : (<span></span>)} */}
                    </>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={settings.profile.role}
                        disabled
                        className="input-field bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                  <div className="space-y-4">
                    <button className="btn-secondary w-full md:w-auto">
                      Change Password
                    </button>
                  </div>
                </div> */}
              </div>
            )}

            {/* Notification Settings */}
            {/* {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications for attendance updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.profile.notifications}
                          onChange={(e) => handleSettingChange('profile', 'notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive attendance reports via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.profile.emailNotifications}
                          onChange={(e) => handleSettingChange('profile', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.profile.smsNotifications}
                          onChange={(e) => handleSettingChange('profile', 'smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Academic Tab */}
            {user?.role === 'student' && activeTab === 'academic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Academic Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Assignment Reminders</h3>
                      <p className="text-sm text-gray-500">Get notified about upcoming assignments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.academic.assignmentReminders}
                        onChange={(e) => handleSettingChange('academic', 'assignmentReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Exam Reminders</h3>
                      <p className="text-sm text-gray-500">Get notified about upcoming exams</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.academic.examReminders}
                        onChange={(e) => handleSettingChange('academic', 'examReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Attendance Alerts</h3>
                      <p className="text-sm text-gray-500">Get notified about low attendance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.academic.attendanceAlerts}
                        onChange={(e) => handleSettingChange('academic', 'attendanceAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={theme}
                        onChange={(e) => {
                          setTheme(e.target.value);
                          handleSettingChange('appearance', 'theme', e.target.value);
                        }}
                        className="input-field"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {/* {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Face Recognition</h4>
                        <p className="text-sm text-gray-600">Allow face recognition for attendance marking</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.faceRecognition}
                          onChange={(e) => handleSettingChange('privacy', 'faceRecognition', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Data Sharing</h4>
                        <p className="text-sm text-gray-600">Allow sharing of anonymized data for research</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Analytics</h4>
                        <p className="text-sm text-gray-600">Help improve the app by sharing usage analytics</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.analytics}
                          onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  <div className="space-y-3">
                    <button className="btn-secondary w-full md:w-auto">
                      Download My Data
                    </button>
                    <button className="btn-secondary w-full md:w-auto ml-0 md:ml-2">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            {/* Save Button */}
            {activeTab !== 'appearance' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className={`flex items-center ${
                    hasUnsavedChanges 
                      ? 'btn-primary' 
                      : 'btn-secondary cursor-not-allowed opacity-50'
                  }`}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {hasUnsavedChanges ? 'Save Changes' : 'No Changes to Save'}
                </button>
                {hasUnsavedChanges && (
                  <p className="text-sm text-orange-600 mt-2">
                    You have unsaved changes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discard Changes Alert Modal */}
      {showDiscardAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${ theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Discard Changes?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to discard them and switch tabs?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleKeepChanges}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscardChanges}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
