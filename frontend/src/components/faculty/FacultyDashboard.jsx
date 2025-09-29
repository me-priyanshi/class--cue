import React, { useState, useEffect } from 'react';
import QRCodeAttendance from '../shared/QRCodeAttendance';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, Download, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { loadStudentsData, loadAttendanceData } from '../../utils/dataLoader.js';
// import studentsData from '../../data/students.json';
// import attendanceData from '../../data/attendance.json';
import ExcelJS from 'exceljs';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  const handleAttendanceMarked = () => {
    setAttendanceSuccess(true);
    setTimeout(() => setAttendanceSuccess(false), 3000);
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    averageAttendance: 0
  });
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ today: { classes: [] }, weekly: { summary: {} } });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load data
    const loadData = async () => {
      const students = await loadStudentsData();
      const attendance = await loadAttendanceData();
      setStudentsData(students);
      setAttendanceData(attendance);
    };
    
    loadData();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (studentsData.length === 0 || attendanceData.today.classes.length === 0) return;

    const todayClasses = attendanceData.today.classes;
    const allStudents = studentsData;

    const presentStudents = new Set();
    const absentStudents = new Set();

    todayClasses.forEach(cls => {
      cls.students.forEach(student => {
        if (student.present) {
          presentStudents.add(student.id);
        } else {
          absentStudents.add(student.id);
        }
      });
    });

    const totalAttendance = allStudents.reduce((sum, student) => sum + student.attendance.percentage, 0);
    const averageAttendance = totalAttendance / allStudents.length;

    setAttendanceStats({
      totalStudents: allStudents.length,
      presentToday: presentStudents.size,
      absentToday: absentStudents.size,
      averageAttendance: Math.round(averageAttendance)
    });

    setTodayAttendance(todayClasses);
  }, [studentsData, attendanceData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const exportAttendanceExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    const headerRow = worksheet.addRow(['Sr No','Student ID', 'Name', 'Email', 'Total Classes', 'Present', 'Absent', 'Percentage']);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    studentsData.forEach((student, index) => {
      const row = worksheet.addRow([
        index + 1,
        student.studentId,
        student.name,
        student.email,
        student.attendance.totalClasses,
        student.attendance.present,
        student.attendance.absent,
        `${student.attendance.percentage}%`
      ]);

      // const baseTint = student.attendance.percentage >= 75 ? 'FFD1FAE5' : 'FFFEE2E2';
      row.eachCell((cell, colNumber) => {
        // cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseTint } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if (colNumber === 1 || colNumber === 2 || colNumber === 5 || colNumber === 6 || colNumber === 7 || colNumber === 8) {
        //   cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
        //   cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.alignment = { horizontal: 'center' };
        }
        // if (colNumber === 6) {
        //   cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };
        //   cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        //   cell.alignment = { horizontal: 'center' };
        // }
      });
    });

    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        const val = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, val.length + 2);
      });
      column.width = Math.min(maxLength, 40);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportAttendancePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('ClassCue Attendance Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add summary stats
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 45);
    doc.setFontSize(10);
    doc.text(`Total Students: ${attendanceStats.totalStudents}`, 20, 55);
    doc.text(`Present Today: ${attendanceStats.presentToday}`, 20, 62);
    doc.text(`Absent Today: ${attendanceStats.absentToday}`, 20, 69);
    doc.text(`Average Attendance: ${attendanceStats.averageAttendance}%`, 20, 76);
    
    // Prepare table data with color coding
    const tableData = studentsData.map((student,index) => [
        index + 1,
        student.studentId,
        student.name,
        student.email,
        student.attendance.totalClasses,
        student.attendance.present,
        student.attendance.absent,
        `${student.attendance.percentage}%`
    ]);
    
    // Add table with custom cell styling
    doc.autoTable({
      head: [['Sr No','Student ID', 'Name', 'Email', 'Total Classes', 'Present', 'Absent', 'Percentage']],
      body: tableData,
      startY: 85,
      styles: {
        fontSize: 8,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0], // Border color
        lineWidth: 0.2,            // Border thickness
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didParseCell: function (data) {
        const nameColIndex = 2;
        const emailColIndex = 3;
        // Center-align all except Name and Email
        if (data.column.index !== nameColIndex && data.column.index !== emailColIndex) {
          data.cell.styles.halign = 'center';
        }
        // Apply border color to all cells
        data.cell.styles.lineColor = [0,0,0]; // Tailwind blue-500
        data.cell.styles.lineWidth = 0.2;
      },

      // didParseCell: function(data) {
        // Color code Present and Absent columns
        // if (data.column.index === 4) { // Present column
        //   data.cell.styles.fillColor = [16, 185, 129]; // Green
        //   data.cell.styles.textColor = [255, 255, 255]; // White text
        //   data.cell.styles.fontStyle = 'bold';
        // }
        // if (data.column.index === 5) { // Absent column
        //   data.cell.styles.fillColor = [239, 68, 68]; // Red
        //   data.cell.styles.textColor = [255, 255, 255]; // White text
        //   data.cell.styles.fontStyle = 'bold';
        // }
      // }
    });
    
    // Save the PDF
    doc.save(`attendance_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // user?.name = 'Guru Drona';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {getGreeting()}, {user?.full_name ? user.full_name.split(' ')[0] + ' ' + user.full_name.split(' ')[1] : 'Faculty'}!
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Time</div>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`card flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{attendanceStats.presentToday}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Present Today</p>
          </div>
        </div>

        <div className={`card flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{attendanceStats.absentToday}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Absent Today</p>
          </div>
        </div>

        <div className={`card flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{attendanceStats.averageAttendance}%</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Avg Attendance</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className={`text-lg font-semibold ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Export Reports</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportAttendanceExcel}
            className={`flex items-center justify-center p-4 rounded-lg border-2 border-green-200 ${theme === 'dark' ? 'bg-green-900 hover:bg-green-800' : 'bg-green-50 hover:bg-green-100'} transition-colors`}
          >
            <Download className="w-5 h-5 text-green-600 mr-2" />
            <div className="text-left">
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Export Excel (.xlsx)</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Download styled Excel file</div>
            </div>
          </button>
          
          

          <button
            onClick={exportAttendancePDF}
            className={`flex items-center justify-center p-4 rounded-lg border-2 border-red-200 ${theme === 'dark' ? 'bg-red-900 hover:bg-red-800' : 'bg-red-50 hover:bg-red-100'} transition-colors`}
          >
            <FileText className="w-5 h-5 text-red-600 mr-2" />
            <div className="text-left">
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Export PDF</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Generate formatted PDF report</div>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Classes */}
      <div className={`card ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-lg flex items-center justify-center`}>
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className={`text-lg font-semibold ml-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Today's Classes</h3>
          </div>
        </div>

        <div className="space-y-4">
          {todayAttendance.map((cls) => (
            <div key={cls.id} className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cls.subject}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{cls.teacher}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{cls.time} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {cls.students.filter(s => s.present).length}/{cls.students.length}
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Present</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Present Students</h5>
                  <div className="space-y-1">
                    {cls.students.filter(s => s.present).map((student) => (
                      <div key={student.id} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{student.name}</span>
                        <span className={`ml-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{student.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Absent Students</h5>
                  <div className="space-y-1">
                    {cls.students.filter(s => !s.present).map((student) => (
                      <div key={student.id} className="flex items-center text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{student.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions + Attendance Trends */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </button>
            <button className="w-full btn-secondary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium text-gray-900">87.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Week</span>
              <span className="text-sm font-medium text-gray-900">92.1%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92.1%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">89.3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89.3%' }}></div>
            </div>
      </div>
        </div>
      </div> */}

      {/* FaceRecognition Modal - Removed to fix warnings */}
      {/* Legacy face recognition code removed as we now use QR attendance sessions */}
    </div>
  );
};

export default FacultyDashboard;
