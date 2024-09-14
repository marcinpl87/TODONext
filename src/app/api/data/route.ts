import { type NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const POST = async (request: NextRequest) => {
	const data = await request.json();
	await redis.set(data.key, data.data);
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async (request: NextRequest) => {
	const { searchParams } = new URL(request.url);
	const key = searchParams.get('key');
	if (!key) {
		return NextResponse.json(
			{ message: 'Key is required' },
			{ status: 400 },
		);
	}
	const data = await redis.get(key);
	if (data === null) {
		return NextResponse.json(
			{ message: 'Data not found' },
			{ status: 404 },
		);
	}
	return NextResponse.json({ data }, { status: 200 });
};
