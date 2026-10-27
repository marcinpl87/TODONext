import { sql } from '@vercel/postgres';
import { Todo } from '../../../../types/project';
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
	const data: { userId: string; todo: Todo } = await request.json();

	// Ensure the authenticated user can only update their own todos
	if (data.userId !== session.user.id) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot update todos for other users' },
			{ status: 403 },
		);
	}
	if (id && data && data.userId && data.todo) {
		await sql.query(
			`UPDATE todo SET
			"title" = $3,
			"description" = $4,
			"subtasks" = $5,
			"creationTimestamp" = to_timestamp($6),
			"estimatedTime" = $7,
			"isDone" = $8,
			"doneTimestamp" = to_timestamp($9)
			WHERE "id" = $1 AND "userId" = $2;`,
			[
				id,
				session.user.id,
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
		return NextResponse.json({ data: data.todo }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const GET = async (
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
		const data = await sql.query(
			`SELECT
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
			WHERE "id" = $1 AND "userId" = $2;`,
			[id, session.user.id],
		);
		return NextResponse.json({ data: data.rows[0] }, { status: 200 });
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
			`DELETE FROM todo
			WHERE "id" = $1 AND "userId" = $2;`,
			[id, session.user.id],
		);
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
