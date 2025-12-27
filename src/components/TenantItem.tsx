'use client';

import React, { useState, FormEvent } from 'react';
import { PenLine, Trash } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Card, CardContent } from './ui/card';
import TenantForm from './TenantForm';
import IconButton from './IconButton';
import type { Tenant } from '../types/realEstate';

type TenantItemProps = {
	tenant: Tenant;
	updateTenant: (tenant: Tenant, callback: () => void) => void;
	removeTenant: (id: string, name: string) => void;
};

const TenantItem: React.FC<TenantItemProps> = ({
	tenant,
	updateTenant,
	removeTenant,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>(tenant.name);
	const [address, setAddress] = useState<string>(tenant.address);
	const [senderName, setSenderName] = useState<string>(tenant.senderName);
	const [idNumber, setIdNumber] = useState<string>(tenant.idNumber);
	const [nationalInsuranceNumber, setNationalInsuranceNumber] =
		useState<string>(tenant.nationalInsuranceNumber);
	const [birthDate, setBirthDate] = useState<string>(tenant.birthDate);
	const [email, setEmail] = useState<string>(tenant.email);
	const [phone, setPhone] = useState<string>(tenant.phone);
	const [roomId, setRoomId] = useState<string>(tenant.roomId);
	const [apartmentId, setApartmentId] = useState<string>(tenant.apartmentId);
	const [rent, setRent] = useState<number>(tenant.rent);
	const [rentFirstMonth, setRentFirstMonth] = useState<string>(
		tenant.rentFirstMonth,
	);
	const [rentFirstRent, setRentFirstRent] = useState<number>(
		tenant.rentFirstRent,
	);
	const [deposit, setDeposit] = useState<number>(tenant.deposit);
	const [account, setAccount] = useState<string>(tenant.account);
	const [accountDeposit, setAccountDeposit] = useState<string>(
		tenant.accountDeposit,
	);
	const [iceName, setIceName] = useState<string>(tenant.iceName);
	const [iceLastname, setIceLastname] = useState<string>(tenant.iceLastname);
	const [icePhone, setIcePhone] = useState<string>(tenant.icePhone);
	const [iceEmail, setIceEmail] = useState<string>(tenant.iceEmail);
	const [iceIdNumber, setIceIdNumber] = useState<string>(tenant.iceIdNumber);
	const [iceNationalInsuranceNumber, setIceNationalInsuranceNumber] =
		useState<string>(tenant.iceNationalInsuranceNumber);
	const [iceAddress, setIceAddress] = useState<string>(tenant.iceAddress);
	const [insuranceName, setInsuranceName] = useState<string>(
		tenant.insuranceName,
	);
	const [insuranceDate, setInsuranceDate] = useState<string>(
		tenant.insuranceDate,
	);
	const [insuranceNumber, setInsuranceNumber] = useState<string>(
		tenant.insuranceNumber,
	);
	const [notes, setNotes] = useState<string>(tenant.notes);
	const [contractDate, setContractDate] = useState<string>(
		tenant.contractDate,
	);
	const [contractDateStart, setContractDateStart] = useState<string>(
		tenant.contractDateStart,
	);
	const [contractDateEnd, setContractDateEnd] = useState<string>(
		tenant.contractDateEnd,
	);
	const [contractDateHandoff, setContractDateHandoff] = useState<string>(
		tenant.contractDateHandoff,
	);
	const [isContract, setIsContract] = useState<boolean>(tenant.isContract);
	const [isDeposit, setIsDeposit] = useState<boolean>(tenant.isDeposit);
	const [is1stRent, setIs1stRent] = useState<boolean>(tenant.is1stRent);
	const [isInsurance, setIsInsurance] = useState<boolean>(tenant.isInsurance);
	const [isKey, setIsKey] = useState<boolean>(tenant.isKey);
	const [isWarranty, setIsWarranty] = useState<boolean>(tenant.isWarranty);
	const [isProtocol, setIsProtocol] = useState<boolean>(tenant.isProtocol);
	const [status, setStatus] = useState<number>(tenant.status);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateTenant(
			{
				...tenant,
				name,
				address,
				senderName,
				idNumber,
				nationalInsuranceNumber,
				birthDate,
				email,
				phone,
				roomId,
				apartmentId,
				rent,
				rentFirstMonth,
				rentFirstRent,
				deposit,
				account,
				accountDeposit,
				iceName,
				iceLastname,
				icePhone,
				iceEmail,
				iceIdNumber,
				iceNationalInsuranceNumber,
				iceAddress,
				insuranceName,
				insuranceDate,
				insuranceNumber,
				notes,
				contractDate,
				contractDateStart,
				contractDateEnd,
				contractDateHandoff,
				isContract,
				isDeposit,
				is1stRent,
				isInsurance,
				isKey,
				isWarranty,
				isProtocol,
				status,
			},
			() => {
				setIsEditing(false);
			},
		);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleRemove = () => {
		removeTenant(tenant.id, tenant.name);
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<TenantForm
					header="Edit Tenant"
					name={name}
					setName={setName}
					address={address}
					setAddress={setAddress}
					senderName={senderName}
					setSenderName={setSenderName}
					idNumber={idNumber}
					setIdNumber={setIdNumber}
					nationalInsuranceNumber={nationalInsuranceNumber}
					setNationalInsuranceNumber={setNationalInsuranceNumber}
					birthDate={birthDate}
					setBirthDate={setBirthDate}
					email={email}
					setEmail={setEmail}
					phone={phone}
					setPhone={setPhone}
					roomId={roomId}
					setRoomId={setRoomId}
					apartmentId={apartmentId}
					setApartmentId={setApartmentId}
					rent={rent}
					setRent={setRent}
					rentFirstMonth={rentFirstMonth}
					setRentFirstMonth={setRentFirstMonth}
					rentFirstRent={rentFirstRent}
					setRentFirstRent={setRentFirstRent}
					deposit={deposit}
					setDeposit={setDeposit}
					account={account}
					setAccount={setAccount}
					accountDeposit={accountDeposit}
					setAccountDeposit={setAccountDeposit}
					iceName={iceName}
					setIceName={setIceName}
					iceLastname={iceLastname}
					setIceLastname={setIceLastname}
					icePhone={icePhone}
					setIcePhone={setIcePhone}
					iceEmail={iceEmail}
					setIceEmail={setIceEmail}
					iceIdNumber={iceIdNumber}
					setIceIdNumber={setIceIdNumber}
					iceNationalInsuranceNumber={iceNationalInsuranceNumber}
					setIceNationalInsuranceNumber={
						setIceNationalInsuranceNumber
					}
					iceAddress={iceAddress}
					setIceAddress={setIceAddress}
					insuranceName={insuranceName}
					setInsuranceName={setInsuranceName}
					insuranceDate={insuranceDate}
					setInsuranceDate={setInsuranceDate}
					insuranceNumber={insuranceNumber}
					setInsuranceNumber={setInsuranceNumber}
					notes={notes}
					setNotes={setNotes}
					contractDate={contractDate}
					setContractDate={setContractDate}
					contractDateStart={contractDateStart}
					setContractDateStart={setContractDateStart}
					contractDateEnd={contractDateEnd}
					setContractDateEnd={setContractDateEnd}
					contractDateHandoff={contractDateHandoff}
					setContractDateHandoff={setContractDateHandoff}
					isContract={isContract}
					setIsContract={setIsContract}
					isDeposit={isDeposit}
					setIsDeposit={setIsDeposit}
					is1stRent={is1stRent}
					setIs1stRent={setIs1stRent}
					isInsurance={isInsurance}
					setIsInsurance={setIsInsurance}
					isKey={isKey}
					setIsKey={setIsKey}
					isWarranty={isWarranty}
					setIsWarranty={setIsWarranty}
					isProtocol={isProtocol}
					setIsProtocol={setIsProtocol}
					status={status}
					setStatus={setStatus}
					handleCancel={handleCancel}
					handleSubmit={handleSubmit}
				/>
			) : (
				<CardContent className="mt-5">
					<div className="text-2xl font-bold underline break-words pb-2">
						<Link href={`tenant/${tenant.id}`}>{tenant.name}</Link>
					</div>
					{tenant.address && (
						<p className="text-md text-muted-foreground pb-2 whitespace-pre-line break-words">
							{tenant.address}
						</p>
					)}
					<IconButton tooltip="Edit" onClick={handleEdit}>
						<PenLine className="size-5" />
					</IconButton>
					<IconButton tooltip="Delete" onClick={handleRemove}>
						<Trash className="size-5" />
					</IconButton>
				</CardContent>
			)}
		</Card>
	);
};

export default TenantItem;
