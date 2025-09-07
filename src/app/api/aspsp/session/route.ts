import { NextRequest, NextResponse } from 'next/server';
import { getHeaders } from '../utils';

const API_BASE_URL = process.env.BANK_API_BASE_URL || '';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get('code');
	if (code) {
		const sessionsResponse = await fetch(`${API_BASE_URL}/sessions`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ code }),
		});
		const sessionsData = await sessionsResponse.json();
		const sessionId = sessionsData?.session_id;
		if (sessionId) {
			const sessionResponse = await fetch(
				`${API_BASE_URL}/sessions/${sessionId}`,
				{
					headers: getHeaders(),
				},
			);
			const sessionData = await sessionResponse.json();
			const accountId = sessionData?.accounts[0]?.id;
			if (accountId) {
				return NextResponse.json({ accountId }, { status: 200 });
			} else {
				return NextResponse.json(
					{ error: 'No account ID', response: sessionData },
					{ status: 200 },
				);
			}
		} else {
			return NextResponse.json(
				{ error: 'No session ID', response: sessionsData },
				{ status: 200 },
			);
		}
	} else {
		return NextResponse.json({ error: 'No session code' }, { status: 200 });
	}
};
