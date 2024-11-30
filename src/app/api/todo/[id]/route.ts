import { sql } from '@vercel/postgres';
import { type NextRequest, NextResponse } from 'next/server';

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
				"projectId",
				"title",
				"description",
				(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp",
				"estimatedTime",
				"isDone",
				(EXTRACT(EPOCH FROM "doneTimestamp") * 1000)::BIGINT AS "doneTimestamp"
            FROM todo
            WHERE "id" = ${id};
        `;
		return NextResponse.json({ data: data.rows[0] }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
