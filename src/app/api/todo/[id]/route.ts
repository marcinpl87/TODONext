import { sql } from '@vercel/postgres';
import { Todo } from '../../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	const data: { userId: string; todo: Todo } = await request.json();
	if (id && data && data.userId && data.todo) {
		await sql.query(
			`UPDATE todo SET
			"title" = $3,
			"description" = $4,
			"creationTimestamp" = to_timestamp($5),
			"estimatedTime" = $6,
			"isDone" = $7,
			"doneTimestamp" = to_timestamp($8)
			WHERE "id" = $1 AND "userId" = $2;`,
			[
				id,
				data.userId,
				data.todo.title,
				data.todo.description,
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
	const { id } = params;
	if (id) {
		const data = await sql`
			SELECT
				"id",
				"userId",
				"projectId",
				"title",
				"description",
				(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp",
				"estimatedTime",
				"isDone",
				(EXTRACT(EPOCH FROM "doneTimestamp") * 1000)::BIGINT AS "doneTimestamp"
			FROM todo
			WHERE "id" = ${id};
		`;
		return NextResponse.json({ data: data.rows[0] }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	if (id) {
		await sql`
			DELETE FROM todo
			WHERE "id" = ${id};
		`;
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
