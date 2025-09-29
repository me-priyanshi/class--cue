// const API_BASE_URL = 'http://127.0.0.1:8000/api';
// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'http://192.168.1.8:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication methods
  async login(identifier, password, role = 'student') {
    const response = await fetch(`${this.baseURL}/login/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ 
        email: identifier, 
        password, 
        role 
      }),
    });

    const data = await this.handleResponse(response);
    
    // Store tokens
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    return data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/token/refresh/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await this.handleResponse(response);
    localStorage.setItem('access_token', data.access);
    return data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Registration methods
  async registerStudent(studentData) {
    const response = await fetch(`${this.baseURL}/register/student/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(studentData),
    });

    return this.handleResponse(response);
  }

  async registerTeacher(teacherData) {
    const response = await fetch(`${this.baseURL}/register/teacher/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(teacherData),
    });

    return this.handleResponse(response);
  }

  // Profile methods
  async getUserProfile() {
    const response = await fetch(`${this.baseURL}/profile/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateUserProfile(profileData) {
    const response = await fetch(`${this.baseURL}/profile/update/`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse(response);
  }

  // Data methods
  async getSubjects() {
    const response = await fetch(`${this.baseURL}/subjects/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Dynamic QR Attendance API methods
  async createAttendanceSession(sessionData) {
    const response = await fetch(`${this.baseURL}/attendance/sessions/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(sessionData),
    });

    return this.handleResponse(response);
  }

  async getCurrentQRCode(sessionId) {
    const response = await fetch(`${this.baseURL}/attendance/sessions/${sessionId}/qr/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getSessionAttendance(sessionId) {
    const response = await fetch(`${this.baseURL}/attendance/sessions/${sessionId}/attendance/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async endAttendanceSession(sessionId) {
    const response = await fetch(`${this.baseURL}/attendance/sessions/${sessionId}/end/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getTeacherSessions() {
    const response = await fetch(`${this.baseURL}/attendance/sessions/`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async markAttendance(qrCode) {
    const response = await fetch(`${this.baseURL}/attendance/mark/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ qr_code: qrCode }),
    });

    return this.handleResponse(response);
  }

  // Generic method for making authenticated requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      // If unauthorized, try to refresh token and retry
      if (error.message.includes('401') || error.message.includes('403')) {
        try {
          await this.refreshToken();
          const retryResponse = await fetch(url, config);
          return await this.handleResponse(retryResponse);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          this.logout();
          window.location.href = '/login';
          throw refreshError;
        }
      }
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
