'use client';

import React, { useState, FormEvent } from 'react';
import { PenLine, Trash } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Card, CardContent } from './ui/card';
import PropertyForm from './PropertyForm';
import IconButton from './IconButton';
import type { Property } from '../types';

type PropertyItemProps = {
	property: Property;
	updateProperty: (property: Property, callback: () => void) => void;
	removeProperty: (id: string, name: string) => void;
};

const PropertyItem: React.FC<PropertyItemProps> = ({
	property,
	updateProperty,
	removeProperty,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>(property.name);
	const [address, setAddress] = useState<string>(property.address);
	const [floor, setFloor] = useState<number>(property.floor);
	const [code, setCode] = useState<string>(property.code);
	const [wifiSsid, setWifiSsid] = useState<string>(property.wifiSsid);
	const [wifiPass, setWifiPass] = useState<string>(property.wifiPass);
	const [rooms, setRooms] = useState<number>(property.rooms);
	const [lockIn, setLockIn] = useState<string>(property.lockIn);
	const [lockOut, setLockOut] = useState<string>(property.lockOut);
	const [safe, setSafe] = useState<string>(property.safe);
	const [insuranceName, setInsuranceName] = useState<string>(
		property.insuranceName,
	);
	const [insuranceDate, setInsuranceDate] = useState<string>(
		property.insuranceDate,
	);
	const [insuranceNumber, setInsuranceNumber] = useState<string>(
		property.insuranceNumber,
	);
	const [notes, setNotes] = useState<string>(property.notes);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateProperty(
			{
				...property,
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
				insuranceName,
				insuranceDate,
				insuranceNumber,
				notes,
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
		removeProperty(property.id, property.name);
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<PropertyForm
					header="Edit Property"
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
			) : (
				<CardContent className="mt-5">
					<div className="text-2xl font-bold underline break-words pb-2">
						<Link href={`property/${property.id}`}>
							{property.name}
						</Link>
					</div>
					{property.address && (
						<p className="text-md text-muted-foreground pb-2 whitespace-pre-line break-words">
							{property.address}
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

export default PropertyItem;
