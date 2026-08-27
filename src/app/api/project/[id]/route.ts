import { sql } from '@vercel/postgres';
import { Project } from '../../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
	const data: { userId: string; project: Project } = await request.json();
	if (id && data?.project) {
		await sql.query(
			`UPDATE project SET
			"title" = $3,
			"description" = $4
			WHERE "id" = $1 AND "userId" = $2;`,
			[id, session.user.id, data.project.title, data.project.description],
		);
		return NextResponse.json({ data: data.project }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const GET = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

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
			WHERE "id" = ${id} AND "userId" = ${session.user.id};
		`;
		return NextResponse.json({ data: data.rows[0] }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
	if (id) {
		await sql`
			DELETE FROM project
			WHERE "id" = ${id} AND "userId" = ${session.user.id};
		`; // remove project
		await sql`
			DELETE FROM todo
			WHERE "projectId" = ${id} AND "userId" = ${session.user.id};
		`; // remove all todos inside the project
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
