import { sql } from '@vercel/postgres';
import { Habit } from '../../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
	const data: { userId: string; habit: Habit } = await request.json();

	// Ensure the authenticated user can only update their own habits
	if (data.userId !== session.user.id) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot update habits for other users' },
			{ status: 403 },
		);
	}
	if (id && data && data.userId && data.habit) {
		await sql.query(
			`UPDATE habit SET
			"title" = $3,
			"creationTimestamp" = to_timestamp($4)
			WHERE "id" = $1 AND "userId" = $2;`,
			[
				id,
				session.user.id,
				data.habit.title,
				data.habit.creationTimestamp
					? data.habit.creationTimestamp / 1000
					: 0,
			],
		);
		return NextResponse.json({ data: data.habit }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
	if (id) {
		await sql.query(
			`DELETE FROM habit_date
			WHERE "habitId" = $1 AND "userId" = $2;`,
			[id, session.user.id],
		);
		await sql.query(
			`DELETE FROM habit
			WHERE "id" = $1 AND "userId" = $2;`,
			[id, session.user.id],
		);
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
