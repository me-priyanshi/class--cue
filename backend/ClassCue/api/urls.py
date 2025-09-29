# api/urls.py

from django.urls import path
from .views import (
    StudentRegistrationView, 
    TeacherRegistrationView, 
    login_view, 
    user_profile, 
    update_user_profile,
    subjects_list,
    create_attendance_session,
    get_current_qr_code,
    mark_attendance,
    get_session_attendance,
    end_attendance_session,
    get_teacher_sessions
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Registration URLs
    path('register/student/', StudentRegistrationView.as_view(), name='student-register'),
    path('register/teacher/', TeacherRegistrationView.as_view(), name='teacher-register'),
    
    # Authentication URLs
    path('login/', login_view, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile and Data URLs
    path('profile/', user_profile, name='user-profile'),
    path('profile/update/', update_user_profile, name='update-user-profile'),
    path('subjects/', subjects_list, name='subjects-list'),
    
    # Dynamic QR Attendance URLs
    path('attendance/sessions/', create_attendance_session, name='create-attendance-session'),
    path('attendance/sessions/<int:session_id>/qr/', get_current_qr_code, name='get-current-qr'),
    path('attendance/sessions/<int:session_id>/attendance/', get_session_attendance, name='get-session-attendance'),
    path('attendance/sessions/<int:session_id>/end/', end_attendance_session, name='end-attendance-session'),
    path('attendance/sessions/', get_teacher_sessions, name='get-teacher-sessions'),
    path('attendance/mark/', mark_attendance, name='mark-attendance'),
]