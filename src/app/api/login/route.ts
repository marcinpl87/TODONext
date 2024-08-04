import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const data = await request.formData();

	return data.get('password') &&
		data.get('password') === process.env.USER_PASS
		? NextResponse.json({ message: 'OK' }, { status: 200 })
		: NextResponse.json({ message: 'Wrong password' }, { status: 403 });
}
