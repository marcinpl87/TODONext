import { sql } from '@vercel/postgres';
import { Transaction } from '../../../../types/financial';
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';
import { timezonedDateToUTC } from './../utils';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	const authResult = requireAuth(request);
	if (!id) {
		return NextResponse.json({ message: 'No ID error' }, { status: 403 });
	}
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

	if (data && data.userId && data.transaction && id) {
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

		if (data.transaction.isHidden !== undefined) {
			updateFields.push(`"isHidden" = $${paramIndex}`);
			values.push(data.transaction.isHidden);
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
				WHERE "id" = '${id}' AND "userId" = '${data.userId}';
			`;

			await sql.query(query, values);
		}
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	const authResult = requireAuth(request);
	if (!id) {
		return NextResponse.json({ message: 'No ID error' }, { status: 403 });
	}
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}

	await sql`
			DELETE FROM bank_transaction
			WHERE "id" = ${id};
		`; // remove transaction
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
