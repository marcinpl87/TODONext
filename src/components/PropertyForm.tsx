'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

type PropertyFormProps = {
	header: string;
	name: string;
	setName: (value: React.SetStateAction<string>) => void;
	address: string;
	setAddress: (value: React.SetStateAction<string>) => void;
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
	floor: number;
	setFloor: (value: React.SetStateAction<number>) => void;
	code: string;
	setCode: (value: React.SetStateAction<string>) => void;
	wifiSsid: string;
	setWifiSsid: (value: React.SetStateAction<string>) => void;
	wifiPass: string;
	setWifiPass: (value: React.SetStateAction<string>) => void;
	rooms: number;
	setRooms: (value: React.SetStateAction<number>) => void;
	lockIn: string;
	setLockIn: (value: React.SetStateAction<string>) => void;
	lockOut: string;
	setLockOut: (value: React.SetStateAction<string>) => void;
	safe: string;
	setSafe: (value: React.SetStateAction<string>) => void;
	insuranceName: string;
	setInsuranceName: (value: React.SetStateAction<string>) => void;
	insuranceDate: string;
	setInsuranceDate: (value: React.SetStateAction<string>) => void;
	insuranceNumber: string;
	setInsuranceNumber: (value: React.SetStateAction<string>) => void;
	notes: string;
	setNotes: (value: React.SetStateAction<string>) => void;
};

const PropertyForm: React.FC<PropertyFormProps> = ({
	header,
	name,
	setName,
	address,
	setAddress,
	handleCancel,
	handleSubmit,
	floor,
	setFloor,
	code,
	setCode,
	wifiSsid,
	setWifiSsid,
	wifiPass,
	setWifiPass,
	rooms,
	setRooms,
	lockIn,
	setLockIn,
	lockOut,
	setLockOut,
	safe,
	setSafe,
	insuranceName,
	setInsuranceName,
	insuranceDate,
	setInsuranceDate,
	insuranceNumber,
	setInsuranceNumber,
	notes,
	setNotes,
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
					placeholder="Property name..."
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
					placeholder="Property address..."
					value={address}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setAddress(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="floor">Floor</Label>
				<Input
					id="floor"
					type="number"
					placeholder="Floor..."
					value={floor}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setFloor(Number(e.target.value))
					}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="code">Code</Label>
				<Input
					id="code"
					placeholder="Code..."
					value={code}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setCode(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="wifiSsid">WiFi SSID</Label>
				<Input
					id="wifiSsid"
					placeholder="WiFi SSID..."
					value={wifiSsid}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setWifiSsid(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="wifiPass">WiFi Password</Label>
				<Input
					id="wifiPass"
					placeholder="WiFi Password..."
					value={wifiPass}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setWifiPass(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="rooms">Rooms</Label>
				<Input
					id="rooms"
					type="number"
					placeholder="Rooms..."
					value={rooms}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setRooms(Number(e.target.value))
					}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="lockIn">Lock In</Label>
				<Input
					id="lockIn"
					placeholder="Lock In..."
					value={lockIn}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setLockIn(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="lockOut">Lock Out</Label>
				<Input
					id="lockOut"
					placeholder="Lock Out..."
					value={lockOut}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setLockOut(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="safe">Safe</Label>
				<Input
					id="safe"
					placeholder="Safe..."
					value={safe}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSafe(e.target.value)
					}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="insuranceName">Insurance Name</Label>
				<Input
					id="insuranceName"
					placeholder="Insurance Name..."
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
					placeholder="Insurance Date..."
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
					placeholder="Insurance Number..."
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

export default PropertyForm;
