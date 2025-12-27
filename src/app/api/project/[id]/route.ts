import { sql } from '@vercel/postgres';
import { Project } from '../../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	const data: { userId: string; project: Project } = await request.json();
	if (id && data && data.userId && data.project) {
		await sql.query(
			`UPDATE project SET
			"title" = $3,
			"description" = $4
			WHERE "id" = $1 AND "userId" = $2;`,
			[id, data.userId, data.project.title, data.project.description],
		);
		return NextResponse.json({ data: data.project }, { status: 200 });
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
				"title",
				"description",
				(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
			FROM project
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
			DELETE FROM project
			WHERE "id" = ${id};
		`; // remove project
		await sql`
			DELETE FROM todo
			WHERE "projectId" = ${id};
		`; // remove all todos inside the project
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
