/**
 * API Client for Freight Calculator Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get stored auth tokens
 */
function getTokens() {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
}

/**
 * Store auth tokens
 */
function setTokens(accessToken, refreshToken) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

/**
 * Clear auth tokens
 */
function clearTokens() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

/**
 * Store user data
 */
function setUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Get stored user data
 */
function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Make API request with automatic token handling
 */
async function apiRequest(endpoint, options = {}) {
  const { accessToken } = getTokens();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && accessToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      const { accessToken: newToken } = getTokens();
      headers['Authorization'] = `Bearer ${newToken}`;
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      // Refresh failed, clear tokens
      clearTokens();
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken() {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.data.accessToken, data.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Auth API
 */
export const authApi = {
  /**
   * Register a new user
   */
  async register({ email, password, name, phone, companyName, userType }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name,
        phone,
        companyName,
        userType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Registration failed');
    }

    // Store tokens and user
    setTokens(data.data.accessToken, data.data.refreshToken);
    setUser(data.data.user);

    return data.data;
  },

  /**
   * Login user
   */
  async login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Login failed');
    }

    // Store tokens and user
    setTokens(data.data.accessToken, data.data.refreshToken);
    setUser(data.data.user);

    return data.data;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await apiRequest('/auth/me');

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    const data = await response.json();
    setUser(data.data.user);
    return data.data.user;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors on logout
    }
    clearTokens();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const { accessToken } = getTokens();
    return !!accessToken;
  },

  /**
   * Get stored user (without API call)
   */
  getStoredUser() {
    return getUser();
  },
};

/**
 * Settings API
 */
export const settingsApi = {
  async getSettings() {
    const response = await apiRequest('/settings');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get settings');
    return data.data;
  },

  async updateSettings(settings) {
    const response = await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update settings');
    return data.data;
  },

  async resetDefaults() {
    const response = await apiRequest('/settings/reset-defaults', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reset settings');
    return data.data;
  },

  async getDefaults(vehicleType) {
    const url = vehicleType ? `/settings/defaults?vehicleType=${vehicleType}` : '/settings/defaults';
    const response = await apiRequest(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get defaults');
    return data.data;
  },
};

/**
 * Vehicles API
 */
export const vehiclesApi = {
  async getVehicles(includeInactive = false) {
    const url = includeInactive ? '/vehicles?includeInactive=true' : '/vehicles';
    const response = await apiRequest(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get vehicles');
    return data.data;
  },

  async getVehicle(id) {
    const response = await apiRequest(`/vehicles/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get vehicle');
    return data.data;
  },

  async createVehicle(vehicleData) {
    const response = await apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to create vehicle');
    return data.data;
  },

  async updateVehicle(id, vehicleData) {
    const response = await apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update vehicle');
    return data.data;
  },

  async deleteVehicle(id) {
    const response = await apiRequest(`/vehicles/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete vehicle');
    return data.data;
  },

  async setVehicleAsPrimary(id) {
    const response = await apiRequest(`/vehicles/${id}/primary`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to set vehicle as primary');
    return data.data;
  },

  async getVehicleDefaults(vehicleType) {
    const url = vehicleType ? `/vehicles/defaults?vehicleType=${vehicleType}` : '/vehicles/defaults';
    const response = await apiRequest(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get vehicle defaults');
    return data.data;
  },
};

/**
 * Quotes API
 */
export const quotesApi = {
  async calculateRate(rateData) {
    const response = await apiRequest('/quotes/calculate', {
      method: 'POST',
      body: JSON.stringify(rateData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to calculate rate');
    return data.data;
  },

  async createQuote(quoteData) {
    const response = await apiRequest('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to create quote');
    return data.data;
  },

  async getQuotes(page = 1, limit = 20, status) {
    let url = `/quotes?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await apiRequest(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get quotes');
    return data;
  },

  async getQuote(id) {
    const response = await apiRequest(`/quotes/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get quote');
    return data.data;
  },

  async updateQuoteStatus(id, status) {
    const response = await apiRequest(`/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update quote status');
    return data.data;
  },

  async deleteQuote(id) {
    const response = await apiRequest(`/quotes/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete quote');
    return data.data;
  },

  async getRecentQuotes(limit = 5) {
    const response = await apiRequest(`/quotes/recent?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get recent quotes');
    return data.data;
  },

  async getQuoteStats() {
    const response = await apiRequest('/quotes/stats');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get quote stats');
    return data.data;
  },
};

/**
 * Generic API helper for other endpoints
 */
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export { getTokens, clearTokens, getUser, setUser };
