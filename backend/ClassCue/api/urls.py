# api/urls.py

from django.urls import path
from .views import StudentRegistrationView, TeacherRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Registration URLs
    path('register/student/', StudentRegistrationView.as_view(), name='student-register'),
    path('register/teacher/', TeacherRegistrationView.as_view(), name='teacher-register'),
    
    # Token URLs for login
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]