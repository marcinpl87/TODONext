import { sql } from '@vercel/postgres';
import { Property } from '../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { userId: string; property: Property } = await request.json();
	if (data && data.userId && data.property) {
		await sql.query(
			`INSERT INTO property (
				"id",
				"name",
				"address",
				"floor",
				"code",
				"wifiSsid",
				"wifiPass",
				"rooms",
				"lockIn",
				"lockOut",
				"safe",
				"insuranceName",
				"insuranceDate",
				"insuranceNumber",
				"notes",
				"creationTimestamp"
			) 
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, to_timestamp($16));`,
			[
				data.property.id,
				data.property.name,
				data.property.address,
				data.property.floor,
				data.property.code,
				data.property.wifiSsid,
				data.property.wifiPass,
				data.property.rooms,
				data.property.lockIn,
				data.property.lockOut,
				data.property.safe,
				data.property.insuranceName,
				data.property.insuranceDate,
				data.property.insuranceNumber,
				data.property.notes,
				data.property.creationTimestamp
					? data.property.creationTimestamp / 1000
					: 0,
			],
		);
	}
	return NextResponse.json({ message: 'OK' }, { status: 200 });
};

export const GET = async () => {
	const data = await sql`
		SELECT
			"id",
			"name",
			"address",
			"floor",
			"code",
			"wifiSsid",
			"wifiPass",
			"rooms",
			"lockIn",
			"lockOut",
			"safe",
			"insuranceName",
			"insuranceDate",
			"insuranceNumber",
			"notes",
			(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
		FROM property
		ORDER BY "creationTimestamp" DESC;
	`;
	return NextResponse.json({ data: data.rows }, { status: 200 });
};
