import { sql } from '@vercel/postgres';
import { Project } from '../../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { projects: Project[] } = await request.json();
	if (data && data.projects && data.projects.length > 0) {
		data.projects.map(async (project: Project) => {
			await sql`
				DELETE FROM project;
			`; // clear the table to override data during import
			await sql`
				INSERT INTO project ("id", "userId", "title", "description")
				VALUES (
					${project.id},
					${project.userId},
					${project.title},
					${project.description}
				);
			`;
		});
	}

	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
