from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile, Subject

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_code', 'name', 'semester']

class StudentProfileSerializer(serializers.ModelSerializer):
    # This is the key change. We tell 'email' it is for input only.
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = StudentProfile
        # The fields list must contain all fields for input
        fields = ['email', 'password', 'full_name', 'enrollment_number', 'department', 'semester']

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