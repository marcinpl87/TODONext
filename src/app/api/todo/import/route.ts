import { sql } from '@vercel/postgres';
import { Todo } from '../../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { todos: Todo[] } = await request.json();
	if (data && data.todos && data.todos.length > 0) {
		await sql`DELETE FROM todo;`; // clear the table to override data during import
		data.todos.map(async (todo: Todo) => {
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
					todo.id,
					todo.userId,
					todo.projectId,
					todo.title,
					todo.description,
					todo.creationTimestamp ? todo.creationTimestamp / 1000 : 0,
					todo.estimatedTime,
					todo.isDone,
					todo.doneTimestamp ? todo.doneTimestamp / 1000 : 0,
				],
			);
		});
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
