import { sql } from '@vercel/postgres';
import { Todo } from '../../../types';
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

	const data: { userId: string; todo: Todo } = await request.json();

	// Ensure the authenticated user can only create todos for themselves
	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot create todos for other users' },
			{ status: 403 },
		);
	}

	if (data && data.userId && data.todo) {
		await sql.query(
			`INSERT INTO todo (
					"id",
					"userId",
					"projectId",
					"title",
					"description",
					"subtasks",
					"creationTimestamp",
					"estimatedTime",
					"isDone",
					"doneTimestamp"
				)
				VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7), $8, $9, to_timestamp($10));`,
			[
				data.todo.id,
				data.userId,
				data.todo.projectId,
				data.todo.title,
				data.todo.description,
				data.todo.subtasks,
				data.todo.creationTimestamp
					? data.todo.creationTimestamp / 1000
					: 0,
				data.todo.estimatedTime,
				data.todo.isDone,
				data.todo.doneTimestamp ? data.todo.doneTimestamp / 1000 : 0,
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

	// Only return todos for the authenticated user
	const data = await sql`
		SELECT
			"id",
			"userId",
			"projectId",
			"title",
			"description",
			"subtasks",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp",
			"estimatedTime",
			"isDone",
			(EXTRACT(EPOCH FROM "doneTimestamp") * 1000)::BIGINT AS "doneTimestamp"
		FROM todo
		WHERE "userId" = ${authResult.user?.userId}
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
