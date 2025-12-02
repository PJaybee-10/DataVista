// API Configuration
export const API_URL =
  import.meta.env.VITE_API_URL || 'https://datavista-backend-zmdy.onrender.com/graphql';

// App Configuration
export const APP_NAME = 'DataVista';
export const APP_DESCRIPTION = 'Employee Management System';

// Pagination
export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_OFFSET = 0;

// Auth
export const TOKEN_KEY = 'auth-storage';
export const TOKEN_EXPIRY_DAYS = 7;

// Demo Credentials
export const DEMO_CREDENTIALS = {
  ADMIN: {
    EMAIL: 'admin@datavista.com',
    PASSWORD: 'admin123',
  },
  EMPLOYEE: {
    EMAIL: 'employee@datavista.com',
    PASSWORD: 'employee123',
  },
} as const;

// UI Constants - Attendance Status Colors
export const ATTENDANCE_STATUS_COLORS = {
  PRESENT: 'bg-green-500',
  LATE: 'bg-yellow-500',
  ABSENT: 'bg-red-500',
  LEAVE: 'bg-blue-500',
} as const;

// UI Constants - Priority Colors
export const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
} as const;
