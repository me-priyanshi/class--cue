import os, sys, django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ClassCue.settings')

# Setup Django
django.setup()

from api.models import User, StudentProfile, TeacherProfile
from django.contrib.auth import get_user_model

User = get_user_model()

# try:
#     profile = StudentProfile.objects.get(user__email="240173107002@vgecg.ac.in")
#     profile.user.enrollment_number = "240173107002"
#     profile.user.save()

#     user = User.objects.get(email="240173107002@vgecg.ac.in")
#     user.set_password("aryan123")
#     user.save()

#     print("UPdated done")
# except StudentProfile.DoesNotExist:
#     print("failed")

emailpass = { "bhanushalipriyanshi2006@gmail.com" : "aryan123", 
      "240173107003@vgecg.ac.in" : "priyanshi123",
      "student2@example.com" : "dipal123",
      "teacher1@example.com" : "jiya123",
      "teacher3@example.com" : "khushi123",
      "teacher2@example.com" : "vaibhav123"      
    }
newemail = {  "bhanushalipriyanshi2006@gmail.com" : "240173107002@vgecg.ac.in" ,
        "student2@example.com" : "240173107007@vgecg.ac.in" ,
        "teacher1@example.com" : "240173146015@vgecg.ac.in" ,
        "teacher2@example.com" : "240173107013@vgecg.ac.in" ,
        "teacher3@example.com" : "250173107021@vgecg.ac.in" ,
}
def update_enrollment(email, new_enrollment):
    try:
        user = User.objects.get(email=email)
        profile = StudentProfile.objects.get(user=user)
        profile.enrollment_number = new_enrollment
        profile.save()
        user.set_password(emailpass[email])
        user.email = newemail[email]
        user.save()
        print(f"✅ Updated enrollment to {new_enrollment} for {profile.full_name}")
    except (User.DoesNotExist, StudentProfile.DoesNotExist):
        print(f"❌ No user/profile found for email: {email}")

# def change_credentials():
#     students = StudentProfile.objects.all()
#     for student in students:
#         print(f"Enrollment: {student.enrollment_number}")
#         print(f"Name: {student.full_name}")
#         print(f"Name: {student.full_name}")
#         print(f"Email: {student.user.email}")
#         print("=" * 50)
# except Exception as e:
#     print(f"Error: {e}")
#     print("=" * 50)
#         print(f"Email: {student.user.email}")

update_enrollment("bhanushalipriyanshi2006@gmail.com", "240173107002")
# update_enrollment("240173107003@vgecg.ac.in", "240173107003")
update_enrollment("student2@example.com", "240173107007")
update_enrollment("teacher1@example.com", "240173146015")
update_enrollment("teacher3@example.com", "250173107021") 
update_enrollment("teacher2@example.com", "240173107013")
# if __name__ == '__main__':
#     change_credentials()
