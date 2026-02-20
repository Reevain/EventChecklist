// API service for making requests to the backend
const API_BASE_URL = 'https://eventbackend-ho0f.onrender.com';

// Helper function to make API requests using Bearer token
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;

  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
}

// ================= AUTH API =================
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token after login
    if (data?.data?.token) {
      localStorage.setItem('token', data.data.token);
    }

    return data;
  },

  register: async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    // Store token after register
    if (data?.data?.token) {
      localStorage.setItem('token', data.data.token);
    }

    return data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    return { message: "Logged out" };
  },

  verify: async () => {
    return apiRequest('/auth/verify', {
      method: 'GET',
    });
  },
};

// ================= EVENTS API =================
export const eventsAPI = {

  createEvent: async (eventData) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  getEvents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const suffix = query ? `?${query}` : '';
    return apiRequest(`/events${suffix}`, {
      method: 'GET',
    });
  },

  getEventById: async (id) => {
    return apiRequest(`/events/${id}`, {
      method: 'GET',
    });
  },

  updateEvent: async (id, updates) => {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteEvent: async (id) => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  addTask: async (eventId, taskData) => {
    return apiRequest(`/events/${eventId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (eventId, taskId, updates) => {
    return apiRequest(`/events/${eventId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteTask: async (eventId, taskId) => {
    return apiRequest(`/events/${eventId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;