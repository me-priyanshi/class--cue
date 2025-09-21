import React, { useState } from 'react';
import { Users, Search, Filter, Download, Mail, Phone, TrendingUp, TrendingDown } from 'lucide-react';
import studentsData from '../../data/students.json';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const FacultyStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const { theme } = useTheme();

  const filteredAndSortedStudents = studentsData
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'excellent' && student.attendance.percentage >= 95) ||
                           (filterBy === 'good' && student.attendance.percentage >= 85 && student.attendance.percentage < 95) ||
                           (filterBy === 'average' && student.attendance.percentage >= 75 && student.attendance.percentage < 85) ||
                           (filterBy === 'poor' && student.attendance.percentage < 75);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'attendance':
          aValue = a.attendance.percentage;
          bValue = b.attendance.percentage;
          break;
        case 'present':
          aValue = a.attendance.present;
          bValue = b.attendance.present;
          break;
        case 'absent':
          aValue = a.attendance.absent;
          bValue = b.attendance.absent;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'text-green-600 bg-green-100';
    if (percentage >= 85) return 'text-blue-600 bg-blue-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceIcon = (percentage) => {
    if (percentage >= 95) return <TrendingUp className="w-4 h-4" />;
    if (percentage >= 85) return <TrendingUp className="w-4 h-4" />;
    if (percentage >= 75) return <TrendingDown className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const exportStudentsCSV = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Total Classes', 'Present', 'Absent', 'Percentage', 'Subjects'],
      ...filteredAndSortedStudents.map(student => [
        student.studentId,
        student.name,
        student.email,
        student.attendance.totalClasses,
        student.attendance.present,
        student.attendance.absent,
        student.attendance.percentage,
        student.subjects.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600">View and manage student information and attendance</p>
            </div>
          </div>
          <button
            onClick={exportStudentsCSV}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="name">Name</option>
              <option value="attendance">Attendance %</option>
              <option value="present">Present Classes</option>
              <option value="absent">Absent Classes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Attendance</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Students', color: 'bg-gray-100' },
              { value: 'excellent', label: 'Excellent (≥95%)', color: 'bg-green-100 text-green-800' },
              { value: 'good', label: 'Good (85-94%)', color: 'bg-blue-100 text-blue-800' },
              { value: 'average', label: 'Average (75-84%)', color: 'bg-yellow-100 text-yellow-800' },
              { value: 'poor', label: 'Poor (<75%)', color: 'bg-red-100 text-red-800' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterBy(filter.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterBy === filter.value
                    ? filter.color + ' border-2 border-current'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Show Total Students */}
      <div className="text-center ">
        <h3 className={`rounded-full p-2 text-lg font-lg text-gray-900 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
          Total : {filteredAndSortedStudents.length} {filteredAndSortedStudents.length <= 1 ? `Student` : `Students`}
        </h3>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-200'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white-500' : 'text-gray-500'}`}>
                  Sr. No.
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white-500' : 'text-gray-500'}`}>
                  Student
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white-500' : 'text-gray-500'}`}>
                  Contact
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white-500' : 'text-gray-500'}`}>
                  Attendance
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white-500' : 'text-gray-500'}`}>
                  Subjects
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-y divide-gray-200' : 'bg-white divide-y divide-gray-200'}`}>
              {filteredAndSortedStudents.map((student) => (
                <tr key={student.id} className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-black' : 'bg-white hover:bg-gray-100'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {filteredAndSortedStudents.indexOf(student) + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-200 ' : 'bg-primary-100'}`}>
                        <span className="text-sm font-medium text-primary-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(student.attendance.percentage)}`}>
                        {getAttendanceIcon(student.attendance.percentage)}
                        <span className="ml-1">{student.attendance.percentage}%</span>
                      </span>
                    </div>
                    <div className="text-xs mt-1">
                      {student.attendance.present} present, {student.attendance.absent} absent
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.subjects.map((subject, index) => (
                        <span key={`${student.id}-subject-${subject}-${index}`} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'text-white bg-gray-50' : 'bg-gray-200 text-gray-800' }`}>
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredAndSortedStudents.length}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div> */}
        {/* <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredAndSortedStudents.filter(s => s.attendance.percentage >= 95).length}
          </div>
          <div className="text-sm text-gray-600">Excellent (≥95%)</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredAndSortedStudents.filter(s => s.attendance.percentage >= 85 && s.attendance.percentage < 95).length}
          </div>
          <div className="text-sm text-gray-600">Good (85-94%)</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredAndSortedStudents.filter(s => s.attendance.percentage < 75).length}
          </div>
          <div className="text-sm text-gray-600">Needs Attention</div>
        </div> */}
      {/* </div> */}
  </div>
  )};

export default FacultyStudents;
