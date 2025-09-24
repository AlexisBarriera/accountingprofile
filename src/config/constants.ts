
// API Configuration
export const API_ENDPOINTS = {
  BOOKING: process.env.NODE_ENV === 'production' 
    ? '/api/booking'  // Vercel automatically routes this
    : 'http://localhost:3000/api/booking'
};

// Calendar Configuration
export const CALENDAR_CONFIG = {
  TIMEZONE: 'America/Puerto_Rico', // Puerto Rico timezone (GMT-4)
  APPOINTMENT_DURATION: 60, // minutes
};
