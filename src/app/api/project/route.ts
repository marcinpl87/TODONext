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
