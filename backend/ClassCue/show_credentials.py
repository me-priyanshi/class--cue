#!/usr/bin/env python
"""
Display actual login credentials for ClassCue users
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ClassCue.settings')

# Setup Django
django.setup()

from api.models import User, StudentProfile, TeacherProfile

def show_credentials():
    """Show actual login credentials for all users"""
    
    print("🔐 ACTUAL LOGIN CREDENTIALS FOR CLASSCUE")
    print("=" * 60)
    
    print("\n👨‍🎓 STUDENT CREDENTIALS:")
    print("-" * 30)
    
    students = StudentProfile.objects.all()
    for student in students:
        print(f"Enrollment: {student.enrollment_number}")
        print(f"Name: {student.full_name}")
        print(f"Email: {student.user.email}")
        print(f"Department: {student.department}")
        print(f"Semester: {student.semester}")
        print("-" * 30)
    
    print("\n👨‍🏫 TEACHER CREDENTIALS:")
    print("-" * 30)
    
    teachers = TeacherProfile.objects.all()
    for teacher in teachers:
        print(f"Email: {teacher.user.email}")
        print(f"Name: {teacher.full_name}")
        print(f"Department: {teacher.department}")
        print("-" * 30)
    
    print("\n📝 QUICK REFERENCE:")
    print("-" * 30)
    print("STUDENTS (Login with Enrollment Number):")
    for student in students:
        print(f"  • {student.enrollment_number} → {student.full_name}")
    
    print("\nTEACHERS (Login with Email):")
    for teacher in teachers:
        print(f"  • {teacher.user.email} → {teacher.full_name}")
    
    print("\n" + "=" * 60)
    print("💡 NOTE: Passwords are set in create_sample_users.py")
    print("   Check the file for actual password values")
    print("=" * 60)

if __name__ == '__main__':
    show_credentials()
