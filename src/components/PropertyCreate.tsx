'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from './ui/card';
import { Button } from './ui/button';
import PropertyForm from './PropertyForm';
import type { Property } from '../types';

type PropertyCreateProps = {
	addProperty: (property: Property, callback: () => void) => void;
};

const PropertyCreate: React.FC<PropertyCreateProps> = ({ addProperty }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [address, setAddress] = useState<string>('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addProperty(
			{
				id: uuidv4(),
				name,
				address,
				floor: 1,
				code: '',
				wifiSsid: '',
				wifiPass: '',
				rooms: 1,
				lockIn: '',
				lockOut: '',
				safe: '',
				creationTimestamp: Date.now(),
				insuranceName: '',
				insuranceDate: '',
				insuranceNumber: '',
				notes: '',
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
					<PropertyForm
						header="New Property"
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
					New Property
				</Button>
			)}
		</>
	);
};

export default PropertyCreate;
