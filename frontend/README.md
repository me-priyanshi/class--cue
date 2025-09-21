# Smart Classroom Attendance & Productivity System

A modern, responsive React.js frontend for an AI-powered Smart Classroom Attendance & Productivity System. This application provides role-based access for students and faculty with face recognition capabilities, real-time attendance tracking, and productivity features.

## Features

### 🔐 Authentication & Role-based Access
- Login page with role selection (Student or Faculty)
- Secure authentication with role-based dashboard access
- Persistent login state with localStorage

### 📱 Student Features
- **Dashboard**: Real-time timetable, attendance status, and task recommendations
- **Face Recognition**: Camera-based attendance marking with verification
- **Timetable**: Weekly schedule view with current/next class indicators
- **Tasks**: Academic and personal task management with progress tracking
- **Settings**: Profile management and preferences

### 👨‍🏫 Faculty Features
- **Dashboard**: Overview of student attendance and class statistics
- **Student Management**: Complete student list with attendance tracking
- **Attendance Monitoring**: Real-time class attendance with face recognition
- **Reports**: CSV export functionality for attendance data
- **Analytics**: Attendance trends and performance metrics

### 🎨 UI/UX Features
- Modern, responsive design with Tailwind CSS
- Card-based layout with clean typography
- Mobile-first responsive design
- Intuitive navigation with sidebar/top navbar
- Real-time updates and smooth animations

## Tech Stack

- **Frontend**: React.js 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom design system
- **Camera**: react-webcam for face recognition placeholder
- **Icons**: Lucide React icons
- **Routing**: React Router DOM
- **State Management**: React Context API

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd Attendance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/           # React components
│   ├── Login.js         # Authentication component
│   ├── Navigation.js    # Navigation sidebar/navbar
│   ├── FaceRecognition.js # Face recognition component
│   ├── StudentDashboard.js # Student main dashboard
│   ├── StudentTimetable.js # Student timetable view
│   ├── StudentTasks.js  # Student task management
│   ├── FacultyDashboard.js # Faculty main dashboard
│   ├── FacultyStudents.js # Faculty student management
│   ├── FacultyAttendance.js # Faculty attendance monitoring
│   └── Settings.js      # Settings component
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication context
├── data/               # Mock data files
│   ├── timetable.json  # Class schedule data
│   ├── students.json   # Student information
│   ├── tasks.json      # Task recommendations
│   └── attendance.json # Attendance records
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Usage

### Demo Login
- Use any email and password to login
- Select your role (Student or Faculty) during login
- The system will automatically assign demo data based on your role

### Student Workflow
1. Login as a student
2. View your dashboard with today's schedule
3. Use face recognition to mark attendance
4. Check your timetable and manage tasks
5. Access settings to customize preferences

### Faculty Workflow
1. Login as faculty
2. Monitor student attendance in real-time
3. View detailed student information and performance
4. Export attendance reports as CSV
5. Generate analytics and reports

## Key Components

### Face Recognition
- Uses `react-webcam` for camera access
- Simulates face verification with 90% success rate
- Provides visual feedback for verification status
- Includes retry functionality for failed attempts

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible sidebar for mobile devices
- Grid layouts that adapt to screen size
- Touch-friendly interface elements

### Data Management
- Mock JSON data files for demonstration
- Simulated real-time updates
- Local storage for user authentication
- CSV export functionality for reports

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update color schemes in `src/index.css`
- Customize component styles in individual files

### Data
- Replace mock data in `src/data/` with real API calls
- Modify data structure as needed for your backend
- Add new data fields to JSON files

### Features
- Extend face recognition with real AI services
- Add more dashboard widgets and analytics
- Implement real-time notifications
- Add more export formats (PDF, Excel)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Adding New Features
1. Create new components in `src/components/`
2. Add routes in `App.js`
3. Update navigation in `Navigation.js`
4. Add mock data if needed in `src/data/`

## Future Enhancements

- Real backend integration
- Advanced face recognition AI
- Real-time notifications
- Mobile app development
- Advanced analytics and reporting
- Multi-language support
- Dark mode theme
- Offline functionality

## License

This project is for educational and demonstration purposes.

## Support

For questions or issues, please refer to the component documentation or create an issue in the project repository.
