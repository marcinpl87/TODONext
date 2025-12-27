'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from './ui/card';
import { Button } from './ui/button';
import PropertyForm from './PropertyForm';
import type { Property } from '../types/realEstate';

type PropertyCreateProps = {
	addProperty: (property: Property, callback: () => void) => void;
};

const PropertyCreate: React.FC<PropertyCreateProps> = ({ addProperty }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [name, setName] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [floor, setFloor] = useState<number>(1);
	const [code, setCode] = useState<string>('');
	const [wifiSsid, setWifiSsid] = useState<string>('');
	const [wifiPass, setWifiPass] = useState<string>('');
	const [rooms, setRooms] = useState<number>(1);
	const [lockIn, setLockIn] = useState<string>('');
	const [lockOut, setLockOut] = useState<string>('');
	const [safe, setSafe] = useState<string>('');
	const [insuranceName, setInsuranceName] = useState<string>('');
	const [insuranceDate, setInsuranceDate] = useState<string>('');
	const [insuranceNumber, setInsuranceNumber] = useState<string>('');
	const [notes, setNotes] = useState<string>('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addProperty(
			{
				id: uuidv4(),
				name,
				address,
				floor,
				code,
				wifiSsid,
				wifiPass,
				rooms,
				lockIn,
				lockOut,
				safe,
				creationTimestamp: Date.now(),
				insuranceName,
				insuranceDate,
				insuranceNumber,
				notes,
			},
			() => {
				setName('');
				setAddress('');
				setFloor(0);
				setCode('');
				setWifiSsid('');
				setWifiPass('');
				setRooms(0);
				setLockIn('');
				setLockOut('');
				setSafe('');
				setInsuranceName('');
				setInsuranceDate('');
				setInsuranceNumber('');
				setNotes('');
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
						floor={floor}
						setFloor={setFloor}
						code={code}
						setCode={setCode}
						wifiSsid={wifiSsid}
						setWifiSsid={setWifiSsid}
						wifiPass={wifiPass}
						setWifiPass={setWifiPass}
						rooms={rooms}
						setRooms={setRooms}
						lockIn={lockIn}
						setLockIn={setLockIn}
						lockOut={lockOut}
						setLockOut={setLockOut}
						safe={safe}
						setSafe={setSafe}
						insuranceName={insuranceName}
						setInsuranceName={setInsuranceName}
						insuranceDate={insuranceDate}
						setInsuranceDate={setInsuranceDate}
						insuranceNumber={insuranceNumber}
						setInsuranceNumber={setInsuranceNumber}
						notes={notes}
						setNotes={setNotes}
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
