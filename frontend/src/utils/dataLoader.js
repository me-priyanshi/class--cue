// Import the JSON files directly
import studentsJson from '../data/students.json';
import attendanceJson from '../data/attendance.json';
import timetableJson from '../data/timetable.json';

// Return the imported JSON directly
async function getLocalJson(type) {
  switch(type) {
    case 'students':
      return studentsJson;
    case 'attendance':
      return attendanceJson;
    case 'timetable':
      return timetableJson;
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
}
export const loadStudentsData = async () => {
  try {
    return await getLocalJson('students');
  } catch (error) {
    console.error('Error loading students data:', error);
    return [];
  }
};

export const loadAttendanceData = async () => {
  try {
    return await getLocalJson('attendance');
  } catch (error) {
    console.error('Error loading attendance data:', error);
    return { today: { classes: [] }, weekly: { summary: {} } };
  }
};

export const loadTasksData = async () => {
  try {
    return await fetchJsonWithFallback('tasks.json');
  } catch (error) {
    console.error('Error loading tasks data:', error);
    return { academic: [], personal: [] };
  }
};

export const loadTimetableData = async () => {
  try {
    return await fetchJsonWithFallback('timetable.json');
  } catch (error) {
    console.error('Error loading timetable data:', error);
    return {};
  }
};
