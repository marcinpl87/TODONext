import { sql } from '@vercel/postgres';
import { Project } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { userId: string; project: Project } = await request.json();
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

export const GET = async () => {
	const data = await sql`
		SELECT
			"id",
			"userId",
			"title",
			"description",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM project
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
