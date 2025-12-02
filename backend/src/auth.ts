import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-2024';

export interface AuthContext {
  userId?: number;
  role?: 'ADMIN' | 'EMPLOYEE';
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: number, role: 'ADMIN' | 'EMPLOYEE'): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: number; role: 'ADMIN' | 'EMPLOYEE' } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: 'ADMIN' | 'EMPLOYEE' };
    return decoded;
  } catch {
    return null;
  }
};

export const getAuthContext = (authHeader?: string): AuthContext => {
  if (!authHeader) return {};

  const token = authHeader.replace('Bearer ', '');
  const decoded = verifyToken(token);

  if (!decoded) return {};

  return {
    userId: decoded.userId,
    role: decoded.role,
  };
};

export const requireAuth = (context: AuthContext): void => {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
};

export const requireAdmin = (context: AuthContext): void => {
  requireAuth(context);
  if (context.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
};
