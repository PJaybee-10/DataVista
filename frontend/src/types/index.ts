// Frontend Types
export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: string;
  dueDate?: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  age: number;
  class: string;
  subjects: string[];
  department: string | null;
  position: string;
  avatar: string;
  phone: string | null;
  address: string | null;
  joinDate?: string;
  salary?: number;
  flagged: boolean;
  tasks: Task[];
  attendance: AttendanceRecord[];
}

export interface EmployeeConnection {
  edges: Employee[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface ViewStore {
  viewMode: 'grid' | 'tile';
  selectedEmployeeId: number | null;
  setViewMode: (mode: 'grid' | 'tile') => void;
  setSelectedEmployeeId: (id: number | null) => void;
}
