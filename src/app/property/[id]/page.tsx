'use client';

import React, { useEffect, useState } from 'react';
import { Property } from '../../../types';
import { Card } from '../../../components/ui/card';
import LoadingIconTwo from '../../../components/LoadingIconTwo';

type PropertyDetailsProps = {
	params: { id: string };
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ params }) => {
	const [property, setProperty] = useState<Property | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (params.id) {
			fetch(`/api/property/${params.id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => response.json())
				.then(data => {
					setProperty(data.data);
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

	if (!property) {
		return <div>Property not found</div>;
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">{property.name}</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
				<Card className="p-4">
					<h2 className="text-xl font-bold mb-3">
						Property Information
					</h2>
					<p>
						<strong>Address:</strong> {property.address}
					</p>
					<p>
						<strong>Floor:</strong> {property.floor}
					</p>
					<p>
						<strong>Code:</strong> {property.code}
					</p>
					<p>
						<strong>WiFi SSID:</strong> {property.wifiSsid}
					</p>
					<p>
						<strong>WiFi Password:</strong> {property.wifiPass}
					</p>
					<p>
						<strong>Rooms:</strong> {property.rooms}
					</p>
					<p>
						<strong>Lock In:</strong> {property.lockIn}
					</p>
					<p>
						<strong>Lock Out:</strong> {property.lockOut}
					</p>
					<p>
						<strong>Safe:</strong> {property.safe}
					</p>
					<p>
						<strong>Insurance Name:</strong>{' '}
						{property.insuranceName}
					</p>
					<p>
						<strong>Insurance Date:</strong>{' '}
						{property.insuranceDate}
					</p>
					<p>
						<strong>Insurance Number:</strong>{' '}
						{property.insuranceNumber}
					</p>
				</Card>
				<Card className="p-4">
					<h2 className="text-xl font-bold mb-3">Notes</h2>
					<p>
						<strong>Notes:</strong> {property.notes}
					</p>
				</Card>
			</div>
		</div>
	);
};

export default PropertyDetails;
