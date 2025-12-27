import { sql } from '@vercel/postgres';
import { Tenant } from '../../../../types/realEstate';
import { type NextRequest, NextResponse } from 'next/server';

export const PATCH = async (
	request: NextRequest,
	{ params }: { params: { id: string } },
) => {
	const { id } = params;
	const data: { userId: string; tenant: Tenant } = await request.json();
	if (id && data && data.userId && data.tenant) {
		await sql.query(
			`UPDATE tenant SET
			"name" = $2,
			"senderName" = $3,
			"idNumber" = $4,
			"nationalInsuranceNumber" = $5,
			"birthDate" = $6,
			"email" = $7,
			"phone" = $8,
			"address" = $9,
			"roomId" = $10,
			"apartmentId" = $11,
			"rent" = $12,
			"rentFirstMonth" = $13,
			"rentFirstRent" = $14,
			"deposit" = $15,
			"account" = $16,
			"accountDeposit" = $17,
			"iceName" = $18,
			"iceLastname" = $19,
			"iceIdNumber" = $20,
			"iceNationalInsuranceNumber" = $21,
			"iceEmail" = $22,
			"icePhone" = $23,
			"iceAddress" = $24,
			"insuranceName" = $25,
			"insuranceNumber" = $26,
			"insuranceDate" = $27,
			"contractDate" = $28,
			"contractDateStart" = $29,
			"contractDateEnd" = $30,
			"contractDateHandoff" = $31,
			"notes" = $32,
			"isContract" = $33,
			"isDeposit" = $34,
			"is1stRent" = $35,
			"isInsurance" = $36,
			"isWarranty" = $37,
			"isKey" = $38,
			"isProtocol" = $39,
			"status" = $40
			WHERE "id" = $1;`,
			[
				id,
				data.tenant.name,
				data.tenant.senderName,
				data.tenant.idNumber,
				data.tenant.nationalInsuranceNumber,
				data.tenant.birthDate,
				data.tenant.email,
				data.tenant.phone,
				data.tenant.address,
				data.tenant.roomId,
				data.tenant.apartmentId,
				data.tenant.rent,
				data.tenant.rentFirstMonth,
				data.tenant.rentFirstRent,
				data.tenant.deposit,
				data.tenant.account,
				data.tenant.accountDeposit,
				data.tenant.iceName,
				data.tenant.iceLastname,
				data.tenant.iceIdNumber,
				data.tenant.iceNationalInsuranceNumber,
				data.tenant.iceEmail,
				data.tenant.icePhone,
				data.tenant.iceAddress,
				data.tenant.insuranceName,
				data.tenant.insuranceNumber,
				data.tenant.insuranceDate,
				data.tenant.contractDate,
				data.tenant.contractDateStart,
				data.tenant.contractDateEnd,
				data.tenant.contractDateHandoff,
				data.tenant.notes,
				data.tenant.isContract,
				data.tenant.isDeposit,
				data.tenant.is1stRent,
				data.tenant.isInsurance,
				data.tenant.isWarranty,
				data.tenant.isKey,
				data.tenant.isProtocol,
				data.tenant.status,
			],
		);
		return NextResponse.json({ data: data.tenant }, { status: 200 });
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
				"status",
				(EXTRACT(EPOCH FROM "creationTimestamp") * 1000)::BIGINT AS "creationTimestamp"
			FROM tenant
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
			DELETE FROM tenant
			WHERE "id" = ${id};
		`; // remove tenant
		return NextResponse.json({ message: 'OK' }, { status: 200 });
	}
	return NextResponse.json({ message: 'No ID error' }, { status: 403 });
};
