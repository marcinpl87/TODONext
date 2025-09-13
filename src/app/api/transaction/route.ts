import { sql } from '@vercel/postgres';
import { Project } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';

export const POST = async (request: NextRequest) => {
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const data: { userId: string; transaction: Project } = await request.json();

	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{
				message:
					'Forbidden: Cannot create transactions for other users',
			},
			{ status: 403 },
		);
	}

	if (data && data.userId && data.transaction) {
		await sql.query(
			`INSERT INTO bank_transaction (
				"id",
				"userId",
				"description",
				"creationTimestamp"
			)
			VALUES ($1, $2, $3, to_timestamp($4));`,
			[
				data.transaction.id,
				data.userId,
				data.transaction.description,
				data.transaction.creationTimestamp
					? data.transaction.creationTimestamp / 1000
					: 0,
			],
		);
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async (request: NextRequest) => {
	// Check authentication
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}
	const data = await sql`
		SELECT
			*,
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM bank_transaction
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
