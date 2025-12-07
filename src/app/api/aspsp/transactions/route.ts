import { NextRequest, NextResponse } from 'next/server';
import { getHeaders, incrementalImport, saveTransactionsInDB } from '../utils';
import { requireAuth } from '../../../../lib/auth';
import type { AspspResponse, AspspTransaction } from '../../../../types';

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
