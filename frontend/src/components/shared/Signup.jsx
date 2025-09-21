import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { User, GraduationCap, Eye, EyeOff } from 'lucide-react';
import ClassCueLogo from '../../images/ClassCueLogo.png';

const Signup = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    enrollment: '', // For students
    email: '',      // For faculty
    password: '',
    confirmPassword: '',
    role: 'student',
    interests: '',
    skills: '',
    goals: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validatePassword = (password) => {
    // At least one letter, one number, one symbol
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,15}$/.test(password);
  };

  const validateEnrollment = (enrollment) => {
    // 12 digits only
    return /^[0-9]{12}$/.test(enrollment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.role === 'student') {
      if (!validateEnrollment(formData.enrollment)) {
        setError('Enrollment number must be 6-10 alphanumeric characters.');
        return;
      }
    } else {
      if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        setError('Please enter a valid email address.');
        return;
      }
    }
    if (!validatePassword(formData.password)) {
      setError('Password must contain at least one letter, one number, one symbol, and be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await auth.signup({
        ...formData,
        identifier: formData.role === 'student' ? formData.enrollment : formData.email
      });
      // Reset form
      setFormData({
        enrollment: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
      });
    } catch (error) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <img src={ClassCueLogo} alt='ClassCue'/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign Up
            </h1>
            <p className="text-gray-600">
              Create your ClassCue account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'student'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('faculty')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.role === 'faculty'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Faculty</span>
                </button>
              </div>
            </div>
            {formData.role === 'student' ? (
              <div>
                <label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  id="enrollment"
                  name="enrollment"
                  value={formData.enrollment}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your enrollment number"
                  required
                  pattern="^[0-9]{12}$"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  maxLength={15}
                  title="Password must contain at least one letter, one number, one symbol, and be between 6-15 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  maxLength={15}
                  title="Password must contain at least one letter, one number, one symbol, and be between 6-15 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {formData.role === 'student' ? (
              <>
                <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select className="input-field pr-10" id="semester" name="semester">
                  <option value="" disabled selected>Select your semester</option>
                  <option value="first">1</option>
                  <option value="second">2</option>
                  <option value="third">3</option>
                  <option value="fourth">4</option>
                  <option value="fifth">5</option>
                  <option value="sixth">6</option>
                  <option value="seventh">7</option>
                  <option value="eighth">8</option>
                </select>
                </div>
                <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <select className="input-field pr-10" id="branch" name="branch" required>
                  <option value="" disabled selected>Select your branch</option>
                  <option value="ce">Computer Engineering</option>
                  <option value="cse">Computer Science & Engineering (Data Science)</option>
                  <option value="ec">Electronics & Communication Engineering</option>
                  <option value="ee">Electrical & Electronics Engineering</option>
                  <option value="mech">Mechanical Engineering</option>
                  <option value="civil">Civil Engineering</option>
                  <option value="it">Information Technology</option>
                </select>
                </div>
                <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="input-field pr-10"
                    placeholder="Enter your interest areas"
                  />
                </div>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="input-field pr-10"
                      placeholder="Enter your skills areas"
                    />
                </div>
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                    Goals
                  </label>
                  <textarea
                      id="goals"
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      className="input-field pr-10"
                      placeholder="Enter your goals"
                    />
                </div>
              </>
            ): null}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
