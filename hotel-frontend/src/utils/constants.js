export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  HOTELS: '/hotels/',
  HOTEL_BY_ID: (id) => `/hotels/${id}`,
  ROOM_TYPES: '/room-types/',
  ROOM_TYPE_BY_ID: (id) => `/room-types/${id}`,
  RATE_ADJUSTMENTS: '/rate-adjustments/',
  RATE_ADJUSTMENT_HISTORY: (roomTypeId) => `/rate-adjustments/room-type/${roomTypeId}/history`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
};

// Query Keys for React Query
export const QUERY_KEYS = {
  HOTELS: 'hotels',
  HOTEL: 'hotel',
  ROOM_TYPES: 'roomTypes',
  ROOM_TYPE: 'roomType',
  RATE_ADJUSTMENTS: 'rateAdjustments',
  RATE_HISTORY: 'rateHistory',
};