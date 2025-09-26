# api/views.py

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
import uuid
import qrcode
import io
import base64
from .models import User, StudentProfile, TeacherProfile, Subject, AttendanceSession, AttendanceRecord
from .serializers import UserSerializer, StudentProfileSerializer, TeacherProfileSerializer, SubjectSerializer, AttendanceSessionSerializer, AttendanceRecordSerializer

class StudentRegistrationView(generics.CreateAPIView):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.AllowAny] 

class TeacherRegistrationView(generics.CreateAPIView):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'student')  # Default to student
    
    if not email or not password:
        return Response(
            {'error': 'Email/Enrollment and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # For students, try to find by enrollment number first
    if role == 'student':
        try:
            # Try to find student by enrollment number
            student_profile = StudentProfile.objects.get(enrollment_number=email)
            user = student_profile.user
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                # Return complete student profile
                student_data = StudentProfileSerializer(student_profile).data
                student_data['user_id'] = user.id
                student_data['user_email'] = user.email
                student_data['user_role'] = user.role
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': student_data
                })
        except StudentProfile.DoesNotExist:
            pass
    
    # For teachers or if student lookup failed, try email authentication
    user = authenticate(email=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        # Return complete profile based on user role
        if user.role == 'teacher':
            try:
                teacher_profile = TeacherProfile.objects.get(user=user)
                teacher_data = TeacherProfileSerializer(teacher_profile).data
                teacher_data['user_id'] = user.id
                teacher_data['user_email'] = user.email
                teacher_data['user_role'] = user.role
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': teacher_data
                })
            except TeacherProfile.DoesNotExist:
                pass
        elif user.role == 'student':
            try:
                student_profile = StudentProfile.objects.get(user=user)
                student_data = StudentProfileSerializer(student_profile).data
                student_data['user_id'] = user.id
                student_data['user_email'] = user.email
                student_data['user_role'] = user.role
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': student_data
                })
            except StudentProfile.DoesNotExist:
                pass
        
        # Fallback to basic user data
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
    else:
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    user = request.user
    if user.role == 'student':
        profile = StudentProfile.objects.get(user=user)
        serializer = StudentProfileSerializer(profile)
        # Add user info to the response
        profile_data = serializer.data
        profile_data['user_id'] = user.id
        profile_data['user_email'] = user.email
        profile_data['user_role'] = user.role
        return Response(profile_data)
    elif user.role == 'teacher':
        profile = TeacherProfile.objects.get(user=user)
        serializer = TeacherProfileSerializer(profile)
        # Add user info to the response
        profile_data = serializer.data
        profile_data['user_id'] = user.id
        profile_data['user_email'] = user.email
        profile_data['user_role'] = user.role
        return Response(profile_data)
    else:
        serializer = UserSerializer(user)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def subjects_list(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)


# Dynamic QR Attendance API Views

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_attendance_session(request):
    """Create a new attendance session with dynamic QR code"""
    if request.user.role != 'teacher':
        return Response({'error': 'Only teachers can create attendance sessions'}, status=status.HTTP_403_FORBIDDEN)
    
    session_name = request.data.get('session_name')
    subject_id = request.data.get('subject_id')
    
    if not session_name or not subject_id:
        return Response({'error': 'Session name and subject ID are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subject = Subject.objects.get(id=subject_id)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create session
    session = AttendanceSession.objects.create(
        teacher=request.user,
        subject=subject,
        session_name=session_name
    )
    
    # Generate initial QR code
    qr_data = generate_qr_code(session.id)
    session.current_qr_code = qr_data['qr_string']
    session.qr_expires_at = timezone.now() + timedelta(seconds=10)
    session.save()
    
    serializer = AttendanceSessionSerializer(session)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_qr_code(request, session_id):
    """Get the current QR code for a session"""
    try:
        session = AttendanceSession.objects.get(id=session_id, teacher=request.user)
    except AttendanceSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not session.is_active:
        return Response({'error': 'Session is not active'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if QR code is expired
    if timezone.now() > session.qr_expires_at:
        # Generate new QR code
        qr_data = generate_qr_code(session.id)
        session.current_qr_code = qr_data['qr_string']
        session.qr_expires_at = timezone.now() + timedelta(seconds=10)
        session.save()
    
    # Generate QR code image
    qr_data = generate_qr_code(session.id)
    
    return Response({
        'qr_code': session.current_qr_code,
        'qr_image': qr_data['qr_image'],
        'expires_at': session.qr_expires_at,
        'session_id': session.id
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_attendance(request):
    """Mark attendance using QR code"""
    qr_code = request.data.get('qr_code')
    
    if not qr_code:
        return Response({'error': 'QR code is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse QR code to get session ID
        session_id = qr_code.split('|')[0]
        session = AttendanceSession.objects.get(id=session_id, is_active=True)
    except (ValueError, AttendanceSession.DoesNotExist):
        return Response({'error': 'Invalid or expired QR code'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if QR code is still valid
    if timezone.now() > session.qr_expires_at:
        return Response({'error': 'QR code has expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get student profile
    try:
        student_profile = StudentProfile.objects.get(user=request.user)
    except StudentProfile.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if already marked attendance
    existing_record = AttendanceRecord.objects.filter(session=session, student=student_profile).first()
    if existing_record:
        return Response({'error': 'Attendance already marked'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create attendance record
    attendance_record = AttendanceRecord.objects.create(
        session=session,
        student=student_profile,
        qr_code_used=qr_code
    )
    
    serializer = AttendanceRecordSerializer(attendance_record)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_session_attendance(request, session_id):
    """Get attendance records for a session"""
    try:
        session = AttendanceSession.objects.get(id=session_id, teacher=request.user)
    except AttendanceSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    
    attendance_records = session.attendance_records.filter(is_valid=True)
    serializer = AttendanceRecordSerializer(attendance_records, many=True)
    
    return Response({
        'session': AttendanceSessionSerializer(session).data,
        'attendance_records': serializer.data,
        'total_attended': attendance_records.count()
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def end_attendance_session(request, session_id):
    """End an attendance session"""
    try:
        session = AttendanceSession.objects.get(id=session_id, teacher=request.user)
    except AttendanceSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    
    session.is_active = False
    session.end_time = timezone.now()
    session.save()
    
    serializer = AttendanceSessionSerializer(session)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_teacher_sessions(request):
    """Get all sessions for a teacher"""
    sessions = AttendanceSession.objects.filter(teacher=request.user).order_by('-start_time')
    serializer = AttendanceSessionSerializer(sessions, many=True)
    return Response(serializer.data)


def generate_qr_code(session_id):
    """Generate QR code data for a session"""
    qr_string = f"{session_id}|{uuid.uuid4()}|{int(timezone.now().timestamp())}"
    
    # Generate QR code image
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_string)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        'qr_string': qr_string,
        'qr_image': f"data:image/png;base64,{img_str}"
    } 