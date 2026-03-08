const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nesthub_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (error) {
    console.warn('API request failed, using local data:', error.message);
    throw error;
  }
}

export const api = {
  getHostels: (params) => request(`/hostels?${new URLSearchParams(params)}`),
  getHostel: (slug) => request(`/hostels/${slug}`),
  getAvailability: (slug) => request(`/hostels/${slug}/availability`),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/me'),
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: () => request('/bookings/my'),
  submitMaintenance: (data) => request('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  getMyMaintenance: () => request('/maintenance/my'),
};
