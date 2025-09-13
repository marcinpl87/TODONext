import { NextRequest, NextResponse } from 'next/server';
import type { AspspTransaction } from '../../../../types';
import { getHeaders } from '../utils';

const ACCOUNT_ID = process.env.BANK_ACCOUNT_ID || '';
const ACCOUNT_IBAN = process.env.BANK_ACCOUNT_IBAN || '';
const API_BASE_URL = process.env.BANK_API_BASE_URL || '';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams;
	const continuationKey = searchParams.get('continuationKey');
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
	const returnArray: AspspTransaction[] = [];
	if (transactions?.transactions?.length > 0) {
		transactions?.transactions.forEach(
			(tr: {
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
			}) => {
				const isPositive = tr?.creditor_account?.iban === ACCOUNT_IBAN;
				returnArray.push({
					date: tr?.booking_date,
					amount:
						(isPositive ? '+' : '-') +
						tr?.transaction_amount.amount,
					receiver: tr?.creditor.name,
					description: tr?.remittance_information[0],
				});
			},
		);
		return NextResponse.json(
			{
				transactions: returnArray,
				continuationKey: transactions?.continuation_key,
			},
			{ status: 200 },
		);
	} else {
		return NextResponse.json(
			{
				result: 'ERROR',
				response: transactions,
			},
			{ status: 200 },
		);
	}
};
