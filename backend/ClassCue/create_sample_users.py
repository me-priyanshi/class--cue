#!/usr/bin/env python
"""
Create sample users for testing ClassCue application
Run this script to create test students and teachers
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

from api.models import User, StudentProfile, TeacherProfile, Subject

def create_sample_users():
    """Create sample users for testing"""
    
    print("Creating sample users for ClassCue...")
    
    # Create sample subjects
    subjects_data = [
        {'subject_code': 'CS101', 'name': 'Programming Fundamentals', 'semester': 1},
        {'subject_code': 'CS102', 'name': 'Data Structures', 'semester': 2},
        {'subject_code': 'CS201', 'name': 'Database Management', 'semester': 3},
        {'subject_code': 'CS202', 'name': 'Web Development', 'semester': 4},
        {'subject_code': 'CS301', 'name': 'Software Engineering', 'semester': 5},
        {'subject_code': 'CS302', 'name': 'Computer Networks', 'semester': 6},
    ]
    
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            subject_code=subject_data['subject_code'],
            defaults=subject_data
        )
        if created:
            print(f"✅ Created subject: {subject.name}")
    
    # Sample Students
    students_data = [
        {
            'email': '240173107002@vgec.ac.in',
            'password': 'aryan123',
            'full_name': 'Aryan Chalaliya',
            'enrollment_number': '240173107002',
            'department': 'Computer Engineering',
            'semester': 5
        },
        {
            'email': '240173107003@vgec.ac.in',
            'password': 'priyanshi123',
            'full_name': 'Priyanshi Bhanushali',
            'enrollment_number': '240173107003',
            'department': 'Computer Engineering',
            'semester': 5
        },
        {
            'email': '240173107007@vgec.ac.in',
            'password': 'dipal123',
            'full_name': 'Dipal Chudasama',
            'enrollment_number': '240173107007',
            'department': 'Computer Engineering',
            'semester': 5
        },
        {
            'email': '240173146015@vgec.ac.in',
            'password': 'jiya123',
            'full_name': 'Jiya Shah',
            'enrollment_number': '240173146015',
            'department': 'Computer Science Engineering',
            'semester': 5
        },
        {
            'email': '240173107013@vgec.ac.in',
            'password': 'vaibhav123',
            'full_name': 'Vaibhav Dodiya',
            'enrollment_number': '240173107013',
            'department': 'Computer Engineering',
            'semester': 5
        },
        {
            'email': '250173107021@vgec.ac.in',
            'password': 'khushi123',
            'full_name': 'Khushi Rana',
            'enrollment_number': '250173107021',
            'department': 'Computer Engineering',
            'semester': 3
        }
    ]
    
    for student_data in students_data:
        # Create user
        user, created = User.objects.get_or_create(
            email=student_data['email'],
            defaults={
                'role': 'student',
                'is_active': True
            }
        )
        
        user.set_password(student_data['password'])
        user.save()

        if created:
            # Create student profile
            StudentProfile.objects.get_or_create(
                enrollment_number=student_data['enrollment_number'],
                defaults={
                    'user': user,
                    'full_name': student_data['full_name'],
                    # 'enrollment_number': student_data['enrollment_number'],
                    'department': student_data['department'],
                    'semester': student_data['semester']
                }
            )
            print(f"✅ Created student: {student_data['full_name']} ({student_data['email']})")
        else:
            print(f"⚠️  Student already exists: {student_data['email']}")
    
    # Sample Teachers
    teachers_data = [
        {
            'email': 'teacher1@example.com',
            'password': 'password123',
            'full_name': 'Prof. Jaimin Shroff',
            'department': 'Computer Engineering'
        },
        {
            'email': 'teacher2@example.com',
            'password': 'password123',
            'full_name': 'Prof. Jigna Jadav',
            'department': 'Information Technology'
        },
        {
            'email': 'teacher3@example.com',
            'password': 'password123',
            'full_name': 'Prof. Bhavin Patel',
            'department': 'Computer Science'
        }
    ]
    
    for teacher in teachers_data:        
        user, created = User.objects.get_or_create(
            email=teacher['email'],
            defaults={
                'role': 'teacher',
                'is_active': True
            }
        )

        user.set_password(teacher['password'])
        user.save()

        if created:
            TeacherProfile.objects.create(
                user=user,
                full_name=teacher['full_name'],
                department=teacher['department']
            )
            print(f"✅ Created teacher: {teacher['full_name']} ({teacher['email']})")
        else:
            # Ensure profile exists even if user was pre-created
            profile, profile_created = TeacherProfile.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': teacher['full_name'],
                    'department': teacher['department']
                }
            )
            if profile_created:
                print(f"✅ Created missing profile for: {teacher['email']}")
            else:
                print(f"⚠️ Teacher already exists: {teacher['email']}")

        # Create user
        # user, created = User.objects.get_or_create(
        #     email=teacher_data['email'],
        #     defaults={
        #         'role': 'teacher',
        #         'is_active': True
        #     }
        # )
        
        # if created:
        #     user.set_password(teacher_data['password'])
        #     user.save()
            
        #     # Create teacher profile
        #     TeacherProfile.objects.get_or_create(
        #         user=user,
        #         defaults={
        #             'full_name': teacher_data['full_name'],
        #             'department': teacher_data['department']
        #         }
        #     )
        #     print(f"✅ Created teacher: {teacher_data['full_name']} ({teacher_data['email']})")
        # else:
        #     print(f"⚠️  Teacher already exists: {teacher_data['email']}")
    
    print("\n" + "="*60)
    print("🎉 SAMPLE USERS CREATED SUCCESSFULLY!")
    print("="*60)
    # print("\n📧 TEST CREDENTIALS:")
    # print("\n👨‍🎓 STUDENTS:")
    # print("Email: student1@example.com | Password: password123")
    # print("Email: student2@example.com | Password: password123")
    # print("Email: student3@example.com | Password: password123")
    # print("\n👨‍🏫 TEACHERS:")
    # print("Email: teacher1@example.com | Password: password123")
    # print("Email: teacher2@example.com | Password: password123")
    # print("Email: teacher3@example.com | Password: password123")
    print("\n🔗 TEST YOUR APP:")
    print("Frontend: http://localhost:3000")
    print("Backend API: http://127.0.0.1:8000")
    print("Admin Panel: http://127.0.0.1:8000/admin")
    print("="*60)

if __name__ == '__main__':
    create_sample_users()
