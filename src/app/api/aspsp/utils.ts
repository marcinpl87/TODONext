import { sql } from '@vercel/postgres';
import jwa from 'jwa';
import type { AspspResponse, AspspTransaction } from '../../../types';

const PRIVATE_KEY = process.env.BANK_PRIVATE_KEY || '';
const APPLICATION_ID = process.env.BANK_APPLICATION_ID || '';
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

export const getHeaders = (): Record<string, string> => ({
	Authorization: `Bearer ${getJWT()}`,
	'Content-Type': 'application/json',
	'psu-ip-address': '10.10.10.10',
	'psu-user-agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
});

const normalizeAmounts = (arr: AspspTransaction[]): AspspTransaction[] =>
	arr.map(obj => {
		const sign = obj.amount.startsWith('+')
			? '+'
			: obj.amount.startsWith('-')
				? '-'
				: '';
		const num = Math.abs(Number(obj.amount));
		return {
			...obj,
			amount: sign + num.toFixed(2),
		};
	}); // normalize amounts to strings with 2 decimal places, preserving "+" or "-" sign

export const incrementalImport = async (
	newTransactions: AspspTransaction[],
): Promise<AspspResponse> => {
	const dbData: { rows: AspspTransaction[] } = await sql.query(`
		SELECT
			(EXTRACT(EPOCH FROM "date") * 1000)::BIGINT AS "date",
			"amount",
			"receiver",
			"description"
		FROM bank_transaction
		WHERE "isManual" IS FALSE
		ORDER BY "creationTimestamp" DESC
		LIMIT 1;
	`); // not sure why but sometimes this query response is cached
	if (dbData.rows.length > 0) {
		const normalizedTransactions = normalizeAmounts(newTransactions);
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
		const foundIndex = normalizedTransactions.findIndex(tr =>
			Object.entries(dbTransactionToSearch).every(
				([key, value]) => tr[key as keyof AspspTransaction] === value,
			),
		);
		if (foundIndex !== -1) {
			return normalizedTransactions.slice(0, foundIndex);
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

export const saveTransactionsInDB = async (
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
