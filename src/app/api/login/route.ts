import { sql } from '@vercel/postgres';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data = await request.formData();
	const dbData = await sql`
		SELECT
			"id",
			"name",
			"pass"
		FROM public.user;
	`;

	if (
		dbData?.rows &&
		dbData.rows.length > 0 &&
		data.get('username') &&
		data.get('password')
	) {
		const user = dbData.rows.find(
			user => user.name === data.get('username'),
		);
		if (user && user.pass === data.get('password')) {
			try {
				await sql`
					INSERT INTO log (userId, action, datetime)
					VALUES (
						${user.id},
						'login',
						${new Date().toLocaleString('sv-SE').slice(0, -3)}
					);
				`;
				return NextResponse.json(
					{
						message: 'OK',
						userId: user.id,
						userName: user.name,
						users: dbData.rows.map(u => {
							delete u.pass; // remove passwords
							return u;
						}),
					},
					{ status: 200 },
				);
			} catch (error) {
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
	} else {
		return NextResponse.json(
			{ message: 'Wrong password' },
			{ status: 403 },
		);
	}
};
