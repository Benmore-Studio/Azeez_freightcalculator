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
  // Handle case where localStorage contains invalid values
  if (!user || user === 'undefined' || user === 'null') {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e);
    localStorage.removeItem('user');
    return null;
  }
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
    // Backend returns user directly in data.data (not wrapped in { user })
    const user = data.data;
    setUser(user);
    return user;
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

  /**
   * Delete user account
   */
  async deleteAccount() {
    const response = await apiRequest('/auth/account', { method: 'DELETE' });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete account');
    }

    // Clear local storage after successful deletion
    clearTokens();
    return true;
  },

  /**
   * Update user profile (name, phone, company, onboardingCompleted)
   */
  async updateProfile({ name, phone, companyName, onboardingCompleted }) {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone, companyName, onboardingCompleted }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Update stored user
    if (data.data?.user) {
      setUser(data.data.user);
    }

    return data.data;
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

  /**
   * Calculate enriched rate with auto-fetched distance, weather, and tolls
   * @param {Object} rateData - { origin, destination, vehicleType, ...options }
   * @returns {Object} - Enriched rate result with routeData, weatherData, tollData
   */
  async calculateEnrichedRate(rateData) {
    const response = await apiRequest('/quotes/calculate-enriched', {
      method: 'POST',
      body: JSON.stringify(rateData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to calculate enriched rate');
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

  /**
   * Export quote as PDF
   * @param {string} quoteId - Quote ID to export
   * @param {Object} options - { includeWeather, includeMarketIntel, includeTolls }
   */
  async exportPDF(quoteId, options = {}) {
    const { accessToken } = getTokens();

    const params = new URLSearchParams();
    if (options.includeWeather) params.append('includeWeather', 'true');
    if (options.includeMarketIntel) params.append('includeMarketIntel', 'true');
    if (options.includeTolls) params.append('includeTolls', 'true');

    const url = `${API_BASE_URL}/quotes/${quoteId}/pdf?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate PDF');
    }

    // Get the blob and trigger download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // Extract filename from Content-Disposition header or generate one
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `quote-${quoteId.slice(0, 8)}.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, filename };
  },
};

/**
 * Trips API - Saved routes/trips
 */
export const tripsApi = {
  async getTrips() {
    const response = await apiRequest('/trips');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get trips');
    return data.data;
  },

  async getFrequentTrips(limit = 5) {
    const response = await apiRequest(`/trips/frequent?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get frequent trips');
    return data.data;
  },

  async getTrip(id) {
    const response = await apiRequest(`/trips/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get trip');
    return data.data;
  },

  async createTrip(tripData) {
    const response = await apiRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to create trip');
    return data.data;
  },

  async updateTrip(id, tripData) {
    const response = await apiRequest(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update trip');
    return data.data;
  },

  async deleteTrip(id) {
    const response = await apiRequest(`/trips/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete trip');
    return data.data;
  },

  async toggleFavorite(id) {
    const response = await apiRequest(`/trips/${id}/favorite`, { method: 'PATCH' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to toggle favorite');
    return data.data;
  },

  async incrementUseCount(id) {
    const response = await apiRequest(`/trips/${id}/use`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to increment use count');
    return data.data;
  },
};

/**
 * Rewards API - Achievements and referrals
 */
export const rewardsApi = {
  async getRewards() {
    const response = await apiRequest('/rewards');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get rewards');
    return data.data;
  },

  async getRewardStats() {
    const response = await apiRequest('/rewards/stats');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get reward stats');
    return data.data;
  },

  async getReferralCode() {
    const response = await apiRequest('/rewards/referral-code');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get referral code');
    return data.data;
  },

  async getReferralStats() {
    const response = await apiRequest('/rewards/referrals');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get referral stats');
    return data.data;
  },

  async applyReferralCode(referralCode) {
    const response = await apiRequest('/rewards/apply-referral', {
      method: 'POST',
      body: JSON.stringify({ referralCode }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to apply referral code');
    return data.data;
  },

  async updateProgress(rewardType, increment = 1) {
    const response = await apiRequest('/rewards/progress', {
      method: 'POST',
      body: JSON.stringify({ rewardType, increment }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update progress');
    return data.data;
  },
};

/**
 * Bookings API - Load booking management
 */
export const bookingsApi = {
  /**
   * Create a new booking from a quote
   * @param {Object} bookingData - Booking details
   */
  async createBooking(bookingData) {
    const response = await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to create booking');
    return data.data;
  },

  /**
   * Get all bookings for the current user
   */
  async getBookings(page = 1, limit = 20, status) {
    let url = `/bookings?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await apiRequest(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get bookings');
    return data;
  },

  /**
   * Get a single booking by ID
   */
  async getBooking(id) {
    const response = await apiRequest(`/bookings/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get booking');
    return data.data;
  },

  /**
   * Get booking by quote ID
   */
  async getBookingByQuoteId(quoteId) {
    const response = await apiRequest(`/bookings/quote/${quoteId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get booking');
    return data.data;
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(id, status) {
    const response = await apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update booking status');
    return data.data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(id) {
    const response = await apiRequest(`/bookings/${id}/cancel`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to cancel booking');
    return data.data;
  },

  /**
   * Get booking statistics
   */
  async getBookingStats() {
    const response = await apiRequest('/bookings/stats');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get booking stats');
    return data.data;
  },

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings(limit = 5) {
    const response = await apiRequest(`/bookings/upcoming?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get upcoming bookings');
    return data.data;
  },
};

/**
 * FMCSA API - Carrier/Broker Verification
 * Uses free FMCSA SAFER data for authority, insurance, and safety verification
 */
export const fmcsaApi = {
  /**
   * Smart search - automatically detects DOT, MC, or name
   * @param {string} query - DOT number, MC number, or company name
   * @returns {Object} - Verification result with carrier info, authorities, insurance, safety data
   */
  async verify(query) {
    const response = await fetch(`${API_BASE_URL}/fmcsa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to verify carrier');
    return data.data;
  },

  /**
   * Lookup by DOT number
   * @param {string} dotNumber - DOT number to lookup
   */
  async lookupByDOT(dotNumber) {
    const response = await fetch(`${API_BASE_URL}/fmcsa/dot/${dotNumber}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to lookup DOT');
    return data.data;
  },

  /**
   * Lookup by MC number
   * @param {string} mcNumber - MC number to lookup
   */
  async lookupByMC(mcNumber) {
    const response = await fetch(`${API_BASE_URL}/fmcsa/mc/${mcNumber}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to lookup MC');
    return data.data;
  },
};

/**
 * VIN API - Vehicle Identification Number Decode
 * Uses free NHTSA vPIC API
 */
export const vinApi = {
  /**
   * Decode a VIN to get vehicle information
   * @param {string} vin - 17-character VIN
   * @returns {Object} - Vehicle info (year, make, model, vehicleType, gvwr, etc.)
   */
  async decode(vin) {
    const response = await fetch(`${API_BASE_URL}/vin/decode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vin }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to decode VIN');
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
