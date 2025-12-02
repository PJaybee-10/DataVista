import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { AuthContext, JWTPayload } from './types.js';

// Environment validation
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set in environment variables. Using default (insecure).');
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-2024';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: number, role: 'ADMIN' | 'EMPLOYEE'): string => {
  const payload: JWTPayload = { userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Token verification failed:', error);
    }
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
