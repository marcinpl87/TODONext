import { NextResponse } from 'next/server';
import { getHeaders } from '../utils';

const API_BASE_URL = process.env.BANK_API_BASE_URL || '';
const REDIRECT_URL = process.env.BANK_REDIRECT_URL || '';
const BANK_NAME = process.env.BANK_NAME || '';
const BANK_COUNTRY = process.env.BANK_COUNTRY || '';

export const GET = async (): Promise<NextResponse> => {
	const validUntil = new Date(
		new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days ahead
	);
	const authorizationResponse = await fetch(`${API_BASE_URL}/auth`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({
			access: {
				valid_until: validUntil.toISOString(),
			},
			aspsp: {
				name: BANK_NAME,
				country: BANK_COUNTRY,
			},
			state: 'some_test_state',
			redirect_url: REDIRECT_URL,
			psu_type: 'personal',
		}),
	});
	const authorizationData = await authorizationResponse.json();
	return NextResponse.json(authorizationData, { status: 200 });
};
