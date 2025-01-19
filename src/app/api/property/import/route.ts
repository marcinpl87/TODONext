import { sql } from '@vercel/postgres';
import { Property } from '../../../../types';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { properties: Property[] } = await request.json();
	if (data && data.properties && data.properties.length > 0) {
		data.properties.map(async (property: Property) => {
			await sql`
				DELETE FROM property;
			`; // clear the table to override data during import
			await sql`
				INSERT INTO property (
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
				VALUES (
					${property.id},
					${property.name},
					${property.address},
					${property.floor},
					${property.code},
					${property.wifiSsid},
					${property.wifiPass},
					${property.rooms},
					${property.lockIn},
					${property.lockOut},
					${property.safe},
					${property.insuranceName},
					${property.insuranceDate},
					${property.insuranceNumber},
					${property.notes}
				);
			`;
		});
	}

	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
