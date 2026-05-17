import { sql } from '@vercel/postgres';
import { Goal } from '../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';

export const POST = async (request: NextRequest) => {
	// Check authentication
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const data: { userId: string; goal: Goal } = await request.json();

	// Ensure the authenticated user can only create goals for themselves
	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot create goals for other users' },
			{ status: 403 },
		);
	}

	if (data && data.userId && data.goal) {
		await sql.query(
			`INSERT INTO goal (
					"id",
					"userId",
					"title",
					"description",
					"creationTimestamp",
					"estimatedTime"
				)
				VALUES ($1, $2, $3, $4, to_timestamp($5), to_timestamp($6));`,
			[
				data.goal.id,
				data.userId,
				data.goal.title,
				data.goal.description,
				data.goal.creationTimestamp
					? data.goal.creationTimestamp / 1000
					: 0,
				data.goal.estimatedTime ? data.goal.estimatedTime / 1000 : 0,
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

	// Only return goals for the authenticated user
	const data = await sql`
		SELECT
			"id",
			"userId",
			"title",
			"description",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp",
			(EXTRACT(EPOCH FROM "estimatedTime") * 1000)::BIGINT AS "estimatedTime"
		FROM goal
		WHERE "userId" = ${authResult.user?.userId}
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json(
		{
			data: data.rows.map(row => ({
				...row,
				creationTimestamp: Number(row.creationTimestamp),
				estimatedTime: Number(row.estimatedTime),
			})),
		},
		{ status: 200 },
	);
};
