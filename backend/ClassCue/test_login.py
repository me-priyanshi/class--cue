#!/usr/bin/env python
"""
Test login credentials for ClassCue users
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
from django.contrib.auth import authenticate

def test_login_credentials():
    """Test login credentials for sample users"""
    
    print("Testing login credentials...")
    print("=" * 50)
    
    # Test student login by enrollment number
    test_cases = [
        {
            'enrollment': '240173107002',
            'password': 'aryan123',
            'expected_name': 'Aryan Chalaliya'
        },
        {
            'enrollment': '240173107003', 
            'password': 'priyanshi123',
            'expected_name': 'Priyanshi Bhanushali'
        }
    ]
    
    for test_case in test_cases:
        print(f"\nTesting enrollment: {test_case['enrollment']}")
        print(f"Password: {test_case['password']}")
        
        try:
            # Find student by enrollment number
            student_profile = StudentProfile.objects.get(enrollment_number=test_case['enrollment'])
            user = student_profile.user
            
            print(f"Found user: {user.email}")
            print(f"User role: {user.role}")
            print(f"Student name: {student_profile.full_name}")
            
            # Test password
            if user.check_password(test_case['password']):
                print("✅ Password is CORRECT")
            else:
                print("❌ Password is INCORRECT")
                
                # Let's see what passwords might work
                print("Testing common passwords...")
                common_passwords = ['password123', 'priyanshi123', 'aryan123', '123456', 'password']
                for pwd in common_passwords:
                    if user.check_password(pwd):
                        print(f"✅ Correct password found: {pwd}")
                        break
                else:
                    print("❌ No common password found")
                    
        except StudentProfile.DoesNotExist:
            print(f"❌ Student with enrollment {test_case['enrollment']} not found")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("Testing teacher login...")
    
    # Test teacher login
    teacher_test_cases = [
        {
            'email': 'teacher1@example.com',
            'password': 'password123'
        }
    ]
    
    for test_case in teacher_test_cases:
        print(f"\nTesting teacher email: {test_case['email']}")
        print(f"Password: {test_case['password']}")
        
        user = authenticate(email=test_case['email'], password=test_case['password'])
        if user:
            print("✅ Teacher login successful")
            print(f"User role: {user.role}")
        else:
            print("❌ Teacher login failed")

if __name__ == '__main__':
    test_login_credentials()