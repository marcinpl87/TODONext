import { sql } from '@vercel/postgres';
import { Project } from '../../../types/project';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';

export const POST = async (request: NextRequest) => {
	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const data: { userId: string; project: Project } = await request.json();

	// Ensure the authenticated user can only create projects for themselves
	if (data.userId !== session.user.id) {
		return NextResponse.json(
			{ message: 'Forbidden: Cannot create projects for other users' },
			{ status: 403 },
		);
	}

	if (data && data.userId && data.project) {
		await sql.query(
			`INSERT INTO project (
				"id",
				"userId",
				"title",
				"description",
				"creationTimestamp"
			)
			VALUES ($1, $2, $3, $4, to_timestamp($5));`,
			[
				data.project.id,
				session.user.id,
				data.project.title,
				data.project.description,
				data.project.creationTimestamp
					? data.project.creationTimestamp / 1000
					: 0,
			],
		);
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async (request: NextRequest) => {
	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	// Only return projects for the authenticated user
	const data = await sql`
		SELECT
			"id",
			"userId",
			"title",
			"description",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM project
		WHERE "userId" = ${session.user.id}
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
