import { type NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { LS_KEY_USERS } from '@/app/consts';

export async function POST(request: NextRequest) {
	const data = await request.formData();
	const redis = new Redis({
		url: process.env.UPSTASH_URL,
		token: process.env.UPSTASH_TOKEN,
	});
	const redisUser: Record<string, string>[] | null =
		await redis.get(LS_KEY_USERS);

	if (
		redisUser &&
		redisUser.length > 0 &&
		data.get('username') &&
		data.get('password')
	) {
		const user = redisUser.find(user => user.name === data.get('username'));
		if (user && user.pass === data.get('password')) {
			return NextResponse.json(
				{ message: 'OK', userId: user.id },
				{ status: 200 },
			);
		} else {
			return NextResponse.json(
				{ message: 'Wrong password' },
				{ status: 403 },
			);
		}
	} else {
		return NextResponse.json(
			{ message: 'Wrong password' },
			{ status: 403 },
		);
	}
}
