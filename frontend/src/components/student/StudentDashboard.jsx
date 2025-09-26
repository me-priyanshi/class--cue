import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import tasksData from '../../data/tasks.json';
import attendanceData from '../../data/attendance.json';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [freePeriods, setFreePeriods] = useState([]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

    // Get today's schedule
    // const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    // const schedule = timetableData[today] || [];
    // setTodaySchedule(schedule);

    // Find current and next class
    // const now = new Date();
    // const currentHour = now.getHours();
    // const currentMinute = now.getMinutes();
    // const currentTimeMinutes = currentHour * 60 + currentMinute;

    // let current = null;
    // let next = null;
    // const free = [];

    // schedule.forEach((cls, index) => {
    //   const [startTime, endTime] = cls.time.split(' - ');
    //   const [startHour, startMin] = startTime.split(':').map(Number);
    //   const [endHour, endMin] = endTime.split(':').map(Number);
      
    //   const startMinutes = startHour * 60 + startMin;
    //   const endMinutes = endHour * 60 + endMin;

    //   if (currentTimeMinutes >= startMinutes && currentTimeMinutes <= endMinutes) {
    //     current = cls;
    //   } else if (currentTimeMinutes < startMinutes && !next) {
    //     next = cls;
    //   }

    //   // Check for free periods
    //   if (index > 0) {
    //     const prevClass = schedule[index - 1];
    //     const [prevEndHour, prevEndMin] = prevClass.time.split(' - ')[1].split(':').map(Number);
    //     const prevEndMinutes = prevEndHour * 60 + prevEndMin;
        
    //     if (startMinutes - prevEndMinutes > 15) {
    //       free.push({
    //         start: `${Math.floor(prevEndMinutes / 60)}:${(prevEndMinutes % 60).toString().padStart(2, '0')}`,
    //         end: startTime,
    //         duration: startMinutes - prevEndMinutes
    //       });
    //     }
    //   }
    // });

  //   setCurrentClass(current);
  //   setNextClass(next);
  //   setFreePeriods(free);

  //   return () => clearInterval(timer);
  // }, []);

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

  const getRecommendedTasks = () => {
    const currentHour = new Date().getHours();
    const academicTasks = tasksData.academic.slice(0, 3);
    const personalTasks = tasksData.personal.slice(0, 2);
    
    return [...academicTasks, ...personalTasks];
  };

  const recommendedTasks = getRecommendedTasks();

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
      {/* Welcome Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
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
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No more classes today</p>
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
      {/* <div className="card">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 ml-3">Today's Schedule</h3>
        </div>
        <div className="space-y-3">
          {todaySchedule.map((cls, index) => (
            <div 
              key={cls.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                currentClass?.id === cls.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{cls.subject}</h4>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      cls.type === 'lecture' 
                        ? 'bg-blue-100 text-blue-800'
                        : cls.type === 'practical'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {cls.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{cls.teacher}</p>
                  <p className="text-sm text-gray-500">{cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{cls.time}</p>
                  {currentClass?.id === cls.id && (
                    <div className="flex items-center text-sm text-primary-600 mt-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-1 animate-pulse"></div>
                      Now
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Free Periods & Task Recommendations */}
      {freePeriods.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Free Periods */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Free Periods</h3>
            </div>
            <div className="space-y-3">
              {freePeriods.map((period, index) => (
                <div key={`free-period-${period.start}-${period.end}`} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">
                        {period.start} - {period.end}
                      </p>
                      <p className="text-sm text-yellow-600">
                        {Math.floor(period.duration / 60)}h {period.duration % 60}m available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-800">
                        Free Time
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Recommendations */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Recommended Tasks</h3>
            </div>
            <div className="space-y-3">
              {recommendedTasks.map((task) => (
                <div key={task.id} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-indigo-900">{task.title}</h4>
                      <p className="text-sm text-indigo-700 mt-1">{task.description}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority} priority
                        </span>
                        <span className="ml-2 text-xs text-indigo-600">
                          {task.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
