import { sql } from '@vercel/postgres';
import { Habit } from '../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';

export const POST = async (request: NextRequest) => {
	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const data: { userId: string; habit: Habit } = await request.json();

	// Ensure the authenticated user can only create habits for themselves
	if (data.userId !== session.user.id) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot create habits for other users' },
			{ status: 403 },
		);
	}

	if (data && data.userId && data.habit) {
		await sql.query(
			`INSERT INTO habit (
					"id",
					"userId",
					"title",
					"creationTimestamp"
				)
				VALUES ($1, $2, $3, to_timestamp($4));`,
			[
				data.habit.id,
				session.user.id,
				data.habit.title,
				data.habit.creationTimestamp
					? data.habit.creationTimestamp / 1000
					: 0,
			],
		);
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async (request: NextRequest) => {
	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Only return habits for the authenticated user
	const data = await sql.query(
		`SELECT
			"id",
			"userId",
			"title",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM habit
		WHERE "userId" = $1
		ORDER BY "creationTimestamp" DESC;`,
		[session.user.id],
	);
	return NextResponse.json(
		{
			data: data.rows.map(row => ({
				...row,
				creationTimestamp: Number(row.creationTimestamp),
			})),
		},
		{ status: 200 },
	);
};
