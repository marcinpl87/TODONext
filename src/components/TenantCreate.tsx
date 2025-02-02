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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTenant(
			{
				id: uuidv4(),
				name,
				address,
				creationTimestamp: Date.now(),
				senderName: '',
				idNumber: '',
				nationalInsuranceNumber: '',
				birthDate: '',
				email: '',
				phone: '',
				roomId: uuidv4(),
				apartmentId: uuidv4(),
				rent: 0,
				rentFirstMonth: '',
				rentFirstRent: 0,
				deposit: 0,
				account: '',
				accountDeposit: '',
				iceName: '',
				iceLastname: '',
				icePhone: '',
				iceEmail: '',
				iceIdNumber: '',
				iceNationalInsuranceNumber: '',
				iceAddress: '',
				insuranceName: '',
				insuranceDate: '',
				insuranceNumber: '',
				notes: '',
				contractDate: '',
				contractDateStart: '',
				contractDateEnd: '',
				contractDateHandoff: '',
				isContract: false,
				isDeposit: false,
				is1stRent: false,
				isInsurance: false,
				isKey: false,
				isWarranty: false,
				isProtocol: false,
				status: 0,
			},
			() => {
				setName('');
				setAddress('');
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
