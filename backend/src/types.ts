// Backend Types
export interface AuthContext {
  userId?: number;
  role?: 'ADMIN' | 'EMPLOYEE';
  prisma?: any;
}

export interface JWTPayload {
  userId: number;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface EmployeeFilterInput {
  name?: string;
  department?: string;
  position?: string;
  class?: string;
  flagged?: boolean;
}

export interface EmployeeSortInput {
  field: string;
  order: 'asc' | 'desc';
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}
