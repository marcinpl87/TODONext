import { sql } from '@vercel/postgres';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';

export const GET = async (request: NextRequest) => {
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}
	const data = await sql`
		SELECT
			"id",
			"name"
		FROM transaction_category
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
