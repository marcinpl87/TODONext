'use client';

import React, { useEffect, useState } from 'react';
import { Tenant } from '../../../types/realEstate';
import { Card } from '../../../components/ui/card';
import LoadingIconTwo from '../../../components/LoadingIconTwo';

type TenantDetailsProps = {
	params: { id: string };
};

const TenantDetails: React.FC<TenantDetailsProps> = ({ params }) => {
	const [tenant, setTenant] = useState<Tenant | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (params.id) {
			fetch(`/api/tenant/${params.id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => response.json())
				.then(data => {
					setTenant(data.data);
					setIsLoading(false);
				})
				.catch(() => {
					setIsLoading(false);
				});
		}
	}, [params.id]);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	if (!tenant) {
		return <div>Tenant not found</div>;
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">{tenant.name}</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
				<Card className="p-4">
					<h2 className="text-xl font-bold mb-3">
						Tenant Information
					</h2>
					<p>
						<strong>Address:</strong> {tenant.address}
					</p>
					<p>
						<strong>Sender Name:</strong> {tenant.senderName}
					</p>
					<p>
						<strong>ID Number:</strong> {tenant.idNumber}
					</p>
					<p>
						<strong>National Insurance Number:</strong>{' '}
						{tenant.nationalInsuranceNumber}
					</p>
					<p>
						<strong>Birth Date:</strong> {tenant.birthDate}
					</p>
					<p>
						<strong>Email:</strong> {tenant.email}
					</p>
					<p>
						<strong>Phone:</strong> {tenant.phone}
					</p>
					<p>
						<strong>Room ID:</strong> {tenant.roomId}
					</p>
					<p>
						<strong>Apartment ID:</strong> {tenant.apartmentId}
					</p>
					<p>
						<strong>Rent:</strong> {tenant.rent}
					</p>
					<p>
						<strong>Rent First Month:</strong>{' '}
						{tenant.rentFirstMonth}
					</p>
					<p>
						<strong>Rent First Rent:</strong> {tenant.rentFirstRent}
					</p>
					<p>
						<strong>Deposit:</strong> {tenant.deposit}
					</p>
					<p>
						<strong>Account:</strong> {tenant.account}
					</p>
					<p>
						<strong>Account Deposit:</strong>{' '}
						{tenant.accountDeposit}
					</p>
					<p>
						<strong>Notes:</strong> {tenant.notes}
					</p>
					<p>
						<strong>Is Contract:</strong>{' '}
						{tenant.isContract ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Is Deposit:</strong>{' '}
						{tenant.isDeposit ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Is 1st Rent:</strong>{' '}
						{tenant.is1stRent ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Is Insurance:</strong>{' '}
						{tenant.isInsurance ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Is Key:</strong> {tenant.isKey ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Is Warranty:</strong>{' '}
						{tenant.isWarranty ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Is Protocol:</strong>{' '}
						{tenant.isProtocol ? 'Yes' : 'No'}
					</p>
					<p>
						<strong>Status:</strong> {tenant.status}
					</p>
				</Card>
				<div className="flex flex-col gap-6">
					<Card className="p-4">
						<h2 className="text-xl font-bold mb-3">
							Emergency Contact
						</h2>
						<p>
							<strong>Name:</strong> {tenant.iceName}
						</p>
						<p>
							<strong>Lastname:</strong> {tenant.iceLastname}
						</p>
						<p>
							<strong>Phone:</strong> {tenant.icePhone}
						</p>
						<p>
							<strong>Email:</strong> {tenant.iceEmail}
						</p>
						<p>
							<strong>ID Number:</strong> {tenant.iceIdNumber}
						</p>
						<p>
							<strong>National Insurance Number:</strong>{' '}
							{tenant.iceNationalInsuranceNumber}
						</p>
						<p>
							<strong>Address:</strong> {tenant.iceAddress}
						</p>
					</Card>
					<Card className="p-4">
						<h2 className="text-xl font-bold mb-3">
							Contract Dates
						</h2>
						<p>
							<strong>Contract Date:</strong>{' '}
							{tenant.contractDate}
						</p>
						<p>
							<strong>Start Date:</strong>{' '}
							{tenant.contractDateStart}
						</p>
						<p>
							<strong>End Date:</strong> {tenant.contractDateEnd}
						</p>
						<p>
							<strong>Handoff Date:</strong>{' '}
							{tenant.contractDateHandoff}
						</p>
					</Card>
					<Card className="p-4">
						<h2 className="text-xl font-bold mb-3">Insurance</h2>
						<p>
							<strong>Insurance Name:</strong>{' '}
							{tenant.insuranceName}
						</p>
						<p>
							<strong>Insurance Date:</strong>{' '}
							{tenant.insuranceDate}
						</p>
						<p>
							<strong>Insurance Number:</strong>{' '}
							{tenant.insuranceNumber}
						</p>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default TenantDetails;
