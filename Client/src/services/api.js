const API_BASE_URL = "https://eventbackend-h0of.onrender.com/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const authAPI = {
  login: async (email, password) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", res.data.token);
    return res;
  },

  register: async (name, email, password) => {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    localStorage.setItem("token", res.data.token);
    return res;
  },

  verify: () => apiRequest("/auth/verify"),

  logout: () => {
    localStorage.removeItem("token");
  },
};

export const eventsAPI = {
  getEvents: () => apiRequest("/events"),
  getEventById: (id) => apiRequest(`/events/${id}`),
  createEvent: (data) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEvent: (id, data) =>
    apiRequest(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteEvent: (id) =>
    apiRequest(`/events/${id}`, {
      method: "DELETE",
    }),
};

export default apiRequest;