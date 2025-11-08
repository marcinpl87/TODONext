import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { requireAuth } from '../../../../lib/auth';
import { incrementalImport, saveTransactionsInDB } from '../utils';
import type { AspspResponse, AspspTransaction } from '../../../../types';

/**
 * Mark this route as dynamic to prevent Next.js from trying to statically
 * pre-render it at build time. API routes like this one depend on secrets,
 * environment variables, and external services (e.g. crypto signing, bank API)
 * that are only available at runtime. Without this flag, `next build` would
 * attempt to execute the code during prerendering and fail with errors such as
 * "No key provided to sign".
 */
export const dynamic = 'force-dynamic';

const TOSHL_TOKEN = process.env.BANK_TOSHL_TOKEN || '';

type RawTransaction = {
	amount: number;
	date: string;
	import: {
		payee: string;
	};
	desc: string;
};

const transformTransaction = (tr: RawTransaction): AspspTransaction => {
	// in this weird API sometimes description contains receiver name in a new line
	const descriptionAndReceiver: string[] = String(tr?.desc).split('\n');
	return {
		date: String(tr?.date),
		amount: String((tr?.amount > 0 ? '+' : '') + tr?.amount),
		receiver: descriptionAndReceiver[1] || String(tr?.import.payee),
		description: descriptionAndReceiver[0],
	};
};

const getTransactionsFromToshl = async (): Promise<AspspResponse> => {
	const dbData: { rows: Array<Pick<AspspTransaction, 'date'>> } = await sql`
		SELECT
			(EXTRACT(EPOCH FROM "date") * 1000)::BIGINT AS "date"
		FROM bank_transaction
		WHERE "isManual" IS FALSE
		ORDER BY "creationTimestamp" DESC
		LIMIT 1;
	`;
	if (dbData.rows.length > 0 && dbData.rows?.[0]?.date) {
		const threeDaysBeforeDbDate = new Date(
			Number(dbData.rows[0].date) - 3 * 24 * 60 * 60 * 1000,
		)
			.toISOString()
			.split('T')[0]; // get one day before last DB date to avoid missing transactions
		const todayDate = new Date().toISOString().split('T')[0];
		try {
			const response = await fetch(
				`https://api.toshl.com/entries?from=${threeDaysBeforeDbDate}&to=${todayDate}`,
				{
					method: 'GET',
					headers: {
						Authorization: 'Basic ' + btoa(TOSHL_TOKEN + ':'),
					},
				},
			);
			if (!response.ok) {
				return { result: 'ERROR', response };
			}
			const data = await response.json();
			return data.map(transformTransaction);
		} catch (error) {
			return {
				result: 'ERROR',
				response: 'Failed to fetch Toshl entries',
			};
		}
	}
	return { result: 'ERROR', response: 'No transactions in DB' };
};

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	// Check authentication
	const authResult = requireAuth(request);
	if (authResult.error) {
		return NextResponse.json(
			{ message: authResult.error },
			{ status: 401 },
		);
	}
	const searchParams = request.nextUrl.searchParams;
	const mode = searchParams.get('mode');
	const aspspData: AspspResponse = await getTransactionsFromToshl();
	if (Array.isArray(aspspData) && aspspData.length > 0) {
		if (mode === 'importIncremental') {
			const incrementalTransactions = await incrementalImport(aspspData);
			if (Array.isArray(incrementalTransactions)) {
				if (incrementalTransactions.length > 0) {
					const savedTransactions = await saveTransactionsInDB(
						authResult.user?.userId || '',
						incrementalTransactions,
					);
					return NextResponse.json(
						{
							importedTransactions: savedTransactions,
						},
						{ status: 200 },
					);
				} else {
					return NextResponse.json(
						{ importedTransactions: [] },
						{ status: 200 },
					); // no errors and no new transactions
				}
			}
			return NextResponse.json(incrementalTransactions, { status: 200 }); // could be error
		} else {
			return NextResponse.json(
				{
					transactions: aspspData,
				},
				{ status: 200 },
			);
		} // no fetch mode - return transactions
	} else {
		return NextResponse.json(aspspData, { status: 200 });
	}
};
