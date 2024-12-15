import { sql } from '@vercel/postgres';
import { Todo } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { userId: string; todo: Todo } = await request.json();
	if (data && data.userId && data.todo) {
		await sql.query(
			`INSERT INTO todo (
					"id",
					"userId",
					"projectId",
					"title",
					"description",
					"creationTimestamp",
					"estimatedTime",
					"isDone",
					"doneTimestamp"
				) 
				VALUES ($1, $2, $3, $4, $5, to_timestamp($6), $7, $8, to_timestamp($9));`,
			[
				data.todo.id,
				data.userId,
				data.todo.projectId,
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
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async () => {
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
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
