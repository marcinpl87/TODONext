import { sql } from '@vercel/postgres';
import { Project } from '../../../types/project';
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

	const data: { userId: string; project: Project } = await request.json();

	// Ensure the authenticated user can only create projects for themselves
	if (data.userId !== authResult.user?.userId) {
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
				data.userId,
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
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
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
		WHERE "userId" = ${authResult.user?.userId}
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
