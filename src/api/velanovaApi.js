const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const parseResponse = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const apiRequest = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {};
  if (body && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponse(res);
  if (!res.ok) {
    const message = data?.error || data?.message || 'Request failed.';
    throw new Error(message);
  }

  return data;
};

export const authApi = {
  login: (email, password) => apiRequest('/auth/login.php', { method: 'POST', body: { email, password } }),
  register: (fullName, email, password) =>
    apiRequest('/auth/register.php', { method: 'POST', body: { fullName, email, password } }),
  logout: (token) => apiRequest('/auth/logout.php', { method: 'POST', token }),
  updateProfile: (token, payload) => apiRequest('/users/update.php', { method: 'POST', token, body: payload }),
};

export const productApi = {
  list: () => apiRequest('/products/index.php'),
  create: (token, payload) => apiRequest('/products/create.php', { method: 'POST', token, body: payload }),
  update: (token, id, payload) =>
    apiRequest('/products/update.php', { method: 'POST', token, body: { ...payload, id } }),
  remove: (token, id) => apiRequest('/products/delete.php', { method: 'POST', token, body: { id } }),
  reset: (token) => apiRequest('/products/reset.php', { method: 'POST', token }),
};

export const orderApi = {
  list: (token) => apiRequest('/orders/index.php', { token }),
  create: (token, payload) => apiRequest('/orders/create.php', { method: 'POST', token, body: payload }),
  updateStatus: (token, id, status) =>
    apiRequest('/orders/update-status.php', { method: 'POST', token, body: { id, status } }),
  remove: (token, id) => apiRequest('/orders/delete.php', { method: 'POST', token, body: { id } }),
};

export const bannerApi = {
  list: () => apiRequest('/banners/index.php'),
  create: (token, payload) => apiRequest('/banners/create.php', { method: 'POST', token, body: payload }),
  update: (token, id, payload) => apiRequest('/banners/update.php', { method: 'POST', token, body: { ...payload, id } }),
  remove: (token, id) => apiRequest('/banners/delete.php', { method: 'POST', token, body: { id } }),
};

export const testimonialApi = {
  list: () => apiRequest('/testimonials/index.php'),
  create: (token, payload) => apiRequest('/testimonials/create.php', { method: 'POST', token, body: payload }),
  update: (token, id, payload) => apiRequest('/testimonials/update.php', { method: 'POST', token, body: { ...payload, id } }),
  remove: (token, id) => apiRequest('/testimonials/delete.php', { method: 'POST', token, body: { id } }),
};

export const faqApi = {
  list: () => apiRequest('/faqs/index.php'),
  create: (token, payload) => apiRequest('/faqs/create.php', { method: 'POST', token, body: payload }),
  update: (token, id, payload) => apiRequest('/faqs/update.php', { method: 'POST', token, body: { ...payload, id } }),
  remove: (token, id) => apiRequest('/faqs/delete.php', { method: 'POST', token, body: { id } }),
};

export const settingsApi = {
  get: () => apiRequest('/settings/get.php'),
  update: (token, payload) => apiRequest('/settings/update.php', { method: 'POST', token, body: payload }),
};
