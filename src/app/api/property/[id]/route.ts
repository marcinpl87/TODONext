import { sql } from '@vercel/postgres';
import { Property } from '../../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	const data: { property: Property } = await request.json();
	if (id && data && data.property) {
		await sql.query(
			`UPDATE property SET
			"name" = $2,
			"address" = $3,
			"floor" = $4,
			"code" = $5,
			"wifiSsid" = $6,
			"wifiPass" = $7,
			"rooms" = $8,
			"lockIn" = $9,
			"lockOut" = $10,
			"safe" = $11,
			"insuranceName" = $12,
			"insuranceDate" = $13,
			"insuranceNumber" = $14,
			"notes" = $15
			WHERE "id" = $1`,
			[
				id,
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
			],
		);
		return NextResponse.json({ data: data.property }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const GET = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	if (id) {
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
			WHERE "id" = ${id};
		`;
		return NextResponse.json({ data: data.rows[0] }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	if (id) {
		await sql`
			DELETE FROM property
			WHERE "id" = ${id};
		`; // remove property
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
