'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

type TenantFormProps = {
	header: string;
	name: string;
	setName: (value: React.SetStateAction<string>) => void;
	address: string;
	setAddress: (value: React.SetStateAction<string>) => void;
	senderName: string;
	setSenderName: (value: React.SetStateAction<string>) => void;
	idNumber: string;
	setIdNumber: (value: React.SetStateAction<string>) => void;
	nationalInsuranceNumber: string;
	setNationalInsuranceNumber: (value: React.SetStateAction<string>) => void;
	birthDate: string;
	setBirthDate: (value: React.SetStateAction<string>) => void;
	email: string;
	setEmail: (value: React.SetStateAction<string>) => void;
	phone: string;
	setPhone: (value: React.SetStateAction<string>) => void;
	roomId: string;
	setRoomId: (value: React.SetStateAction<string>) => void;
	apartmentId: string;
	setApartmentId: (value: React.SetStateAction<string>) => void;
	rent: number;
	setRent: (value: React.SetStateAction<number>) => void;
	rentFirstMonth: string;
	setRentFirstMonth: (value: React.SetStateAction<string>) => void;
	rentFirstRent: number;
	setRentFirstRent: (value: React.SetStateAction<number>) => void;
	deposit: number;
	setDeposit: (value: React.SetStateAction<number>) => void;
	account: string;
	setAccount: (value: React.SetStateAction<string>) => void;
	accountDeposit: string;
	setAccountDeposit: (value: React.SetStateAction<string>) => void;
	iceName: string;
	setIceName: (value: React.SetStateAction<string>) => void;
	iceLastname: string;
	setIceLastname: (value: React.SetStateAction<string>) => void;
	icePhone: string;
	setIcePhone: (value: React.SetStateAction<string>) => void;
	iceEmail: string;
	setIceEmail: (value: React.SetStateAction<string>) => void;
	iceIdNumber: string;
	setIceIdNumber: (value: React.SetStateAction<string>) => void;
	iceNationalInsuranceNumber: string;
	setIceNationalInsuranceNumber: (
		value: React.SetStateAction<string>,
	) => void;
	iceAddress: string;
	setIceAddress: (value: React.SetStateAction<string>) => void;
	insuranceName: string;
	setInsuranceName: (value: React.SetStateAction<string>) => void;
	insuranceDate: string;
	setInsuranceDate: (value: React.SetStateAction<string>) => void;
	insuranceNumber: string;
	setInsuranceNumber: (value: React.SetStateAction<string>) => void;
	notes: string;
	setNotes: (value: React.SetStateAction<string>) => void;
	contractDate: string;
	setContractDate: (value: React.SetStateAction<string>) => void;
	contractDateStart: string;
	setContractDateStart: (value: React.SetStateAction<string>) => void;
	contractDateEnd: string;
	setContractDateEnd: (value: React.SetStateAction<string>) => void;
	contractDateHandoff: string;
	setContractDateHandoff: (value: React.SetStateAction<string>) => void;
	isContract: boolean;
	setIsContract: (value: React.SetStateAction<boolean>) => void;
	isDeposit: boolean;
	setIsDeposit: (value: React.SetStateAction<boolean>) => void;
	is1stRent: boolean;
	setIs1stRent: (value: React.SetStateAction<boolean>) => void;
	isInsurance: boolean;
	setIsInsurance: (value: React.SetStateAction<boolean>) => void;
	isKey: boolean;
	setIsKey: (value: React.SetStateAction<boolean>) => void;
	isWarranty: boolean;
	setIsWarranty: (value: React.SetStateAction<boolean>) => void;
	isProtocol: boolean;
	setIsProtocol: (value: React.SetStateAction<boolean>) => void;
	status: number;
	setStatus: (value: React.SetStateAction<number>) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const TenantForm: React.FC<TenantFormProps> = ({
	header,
	name,
	setName,
	address,
	setAddress,
	senderName,
	setSenderName,
	idNumber,
	setIdNumber,
	nationalInsuranceNumber,
	setNationalInsuranceNumber,
	birthDate,
	setBirthDate,
	email,
	setEmail,
	phone,
	setPhone,
	roomId,
	setRoomId,
	apartmentId,
	setApartmentId,
	rent,
	setRent,
	rentFirstMonth,
	setRentFirstMonth,
	rentFirstRent,
	setRentFirstRent,
	deposit,
	setDeposit,
	account,
	setAccount,
	accountDeposit,
	setAccountDeposit,
	iceName,
	setIceName,
	iceLastname,
	setIceLastname,
	icePhone,
	setIcePhone,
	iceEmail,
	setIceEmail,
	iceIdNumber,
	setIceIdNumber,
	iceNationalInsuranceNumber,
	setIceNationalInsuranceNumber,
	iceAddress,
	setIceAddress,
	insuranceName,
	setInsuranceName,
	insuranceDate,
	setInsuranceDate,
	insuranceNumber,
	setInsuranceNumber,
	notes,
	setNotes,
	contractDate,
	setContractDate,
	contractDateStart,
	setContractDateStart,
	contractDateEnd,
	setContractDateEnd,
	contractDateHandoff,
	setContractDateHandoff,
	isContract,
	setIsContract,
	isDeposit,
	setIsDeposit,
	is1stRent,
	setIs1stRent,
	isInsurance,
	setIsInsurance,
	isKey,
	setIsKey,
	isWarranty,
	setIsWarranty,
	isProtocol,
	setIsProtocol,
	status,
	setStatus,
	handleCancel,
	handleSubmit,
}) => (
	<form onSubmit={handleSubmit}>
		<CardHeader>
			<CardTitle>{header}</CardTitle>
		</CardHeader>
		<CardContent className="grid gap-6">
			<div className="grid gap-2">
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					placeholder="Tenant name..."
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setName(e.target.value)
					}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="address">Address</Label>
				<Textarea
					id="address"
					placeholder="Tenant address..."
					value={address}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setAddress(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="senderName">Sender Name</Label>
				<Input
					id="senderName"
					placeholder="Sender name..."
					value={senderName}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSenderName(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="idNumber">ID Number</Label>
				<Input
					id="idNumber"
					placeholder="ID number..."
					value={idNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIdNumber(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="nationalInsuranceNumber">
					National Insurance Number
				</Label>
				<Input
					id="nationalInsuranceNumber"
					placeholder="National insurance number..."
					value={nationalInsuranceNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setNationalInsuranceNumber(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="birthDate">Birth Date</Label>
				<Input
					id="birthDate"
					placeholder="Birth date..."
					value={birthDate}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setBirthDate(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					placeholder="Email..."
					value={email}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setEmail(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="phone">Phone</Label>
				<Input
					id="phone"
					placeholder="Phone..."
					value={phone}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setPhone(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="roomId">Room ID</Label>
				<Input
					id="roomId"
					placeholder="Room ID..."
					value={roomId}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setRoomId(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="apartmentId">Apartment ID</Label>
				<Input
					id="apartmentId"
					placeholder="Apartment ID..."
					value={apartmentId}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setApartmentId(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="rent">Rent</Label>
				<Input
					id="rent"
					placeholder="Rent..."
					value={rent}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setRent(Number(e.target.value))
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="rentFirstMonth">Rent First Month</Label>
				<Input
					id="rentFirstMonth"
					placeholder="Rent first month..."
					value={rentFirstMonth}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setRentFirstMonth(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="rentFirstRent">Rent First Rent</Label>
				<Input
					id="rentFirstRent"
					placeholder="Rent first rent..."
					value={rentFirstRent}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setRentFirstRent(Number(e.target.value))
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="deposit">Deposit</Label>
				<Input
					id="deposit"
					placeholder="Deposit..."
					value={deposit}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setDeposit(Number(e.target.value))
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="account">Account</Label>
				<Input
					id="account"
					placeholder="Account..."
					value={account}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setAccount(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="accountDeposit">Account Deposit</Label>
				<Input
					id="accountDeposit"
					placeholder="Account deposit..."
					value={accountDeposit}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setAccountDeposit(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="iceName">ICE Name</Label>
				<Input
					id="iceName"
					placeholder="ICE name..."
					value={iceName}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIceName(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="iceLastname">ICE Lastname</Label>
				<Input
					id="iceLastname"
					placeholder="ICE lastname..."
					value={iceLastname}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIceLastname(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="icePhone">ICE Phone</Label>
				<Input
					id="icePhone"
					placeholder="ICE phone..."
					value={icePhone}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIcePhone(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="iceEmail">ICE Email</Label>
				<Input
					id="iceEmail"
					placeholder="ICE email..."
					value={iceEmail}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIceEmail(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="iceIdNumber">ICE ID Number</Label>
				<Input
					id="iceIdNumber"
					placeholder="ICE ID number..."
					value={iceIdNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIceIdNumber(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="iceNationalInsuranceNumber">
					ICE National Insurance Number
				</Label>
				<Input
					id="iceNationalInsuranceNumber"
					placeholder="ICE national insurance number..."
					value={iceNationalInsuranceNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIceNationalInsuranceNumber(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="iceAddress">ICE Address</Label>
				<Textarea
					id="iceAddress"
					placeholder="ICE address..."
					value={iceAddress}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setIceAddress(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="insuranceName">Insurance Name</Label>
				<Input
					id="insuranceName"
					placeholder="Insurance name..."
					value={insuranceName}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setInsuranceName(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="insuranceDate">Insurance Date</Label>
				<Input
					id="insuranceDate"
					placeholder="Insurance date..."
					value={insuranceDate}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setInsuranceDate(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="insuranceNumber">Insurance Number</Label>
				<Input
					id="insuranceNumber"
					placeholder="Insurance number..."
					value={insuranceNumber}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setInsuranceNumber(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="notes">Notes</Label>
				<Textarea
					id="notes"
					placeholder="Notes..."
					value={notes}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setNotes(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="contractDate">Contract Date</Label>
				<Input
					id="contractDate"
					placeholder="Contract date..."
					value={contractDate}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setContractDate(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="contractDateStart">Contract Date Start</Label>
				<Input
					id="contractDateStart"
					placeholder="Contract date start..."
					value={contractDateStart}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setContractDateStart(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="contractDateEnd">Contract Date End</Label>
				<Input
					id="contractDateEnd"
					placeholder="Contract date end..."
					value={contractDateEnd}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setContractDateEnd(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="contractDateHandoff">
					Contract Date Handoff
				</Label>
				<Input
					id="contractDateHandoff"
					placeholder="Contract date handoff..."
					value={contractDateHandoff}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setContractDateHandoff(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="isContract">Is Contract</Label>
				<Input
					id="isContract"
					type="checkbox"
					checked={isContract}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIsContract(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="isDeposit">Is Deposit</Label>
				<Input
					id="isDeposit"
					type="checkbox"
					checked={isDeposit}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIsDeposit(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="is1stRent">Is 1st Rent</Label>
				<Input
					id="is1stRent"
					type="checkbox"
					checked={is1stRent}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIs1stRent(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="isInsurance">Is Insurance</Label>
				<Input
					id="isInsurance"
					type="checkbox"
					checked={isInsurance}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIsInsurance(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="isKey">Is Key</Label>
				<Input
					id="isKey"
					type="checkbox"
					checked={isKey}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIsKey(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="isWarranty">Is Warranty</Label>
				<Input
					id="isWarranty"
					type="checkbox"
					checked={isWarranty}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIsWarranty(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="isProtocol">Is Protocol</Label>
				<Input
					id="isProtocol"
					type="checkbox"
					checked={isProtocol}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setIsProtocol(e.target.checked)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="status">Status</Label>
				<Input
					id="status"
					placeholder="Status..."
					value={status}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setStatus(Number(e.target.value))
					}
				/>
			</div>
		</CardContent>
		<CardFooter className="justify-between space-x-2">
			<Button
				variant="ghost"
				onClick={e => {
					e.preventDefault();
					handleCancel();
				}}
			>
				Cancel
			</Button>
			<Button variant="outline" type="submit">
				Save
			</Button>
		</CardFooter>
	</form>
);

export default TenantForm;
