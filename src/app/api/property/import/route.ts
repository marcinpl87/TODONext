import { sql } from '@vercel/postgres';
import { Property } from '../../../../types/realEstate';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { properties: Property[] } = await request.json();
	if (data && data.properties && data.properties.length > 0) {
		data.properties.map(async (property: Property) => {
			await sql.query(`DELETE FROM property;`); // clear the table to override data during import
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
					"notes"
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`,
				[
					property.id,
					property.name,
					property.address,
					property.floor,
					property.code,
					property.wifiSsid,
					property.wifiPass,
					property.rooms,
					property.lockIn,
					property.lockOut,
					property.safe,
					property.insuranceName,
					property.insuranceDate,
					property.insuranceNumber,
					property.notes,
				],
			);
		});
	}

	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
