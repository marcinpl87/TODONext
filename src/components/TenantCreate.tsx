'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from './ui/card';
import { Button } from './ui/button';
import TenantForm from './TenantForm';
import type { Tenant } from '../types';

type TenantCreateProps = {
	addTenant: (tenant: Tenant, callback: () => void) => void;
};

const TenantCreate: React.FC<TenantCreateProps> = ({ addTenant }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [senderName, setSenderName] = useState<string>('');
	const [idNumber, setIdNumber] = useState<string>('');
	const [nationalInsuranceNumber, setNationalInsuranceNumber] =
		useState<string>('');
	const [birthDate, setBirthDate] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [rent, setRent] = useState<number>(0);
	const [rentFirstMonth, setRentFirstMonth] = useState<string>('');
	const [rentFirstRent, setRentFirstRent] = useState<number>(0);
	const [deposit, setDeposit] = useState<number>(0);
	const [account, setAccount] = useState<string>('');
	const [accountDeposit, setAccountDeposit] = useState<string>('');
	const [iceName, setIceName] = useState<string>('');
	const [iceLastname, setIceLastname] = useState<string>('');
	const [icePhone, setIcePhone] = useState<string>('');
	const [iceEmail, setIceEmail] = useState<string>('');
	const [iceIdNumber, setIceIdNumber] = useState<string>('');
	const [iceNationalInsuranceNumber, setIceNationalInsuranceNumber] =
		useState<string>('');
	const [iceAddress, setIceAddress] = useState<string>('');
	const [insuranceName, setInsuranceName] = useState<string>('');
	const [insuranceDate, setInsuranceDate] = useState<string>('');
	const [insuranceNumber, setInsuranceNumber] = useState<string>('');
	const [notes, setNotes] = useState<string>('');
	const [contractDate, setContractDate] = useState<string>('');
	const [contractDateStart, setContractDateStart] = useState<string>('');
	const [contractDateEnd, setContractDateEnd] = useState<string>('');
	const [contractDateHandoff, setContractDateHandoff] = useState<string>('');
	const [isContract, setIsContract] = useState<boolean>(false);
	const [isDeposit, setIsDeposit] = useState<boolean>(false);
	const [is1stRent, setIs1stRent] = useState<boolean>(false);
	const [isInsurance, setIsInsurance] = useState<boolean>(false);
	const [isKey, setIsKey] = useState<boolean>(false);
	const [isWarranty, setIsWarranty] = useState<boolean>(false);
	const [isProtocol, setIsProtocol] = useState<boolean>(false);
	const [status, setStatus] = useState<number>(0);
	const [roomId, setRoomId] = useState<string>('');
	const [apartmentId, setApartmentId] = useState<string>('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTenant(
			{
				id: uuidv4(),
				name,
				address,
				creationTimestamp: Date.now(),
				senderName,
				idNumber,
				nationalInsuranceNumber,
				birthDate,
				email,
				phone,
				roomId: uuidv4(),
				apartmentId: uuidv4(),
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
				setName('');
				setAddress('');
				setSenderName('');
				setIdNumber('');
				setNationalInsuranceNumber('');
				setBirthDate('');
				setEmail('');
				setPhone('');
				setRent(0);
				setRentFirstMonth('');
				setRentFirstRent(0);
				setDeposit(0);
				setAccount('');
				setAccountDeposit('');
				setIceName('');
				setIceLastname('');
				setIcePhone('');
				setIceEmail('');
				setIceIdNumber('');
				setIceNationalInsuranceNumber('');
				setIceAddress('');
				setInsuranceName('');
				setInsuranceDate('');
				setInsuranceNumber('');
				setNotes('');
				setContractDate('');
				setContractDateStart('');
				setContractDateEnd('');
				setContractDateHandoff('');
				setIsContract(false);
				setIsDeposit(false);
				setIs1stRent(false);
				setIsInsurance(false);
				setIsKey(false);
				setIsWarranty(false);
				setIsProtocol(false);
				setStatus(0);
				setIsOpened(false);
			},
		);
	};

	const handleCancel = () => {
		setIsOpened(false);
	};

	return (
		<>
			{isOpened ? (
				<Card className="w-full max-w-4xl mb-5">
					<TenantForm
						header="New Tenant"
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
						setIsProtocol={setIsProtocol}
						isProtocol={isProtocol}
						setIsWarranty={setIsWarranty}
						status={status}
						setStatus={setStatus}
						roomId={roomId}
						setRoomId={setRoomId}
						apartmentId={apartmentId}
						setApartmentId={setApartmentId}
						handleCancel={handleCancel}
						handleSubmit={handleSubmit}
					/>
				</Card>
			) : (
				<Button
					className="mb-5"
					variant="outline"
					onClick={() => setIsOpened(true)}
				>
					New Tenant
				</Button>
			)}
		</>
	);
};

export default TenantCreate;
