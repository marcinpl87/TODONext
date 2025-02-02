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
	handleCancel: () => void;
	handleSubmit: (e: FormEvent) => void;
};

const TenantForm: React.FC<TenantFormProps> = ({
	header,
	name,
	setName,
	address,
	setAddress,
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
			{/* Add other fields here */}
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
