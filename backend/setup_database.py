#!/usr/bin/env python
"""
Database setup script for ClassCue
Run this script to create the database and run migrations
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_database():
    """Setup the database and run migrations"""
    
    # Add the project directory to Python path
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ClassCue.settings')
    
    # Setup Django
    django.setup()
    
    print("Setting up ClassCue database...")
    
    try:
        # Make migrations
        print("Creating migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        
        # Run migrations
        print("Running migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        # Create some sample data
        print("Creating sample data...")
        create_sample_data()
        
        print("Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Start the Django server: python manage.py runserver")
        print("2. Start the React frontend: cd ../frontend && npm run dev")
        print("3. Open http://localhost:5173 in your browser")
        
    except Exception as e:
        print(f"Error setting up database: {e}")
        print("Please check your PostgreSQL connection and try again.")
        return False
    
    return True

def create_sample_data():
    """Create sample data for testing"""
    from api.models import User, Subject, StudentProfile, TeacherProfile
    
    # Create sample subjects
    subjects_data = [
        {'subject_code': 'CS101', 'name': 'Programming Fundamentals', 'semester': 1},
        {'subject_code': 'CS102', 'name': 'Data Structures', 'semester': 2},
        {'subject_code': 'CS201', 'name': 'Database Management', 'semester': 3},
        {'subject_code': 'CS202', 'name': 'Web Development', 'semester': 4},
    ]
    
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            subject_code=subject_data['subject_code'],
            defaults=subject_data
        )
        if created:
            print(f"Created subject: {subject.name}")
    
    # Create a sample student
    student_user, created = User.objects.get_or_create(
        email='student@example.com',
        defaults={
            'role': 'student',
            'is_active': True
        }
    )
    
    if created:
        student_user.set_password('password123')
        student_user.save()
        
        StudentProfile.objects.get_or_create(
            user=student_user,
            defaults={
                'full_name': 'Sample Student',
                'enrollment_number': '123456789012',
                'department': 'Computer Engineering',
                'semester': 1
            }
        )
        print("Created sample student: student@example.com / password123")
    
    # Create a sample teacher
    teacher_user, created = User.objects.get_or_create(
        email='teacher@example.com',
        defaults={
            'role': 'teacher',
            'is_active': True
        }
    )
    
    if created:
        teacher_user.set_password('password123')
        teacher_user.save()
        
        TeacherProfile.objects.get_or_create(
            user=teacher_user,
            defaults={
                'full_name': 'Sample Teacher',
                'department': 'Computer Engineering'
            }
        )
        print("Created sample teacher: teacher@example.com / password123")

if __name__ == '__main__':
    setup_database()
