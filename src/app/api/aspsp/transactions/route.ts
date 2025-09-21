import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { getHeaders } from '../utils';
import { requireAuth } from '../../../../lib/auth';
import type { AspspTransaction } from '../../../../types';

const ACCOUNT_ID = process.env.BANK_ACCOUNT_ID || '';
const ACCOUNT_IBAN = process.env.BANK_ACCOUNT_IBAN || '';
const API_BASE_URL = process.env.BANK_API_BASE_URL || '';

const allTransactions: AspspTransaction[] = [];

type RawTransaction = {
	booking_date: string;
	transaction_amount: {
		amount: string;
	};
	creditor: {
		name: string;
	};
	creditor_account: {
		iban: string;
	};
	remittance_information: string[];
};

type AspspResponse = AspspTransaction[] | { result: string; response: any };

const transformTransaction = (
	tr: RawTransaction,
	accountIban: string,
): AspspTransaction => ({
	date: tr?.booking_date,
	amount:
		(tr?.creditor_account?.iban === accountIban ? '+' : '-') +
		tr?.transaction_amount.amount,
	receiver: tr?.creditor.name,
	description: tr?.remittance_information[0],
});

const getOnePage = async (continuationKey?: string): Promise<AspspResponse> => {
	let transactionsUrl = `${API_BASE_URL}/accounts/${ACCOUNT_ID}/transactions`;
	if (continuationKey) {
		const url = new URL(transactionsUrl);
		url.searchParams.append('continuation_key', continuationKey);
		transactionsUrl = url.toString();
	}
	const accountTransactionsResponse = await fetch(transactionsUrl, {
		headers: getHeaders(),
	});
	const transactions = JSON.parse(await accountTransactionsResponse.text());
	if (transactions?.transactions?.length > 0) {
		transactions?.transactions.forEach((tr: RawTransaction) => {
			allTransactions.push(transformTransaction(tr, ACCOUNT_IBAN));
		});
		if (transactions?.continuation_key) {
			return getOnePage(transactions?.continuation_key);
		} else {
			return allTransactions;
		}
	} else {
		return { result: 'ERROR', response: transactions };
	}
};

const incrementalImport = async (
	newTransactions: AspspTransaction[],
): Promise<AspspResponse> => {
	const dbData: { rows: AspspTransaction[] } = await sql`
		SELECT
			(EXTRACT(EPOCH FROM "date") * 1000)::BIGINT AS "date",
			"amount",
			"receiver",
			"description"
		FROM bank_transaction
		WHERE "isManual" IS FALSE
		ORDER BY "creationTimestamp" DESC
		LIMIT 1;
	`;
	if (dbData.rows.length > 0) {
		const dbTransactionToSearch: AspspTransaction = {
			...dbData.rows[0],
			date: String(
				new Date(Number(dbData.rows[0].date))
					.toISOString()
					.slice(0, 10),
			),
			amount:
				(Number(dbData.rows[0].amount) >= 0 ? '+' : '-') +
				Math.abs(Number(dbData.rows[0].amount)).toFixed(2),
		};
		const foundIndex = newTransactions.findIndex(tr =>
			Object.entries(dbTransactionToSearch).every(
				([key, value]) => tr[key as keyof AspspTransaction] === value,
			),
		);
		if (foundIndex !== -1) {
			return newTransactions.slice(0, foundIndex);
		} else {
			return {
				result: 'ERROR, last DB transaction not found in ASPSP Data',
				response: null,
			};
		}
	} else {
		return { result: 'ERROR, no DB data', response: null };
	}
};

const saveTransactionsInDB = async (
	userId: string,
	transactions: AspspTransaction[],
): Promise<void> => {
	const values: Array<number | string> = [];
	const placeholders: string[] = [];
	const currentTimestampSeconds = Date.now() / 1000;
	transactions.reverse(); // reverse to have oldest transactions first...
	// ...the order in the DB will be the same as the order in the API
	transactions.forEach((tr: AspspTransaction, i: number) => {
		const baseIndex = i * 6;
		placeholders.push(
			`(
				to_timestamp($${baseIndex + 1}), 
				to_timestamp($${baseIndex + 2}), 
				$${baseIndex + 3}, 
				$${baseIndex + 4}, 
				$${baseIndex + 5},
				$${baseIndex + 6}
			)`,
		);
		values.push(
			currentTimestampSeconds + i, // increment dates by index, because...
			// ...Postgres in SELECT * without an ORDER BY, is free to return...
			// ...rows in any order, and it may change from one query to another
			Date.UTC(
				parseInt(tr.date.slice(0, 4)), // year
				parseInt(tr.date.slice(5, 7)) - 1, // month (0-based)
				parseInt(tr.date.slice(8, 10)), // day
			) / 1000,
			tr.amount,
			tr.receiver,
			tr.description,
			userId,
		);
	});
	await sql.query(
		`
			INSERT INTO bank_transaction (
				"creationTimestamp",
				"date",
				"amount",
				"receiver",
				"description",
				"userId"
			)
			VALUES ${placeholders.join(', ')}
		`,
		values,
	);
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
	const aspspData: AspspResponse = await getOnePage();
	if (Array.isArray(aspspData) && aspspData.length > 0) {
		if (mode === 'importIncremental') {
			const incrementalTransactions = await incrementalImport(aspspData);
			if (Array.isArray(incrementalTransactions)) {
				if (incrementalTransactions.length > 0) {
					await saveTransactionsInDB(
						authResult.user?.userId || '',
						incrementalTransactions,
					);
					return NextResponse.json(
						{
							importedTransactions: incrementalTransactions,
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
		} else if (mode === 'importAll') {
			await saveTransactionsInDB(
				authResult.user?.userId || '',
				aspspData,
			);
			return NextResponse.json(
				{ importedTransactions: aspspData },
				{ status: 200 },
			);
		} else {
			return NextResponse.json(
				{
					transactions: aspspData,
				},
				{ status: 200 },
			);
		} // no fetch mode - return transactions
	} else {
		return NextResponse.json(
			{
				result: 'ERROR',
				response: aspspData,
			},
			{ status: 200 },
		);
	}
};
