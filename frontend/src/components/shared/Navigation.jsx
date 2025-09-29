import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Camera,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ClassCueLogo from '../../images/ClassCueLogo.png';

const UserAvatar = ({ user, theme }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
        {getInitials(user?.full_name || 'User')}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {user?.full_name}
        </p>
        <p className={`text-xs capitalize ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {user?.role}
        </p>
      </div>
    </div>
  );
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'attendance', label: 'QR Attendance', icon: Camera },
    // { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const facultyNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'attendance', label: 'Attendance', icon: Users },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const navItems = user?.role === 'student' ? studentNavItems : facultyNavItems;

  const handleLogout = () => {
    logout();
  };

  const NavItem = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    
    return (
      <button
        onClick={() => {
          const leavingSettings = activeTab === 'settings' && item.id !== 'settings';
          if (leavingSettings) {
            let hasUnsaved = false;
            try { hasUnsaved = localStorage.getItem('settingsHasUnsaved') === '1'; } catch (_) {}
            if (hasUnsaved) {
              const proceed = window.confirm('You have unsaved changes in Settings. Discard and leave?');
              if (!proceed) return;
              window.dispatchEvent(new Event('settings:discard'));
            }
          }
          setActiveTab(item.id);
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary-100 text-primary-500'
            : theme === 'dark' 
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r ${
        theme === 'dark' ? 'lg:bg-gray-850 lg:border-gray-700' : 'lg:bg-white lg:border-gray-200'}`}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-4">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <img src={ClassCueLogo} alt='ClassCue' width={50} height={50}/>
            </div>
            <span className={`ml-2 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>&nbsp;&nbsp;ClassCue</span>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <UserAvatar user={user} theme={theme} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-2 p-2">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Logout Button */}
          <div className="px-4 mt-4">
            <button
              onClick={handleLogout}
              // className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                ${theme === 'dark' 
                  ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}>
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`block lg:hidden border-b border-gray-200 px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <img src={ClassCueLogo} alt='ClassCue' width={40} height={40}/>
            </div>
            <span className={`ml-2 text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ClassCue</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
              {user?.full_name ? user.full_name.split(' ').map(word => word[0]).join('').toUpperCase() : 'U'}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`fixed top-0 right-0 w-64 h-full shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}> {/*'bg-gray-800' : 'bg-white'}`}>*/}
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className={`ml-2 text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ClassCue</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <UserAvatar user={user} theme={theme} />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.id} item={item} isMobile={true} />
                ))}
              </nav>

              {/* Mobile Logout Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  // className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200">
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                      : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  }`}>
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
