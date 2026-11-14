import { sql } from '@vercel/postgres';
import { HabitDate } from '../../../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const POST = async (
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
	const data: { userId: string; habitDate: HabitDate } = await request.json();

	// Ensure the authenticated user can only record their own habit dates
	if (data.userId !== session.user.id || data.habitDate?.habitId !== id) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot record dates for other users' },
			{ status: 403 },
		);
	}

	if (
		!id ||
		!data?.habitDate?.id ||
		!DATE_PATTERN.test(data.habitDate.date)
	) {
		return NextResponse.json({ message: 'No ID error' }, { status: 403 });
	}

	const habit = await sql.query(
		`SELECT "id" FROM habit WHERE "id" = $1 AND "userId" = $2;`,
		[id, session.user.id],
	);
	if (!habit.rows.length) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot record dates for other users' },
			{ status: 403 },
		);
	}

	await sql.query(
		`INSERT INTO habit_date (
				"id",
				"userId",
				"habitId",
				"date"
			)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT ("userId", "habitId", "date") DO NOTHING;`,
		[data.habitDate.id, session.user.id, id, data.habitDate.date],
	);
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
