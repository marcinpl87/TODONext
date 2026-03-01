import { sql } from '@vercel/postgres';
import { Goal } from '../../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	// Check authentication
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const { id } = params;
	const data: { userId: string; goal: Goal } = await request.json();

	// Ensure the authenticated user can only update their own goals
	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot update goals for other users' },
			{ status: 403 },
		);
	}
	if (id && data && data.userId && data.goal) {
		await sql.query(
			`UPDATE goal SET
			"title" = $3,
			"description" = $4,
			"creationTimestamp" = to_timestamp($5),
			"estimatedTime" = to_timestamp($6)
			WHERE "id" = $1 AND "userId" = $2;`,
			[
				id,
				data.userId,
				data.goal.title,
				data.goal.description,
				data.goal.creationTimestamp
					? data.goal.creationTimestamp / 1000
					: 0,
				data.goal.estimatedTime ? data.goal.estimatedTime / 1000 : 0,
			],
		);
		return NextResponse.json({ data: data.goal }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	// Check authentication
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const { id } = params;
	if (id) {
		await sql`
			DELETE FROM goal
			WHERE "id" = ${id} AND "userId" = ${authResult.user?.userId};
		`;
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
