import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import attendanceData from '../../data/attendance.json';
import timetableData from '../../data/timetable.json';
import StudentProfilePrompt from './StudentProfilePrompt.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const StudentDashboard = () => {
  const {theme} = useTheme();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [nextClassDay, setNextClassDay] = useState("Today");
  const [freePeriods, setFreePeriods] = useState([]);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const now = new Date();
    const todayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const schedule = timetableData[todayName] || [];
    setTodaySchedule(schedule);

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    let current = null;
    let next = null;
    const free = [];

    schedule.forEach((cls, index) => {
      const [startTime, endTime] = cls.time.split(' - ');
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (currentTimeMinutes >= startMinutes && currentTimeMinutes <= endMinutes) {
        current = cls;
      } else if ((currentHour < startHour) || (currentHour < startHour) && !next) {
        next = cls;
      }

      // Free periods
      if (index > 0) {
        const prevClass = schedule[index - 1];
        const [prevEndHour, prevEndMin] = prevClass.time.split(' - ')[1].split(':').map(Number);
        const prevEndMinutes = prevEndHour * 60 + prevEndMin;

        if (startMinutes - prevEndMinutes > 15) {
          free.push({
            start: `${Math.floor(prevEndMinutes / 60)}:${(prevEndMinutes % 60).toString().padStart(2, '0')}`,
            end: startTime,
            duration: startMinutes - prevEndMinutes
          });
        }
      }
    });

    // 🔥 If no next class today → use tomorrow’s first class
    if (!next) {
      const days = Object.keys(timetableData);
      const todayIndex = days.indexOf(todayName);
      const nextDayIndex = (todayIndex + 1) % days.length;
      const tomorrowDayName = days[nextDayIndex];
      const tomorrowSchedule = timetableData[tomorrowDayName] || [];
      if (tomorrowSchedule.length > 0) {
        next = tomorrowSchedule[0];
        setNextClassDay("Tomorrow");
      } else {
        setNextClassDay("Today");
      }
    } else {
      setNextClassDay("Today");
    }

    setCurrentClass(current);
    setNextClass(next);
    setFreePeriods(free);

    return () => clearInterval(timer);
  }, []);

  const getAttendanceStatus = () => {
    const todayAttendance = attendanceData.today.classes;
    const totalClasses = todayAttendance.length;
    const attendedClasses = todayAttendance.filter(cls =>
      cls.students.some(student => student.id === 1 && student.present)
    ).length;

    return {
      attended: attendedClasses,
      total: totalClasses,
      percentage: totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0
    };
  };

  const attendanceStatus = getAttendanceStatus();

  useEffect(() => {
    if (user?.role === 'student') {
      const hasInterests = Array.isArray(user?.interests) && user.interests.length > 0;
      const hasSkills = Array.isArray(user?.skills) && user.skills.length > 0;
      const hasGoals = Array.isArray(user?.goals) && user.goals.length > 0;
      setShowProfilePrompt(!(hasInterests && hasSkills && hasGoals));
    }
  }, [user]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      <StudentProfilePrompt isOpen={showProfilePrompt} onClose={() => setShowProfilePrompt(false)} />
      
      {/* Welcome Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {getGreeting()}, {user?.full_name ? user.full_name.split(' ')[0] : 'Student'}!
            </h1>
            <p className="text-gray-600 mt-1">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500">Current Time</div>
          </div>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Class */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Current Class</h3>
          </div>
          {currentClass ? (
            <div>
              <h4 className="font-medium text-gray-900">{currentClass.subject}</h4>
              <p className="text-sm text-gray-600 mt-1">{currentClass.teacher}</p>
              <p className="text-sm text-gray-500 mt-1">{currentClass.time}</p>
              <p className="text-sm text-gray-500">{currentClass.room}</p>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                In Progress
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No class currently</p>
            </div>
          )}
        </div>

        {/* Next Class */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Next Class</h3>
          </div>
          {nextClass ? (
            <div>
              <h4 className="font-medium text-gray-900">{nextClass.subject}</h4>
              <p className="text-sm text-gray-600 mt-1">{nextClass.teacher}</p>
              <p className="text-sm text-gray-500 mt-1">{nextClass.time}</p>
              <p className="text-sm text-gray-500">{nextClass.room}</p>
              {nextClassDay === "Tomorrow" && (
                <p className="text-xs text-blue-500 mt-2">Starts Tomorrow</p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No upcoming classes</p>
            </div>
          )}
        </div>

        {/* Today's Attendance */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Today's Attendance</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {attendanceStatus.attended}/{attendanceStatus.total}
            </div>
            <p className="text-sm text-gray-600 mt-1">Classes Attended</p>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${attendanceStatus.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{attendanceStatus.percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className={`text-lg font-semibold ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Today's Schedule</h3>
        </div>
        <div className={`space-y-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {todaySchedule.map((cls) => (
            <div
              key={cls.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                currentClass?.id === cls.id
                  ? theme === 'dark'
                    ? 'border-primary-500 bg-primary-900/20'
                    : 'border-primary-500 bg-primary-50'
                  : theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-900'
                    : 'border-gray-200 bg-white hover:border-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {cls.subject}
                    </h4>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        cls.type === 'lecture'
                          ? theme === 'dark'
                            ? 'bg-blue-900/50 text-blue-200'
                            : 'bg-blue-100 text-blue-800'
                          : cls.type === 'practical'
                          ? theme === 'dark'
                            ? 'bg-green-900/50 text-green-200'
                            : 'bg-green-100 text-green-800'
                          : theme === 'dark'
                            ? 'bg-purple-900/50 text-purple-200'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {cls.type}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cls.teacher}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cls.room}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {cls.time}
                  </p>
                  {currentClass?.id === cls.id && (
                    <div className="flex items-center text-sm text-primary-600 mt-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></div>
                      Ongoing
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
    