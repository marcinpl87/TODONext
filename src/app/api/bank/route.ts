import { NextRequest, NextResponse } from 'next/server';
import jwa from 'jwa';
import type { BankTransaction } from '../../../types';

const SESSION_DATA = process.env.BANK_SESSION_DATA || '';
const PRIVATE_KEY = process.env.BANK_PRIVATE_KEY || '';
const ACCOUNT_IBAN = process.env.BANK_ACCOUNT_IBAN || '';
const APPLICATION_ID = process.env.BANK_APPLICATION_ID || '';
const API_BASE_URL = process.env.BANK_API_BASE_URL || '';
const API_ISS = process.env.BANK_API_ISS || '';
const API_AUD = process.env.BANK_API_AUD || '';

const encodeData = (data: Record<string, string | number>): string =>
	Buffer.from(JSON.stringify(data)).toString('base64').replace('=', '');

const getJWTHeader = (): string =>
	encodeData({
		typ: 'JWT',
		alg: 'RS256',
		kid: APPLICATION_ID,
	});

const getJWTBody = (exp: number): string => {
	const timestamp = Math.floor(new Date().getTime() / 1000);
	return encodeData({
		iss: API_ISS,
		aud: API_AUD,
		iat: timestamp,
		exp: timestamp + exp,
	});
};

const signWithKey = (data: string): string =>
	jwa('RS256').sign(data, PRIVATE_KEY);

const getJWT = (exp: number = 3600): string => {
	const jwtHeaders = getJWTHeader();
	const jwtBody = getJWTBody(exp);
	const jwtSignature = signWithKey(`${jwtHeaders}.${jwtBody}`);
	return `${jwtHeaders}.${jwtBody}.${jwtSignature}`;
};

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams;
	const continuationKey = searchParams.get('continuationKey');
	const JWT = getJWT();
	const psuHeaders = {
		Authorization: `Bearer ${JWT}`,
		'Content-Type': 'application/json',
		'psu-ip-address': '10.10.10.10',
		'psu-user-agent':
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
	};
	const accountId = JSON.parse(SESSION_DATA).accounts[0];
	let transactionsUrl = `${API_BASE_URL}/accounts/${accountId}/transactions`;
	if (continuationKey) {
		const url = new URL(transactionsUrl);
		url.searchParams.append('continuation_key', continuationKey);
		transactionsUrl = url.toString();
	}
	const accountTransactionsResponse = await fetch(transactionsUrl, {
		headers: psuHeaders,
	});
	const transactions = JSON.parse(await accountTransactionsResponse.text());
	const returnArray: BankTransaction[] = [];
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
					creditor: tr?.creditor.name,
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
