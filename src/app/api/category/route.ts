import { sql } from '@vercel/postgres';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';

export const GET = async (request: NextRequest) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	const data = await sql.query(
		`SELECT
			"id",
			"name"
		FROM transaction_category`,
	);
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
