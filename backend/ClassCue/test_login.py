#!/usr/bin/env python
"""
Test login functionality for ClassCue
"""

import os
import sys
import django
import requests
import json

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ClassCue.settings')

# Setup Django
django.setup()

from api.models import User, StudentProfile, TeacherProfile

def test_login():
    """Test login functionality"""
    
    print("Testing ClassCue Login Functionality")
    print("=" * 50)
    
    # Test student login
    print("\n1. Testing Student Login:")
    student_data = {
        'email': '240173107002',  # Enrollment number
        'password': 'password123',
        'role': 'student'
    }
    
    try:
        response = requests.post('http://127.0.0.1:8000/api/login/', json=student_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Student login successful!")
            print(f"   User: {data['user']['email']}")
            print(f"   Role: {data['user']['role']}")
        else:
            print(f"❌ Student login failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Student login error: {e}")
    
    # Test teacher login
    print("\n2. Testing Teacher Login:")
    teacher_data = {
        'email': 'teacher1@example.com',
        'password': 'password123',
        'role': 'teacher'
    }
    
    try:
        response = requests.post('http://127.0.0.1:8000/api/login/', json=teacher_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Teacher login successful!")
            print(f"   User: {data['user']['email']}")
            print(f"   Role: {data['user']['role']}")
        else:
            print(f"❌ Teacher login failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Teacher login error: {e}")
    
    # Test invalid credentials
    print("\n3. Testing Invalid Credentials:")
    invalid_data = {
        'email': 'invalid@example.com',
        'password': 'wrongpassword',
        'role': 'student'
    }
    
    try:
        response = requests.post('http://127.0.0.1:8000/api/login/', json=invalid_data)
        if response.status_code == 401:
            print("✅ Invalid credentials properly rejected")
        else:
            print(f"❌ Expected 401, got {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid credentials test error: {e}")
    
    print("\n" + "=" * 50)
    print("Login test completed!")

if __name__ == '__main__':
    test_login()
