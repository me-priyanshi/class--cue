from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile, Subject, AttendanceSession, AttendanceRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_code', 'name', 'semester']


class AttendanceSessionSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.teacherprofile.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    attendance_count = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceSession
        fields = ['id', 'session_name', 'teacher', 'teacher_name', 'subject', 'subject_name', 
                 'start_time', 'end_time', 'is_active', 'current_qr_code', 'qr_expires_at', 'attendance_count']
    
    def get_attendance_count(self, obj):
        return obj.attendance_records.filter(is_valid=True).count()


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_enrollment = serializers.CharField(source='student.enrollment_number', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'student', 'student_name', 'student_enrollment', 'qr_code_used', 'marked_at', 'is_valid']

class StudentProfileSerializer(serializers.ModelSerializer):
    # This is the key change. We tell 'email' it is for input only.
    email = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = StudentProfile
        # The fields list must contain all fields for input
        fields = ['email', 'password', 'full_name', 'enrollment_number', 'department', 'semester', 'interests', 'skills', 'goals']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.role = 'student'
        user.save()

        profile = StudentProfile.objects.create(
            user=user,
            full_name=validated_data['full_name'],
            enrollment_number=validated_data['enrollment_number'],
            department=validated_data['department'],
            semester=validated_data['semester']
        )
        return profile

class TeacherProfileSerializer(serializers.ModelSerializer):
    # Apply the same fix here
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = TeacherProfile
        fields = ['email', 'password', 'full_name', 'department']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.role = 'teacher'
        user.save()

        profile = TeacherProfile.objects.create(
            user=user,
            full_name=validated_data['full_name'],
            department=validated_data['department']
        )
        return profile

class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['full_name', 'interests', 'skills', 'goals']

class TeacherProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['full_name']