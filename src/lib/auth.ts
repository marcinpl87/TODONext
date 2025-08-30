import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.USER_AUTH_JWT_SECRET || '';

export interface JWTPayload {
	userId: string;
	userName: string;
	iat: number;
	exp: number;
}

// Hash password
export const hashPassword = async (password: string): Promise<string> =>
	await bcrypt.hash(password, 12);

// Verify password
export const verifyPassword = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => await bcrypt.compare(password, hashedPassword);

// Generate JWT token
export const generateToken = (userId: string, userName: string): string =>
	jwt.sign({ userId, userName }, JWT_SECRET, { expiresIn: '7d' });

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch (error) {
		return null;
	}
};

// Extract user from request
export const getUserFromRequest = (request: NextRequest): JWTPayload | null => {
	const authHeader = request.headers.get('authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}
	const token = authHeader.substring(7);
	return verifyToken(token);
};

// Middleware function to protect API routes
export const requireAuth = (
	request: NextRequest,
): { error?: string; user?: JWTPayload } => {
	const user = getUserFromRequest(request);
	if (!user) {
		return { error: 'Unauthorized: Invalid or missing token' };
	}
	return { user };
};
