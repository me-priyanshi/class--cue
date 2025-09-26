# ClassCue - Full Stack Setup Instructions

This guide will help you set up the complete ClassCue application with React PWA frontend, Django backend, and PostgreSQL database.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- PostgreSQL installed and running
- Git (optional, for version control)

## Backend Setup (Django + PostgreSQL)

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure PostgreSQL Database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE classcue_db;
CREATE USER postgres WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE classcue_db TO postgres;
```

2. Update database credentials in `ClassCue/settings.py` or create a `.env` file:
```env
DB_NAME=classcue_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
```

### 3. Run Database Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Start Django Development Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Frontend Setup (React PWA)

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

The Django backend provides the following API endpoints:

- `POST /api/register/student/` - Student registration
- `POST /api/register/teacher/` - Teacher registration
- `POST /api/login/` - User login
- `POST /api/token/refresh/` - Refresh JWT token
- `GET /api/profile/` - Get user profile (authenticated)
- `GET /api/subjects/` - Get subjects list (authenticated)

## Database Schema

The application uses the following main models:

- **User**: Custom user model with email authentication
- **StudentProfile**: Student-specific information
- **TeacherProfile**: Teacher-specific information
- **Subject**: Subject/course information

## Environment Variables

Create a `.env` file in the backend directory with:

```env
# Database Configuration
DB_NAME=classcue_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Testing the Integration

1. Start both servers (Django backend and React frontend)
2. Open `http://localhost:5173` in your browser
3. Try registering a new student or teacher
4. Login with the created credentials
5. Verify that the user profile loads correctly

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CORS is properly configured in Django settings
2. **Database Connection**: Verify PostgreSQL is running and credentials are correct
3. **Token Issues**: Check that JWT tokens are being stored and sent correctly
4. **Port Conflicts**: Ensure ports 8000 and 5173 are available

### Debug Mode:

- Backend: Set `DEBUG=True` in Django settings
- Frontend: Check browser console for errors
- Network tab: Verify API calls are being made correctly

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in Django settings
2. Configure proper CORS origins
3. Use environment variables for sensitive data
4. Set up proper database credentials
5. Configure static file serving
6. Use HTTPS for secure communication

## Features Implemented

- ✅ User authentication with JWT
- ✅ Student and Teacher registration
- ✅ Role-based access control
- ✅ CORS configuration for frontend-backend communication
- ✅ PostgreSQL database integration
- ✅ API service layer in React
- ✅ PWA functionality maintained
- ✅ Responsive design

## Next Steps

1. Add more API endpoints for attendance, tasks, etc.
2. Implement real-time features with WebSockets
3. Add file upload functionality
4. Implement push notifications
5. Add more comprehensive error handling
6. Add unit tests for both frontend and backend
