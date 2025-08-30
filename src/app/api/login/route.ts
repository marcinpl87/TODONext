import { sql } from '@vercel/postgres';
import { type NextRequest, NextResponse } from 'next/server';
import { generateToken } from '../../../lib/auth';

export const POST = async (request: NextRequest) => {
	const data = await request.formData();
	const username = data.get('username') as string;
	const password = data.get('password') as string;

	if (!username || !password) {
		return NextResponse.json(
			{ message: 'Username and password are required' },
			{ status: 400 },
		);
	}

	try {
		const dbData = await sql`
			SELECT
				"id",
				"name",
				"pass"
			FROM public.user
			WHERE "name" = ${username};
		`;

		if (!dbData?.rows || dbData.rows.length === 0) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 },
			);
		}

		const user = dbData.rows[0];

		// TODO: Migrate to hashed passwords using verifyPassword
		// use hashPassword and verifyPassword from auth.ts
		const isValidPassword = user.pass === password;
		// const isValidPassword = await verifyPassword(password, user.pass);

		if (!isValidPassword) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 },
			);
		}

		// Log successful login
		await sql`
			INSERT INTO log (userId, action, datetime)
			VALUES (
				${user.id},
				'login',
				${new Date().toLocaleString('sv-SE').slice(0, -3)}
			);
		`;

		// Generate JWT token
		const token = generateToken(user.id, user.name);

		// Get all users for the frontend (without passwords)
		const allUsersData = await sql`
			SELECT "id", "name" FROM public.user;
		`;

		return NextResponse.json(
			{
				message: 'OK',
				token,
				userId: user.id,
				userName: user.name,
				users: allUsersData.rows,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 },
		);
	}
};
