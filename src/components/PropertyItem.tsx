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
