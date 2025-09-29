// Utility functions to load data from public folder
const baseUrl = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
const withBase = (path) => `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

async function fetchJsonWithFallback(path) {
  const primary = withBase(path);
  const legacy = `/classCue/${path.replace(/^\//, '')}`;
  try {
    const res = await fetch(primary);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (_) {
    const res2 = await fetch(legacy);
    if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
    return await res2.json();
  }
}
export const loadStudentsData = async () => {
  try {
    return await fetchJsonWithFallback('students.json');
  } catch (error) {
    console.error('Error loading students data:', error);
    return [];
  }
};

export const loadAttendanceData = async () => {
  try {
    return await fetchJsonWithFallback('attendance.json');
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
