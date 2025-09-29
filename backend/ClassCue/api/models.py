# api/models.py

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()


class Subject(models.Model):
    subject_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    semester = models.IntegerField()
    def __str__(self):
        return self.name


class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) #, primary_key=True)
    full_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    subjects = models.ManyToManyField(Subject, blank=True)
   
    def __str__(self):
        return self.full_name


class StudentProfile(models.Model):
    enrollment_number = models.CharField(max_length=20, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE) #, primary_key=True)
    full_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100) 
    semester = models.IntegerField()
    interests = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    goals = models.JSONField(default=list, blank=True)
    def __str__(self):
        return self.full_name


class AttendanceSession(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_sessions')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    session_name = models.CharField(max_length=200)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    current_qr_code = models.CharField(max_length=500, null=True, blank=True)
    qr_expires_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.session_name} - {self.subject.name}"


class AttendanceRecord(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='attendance_records')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, to_field='enrollment_number')
    qr_code_used = models.CharField(max_length=500)
    marked_at = models.DateTimeField(auto_now_add=True)
    is_valid = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['session', 'student']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.session.session_name}"

   