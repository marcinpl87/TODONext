import { sql } from '@vercel/postgres';
import { Project } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { userId: string, projects: Project[] } = await request.json();
	if (data && data.userId && data.projects && data.projects.length > 0) {
		data.projects.map(async (project: Project) => {
			await sql`
				DELETE FROM project;
			`; // clear the table to override data during import
			await sql`
				INSERT INTO project ("id", "userId", "title", "description")
				VALUES (
					${project.id},
					${data.userId},
					${project.title},
					${project.description}
				);
			`;
		});
	}

	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async (request: NextRequest) => {
	// const { searchParams } = new URL(request.url);
	// const key = searchParams.get('key');
	// TODO: Implement searchParams and if ID is in searchParams, return only that project
	const data = await sql`
		SELECT
			"id",
			"userId",
			"title",
			"description",
			to_char(
				"creationTimestamp" at time zone '+01',
				'YYYY-MM-DD HH24:MI:SS'
			) AS creationTimestamp
		FROM project;
	`;

	return NextResponse.json(
		{ url: request.url, data: data.rows },
		{ status: 200 },
	);
};
