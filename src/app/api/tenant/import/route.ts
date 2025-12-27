import { sql } from '@vercel/postgres';
import { Tenant } from '../../../../types/realEstate';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const data: { tenants: Tenant[] } = await request.json();
	if (data && data.tenants && data.tenants.length > 0) {
		data.tenants.map(async (tenant: Tenant) => {
			await sql`
				DELETE FROM tenant;
			`; // clear the table to override data during import
			await sql`
				INSERT INTO tenant (
					"id",
					"name",
					"senderName",
					"idNumber",
					"nationalInsuranceNumber",
					"birthDate",
					"email",
					"phone",
					"address",
					"roomId",
					"apartmentId",
					"rent",
					"rentFirstMonth",
					"rentFirstRent",
					"deposit",
					"account",
					"accountDeposit",
					"iceName",
					"iceLastname",
					"iceIdNumber",
					"iceNationalInsuranceNumber",
					"iceEmail",
					"icePhone",
					"iceAddress",
					"insuranceName",
					"insuranceNumber",
					"insuranceDate",
					"contractDate",
					"contractDateStart",
					"contractDateEnd",
					"contractDateHandoff",
					"notes",
					"isContract",
					"isDeposit",
					"is1stRent",
					"isInsurance",
					"isWarranty",
					"isKey",
					"isProtocol",
					"status"
				)
				VALUES (
					${tenant.id},
					${tenant.name},
					${tenant.senderName},
					${tenant.idNumber},
					${tenant.nationalInsuranceNumber},
					${tenant.birthDate},
					${tenant.email},
					${tenant.phone},
					${tenant.address},
					${tenant.roomId},
					${tenant.apartmentId},
					${tenant.rent},
					${tenant.rentFirstMonth},
					${tenant.rentFirstRent},
					${tenant.deposit},
					${tenant.account},
					${tenant.accountDeposit},
					${tenant.iceName},
					${tenant.iceLastname},
					${tenant.iceIdNumber},
					${tenant.iceNationalInsuranceNumber},
					${tenant.iceEmail},
					${tenant.icePhone},
					${tenant.iceAddress},
					${tenant.insuranceName},
					${tenant.insuranceNumber},
					${tenant.insuranceDate},
					${tenant.contractDate},
					${tenant.contractDateStart},
					${tenant.contractDateEnd},
					${tenant.contractDateHandoff},
					${tenant.notes},
					${tenant.isContract},
					${tenant.isDeposit},
					${tenant.is1stRent},
					${tenant.isInsurance},
					${tenant.isWarranty},
					${tenant.isKey},
					${tenant.isProtocol},
					${tenant.status}
				);
			`;
		});
	}

	return NextResponse.json({ message: 'OK' }, { status: 200 });
};
