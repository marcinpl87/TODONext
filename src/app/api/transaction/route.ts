import { sql } from '@vercel/postgres';
import { Transaction } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';

const timezonedDateToUTC = (date: Date) => {
	const localDate = new Date(date);
	const year = localDate.getFullYear();
	const month = localDate.getMonth();
	const day = localDate.getDate();
	return new Date(Date.UTC(year, month, day));
}; // convert a timezoned date to UTC (GMT) to store as a timezone-agnostic timestamp in the DB

export const POST = async (request: NextRequest) => {
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const data: { userId: string; transaction: Transaction } =
		await request.json();

	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{
				message:
					'Forbidden: Cannot create transactions for other users',
			},
			{ status: 403 },
		);
	}

	if (data && data.userId && data.transaction) {
		await sql.query(
			`INSERT INTO bank_transaction (
				"id",
				"userId",
				"creationTimestamp",
				"date",
				"amountCustom",
				"receiver",
				"descriptionCustom",
				"isManual"
			)
			VALUES ($1, $2, to_timestamp($3), to_timestamp($4), $5, $6, $7, $8);`,
			[
				data.transaction.id,
				data.userId,
				data.transaction.creationTimestamp
					? data.transaction.creationTimestamp / 1000
					: 0,
				data.transaction.date
					? new Date(
							timezonedDateToUTC(data.transaction.date),
						).getTime() / 1000
					: 0, // convert timezoned date to UTC (GMT) timestamp
				data.transaction.amount,
				data.transaction.receiver,
				data.transaction.description,
				data.transaction.isManual,
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
	const data = await sql`
		SELECT
			"id",
			"userId",
			(EXTRACT(EPOCH FROM "date") * 1000)::BIGINT AS "date",
			"amount",
			"amountCustom",
			"receiver",
			"description",
			"descriptionCustom",
			"categoryId",
			"isManual",
			"isHidden",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM bank_transaction
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};

export const PATCH = async (request: NextRequest) => {
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	const data: {
		userId: string;
		transaction: Partial<Transaction> & { id: string };
	} = await request.json();

	if (data.userId !== authResult.user?.userId) {
		return NextResponse.json(
			{
				message:
					'Forbidden: Cannot update transactions for other users',
			},
			{ status: 403 },
		);
	}

	if (data && data.userId && data.transaction && data.transaction.id) {
		const updateFields: string[] = [];
		const values: any[] = [];
		let paramIndex = 1;

		if (data.transaction.date !== undefined) {
			updateFields.push(`"date" = to_timestamp($${paramIndex})`);
			values.push(
				data.transaction.date
					? new Date(
							timezonedDateToUTC(data.transaction.date),
						).getTime() / 1000
					: 0,
			);
			paramIndex++;
		}

		if (data.transaction.amount !== undefined) {
			updateFields.push(`"amountCustom" = $${paramIndex}`);
			values.push(data.transaction.amount);
			paramIndex++;
		}

		if (data.transaction.receiver !== undefined) {
			updateFields.push(`"receiver" = $${paramIndex}`);
			values.push(data.transaction.receiver);
			paramIndex++;
		}

		if (data.transaction.description !== undefined) {
			updateFields.push(`"descriptionCustom" = $${paramIndex}`);
			values.push(data.transaction.description);
			paramIndex++;
		}

		if (data.transaction.isManual !== undefined) {
			updateFields.push(`"isManual" = $${paramIndex}`);
			values.push(data.transaction.isManual);
			paramIndex++;
		}

		if (data.transaction.categoryId !== undefined) {
			updateFields.push(`"categoryId" = $${paramIndex}`);
			values.push(data.transaction.categoryId);
			paramIndex++;
		}

		if (updateFields.length > 0) {
			// TODO: for ID and UserID use parameterized queries (recommended, safe against SQL injection)
			const query = `
				UPDATE bank_transaction 
				SET ${updateFields.join(', ')}
				WHERE "id" = '${data.transaction.id}' AND "userId" = '${data.userId}';
			`;

			await sql.query(query, values);
		}
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
