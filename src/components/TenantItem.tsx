'use client';

import React, { useState, FormEvent } from 'react';
import { PenLine, Trash } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import TenantForm from './TenantForm';
import IconButton from './IconButton';
import type { Tenant } from '../types';

type TenantItemProps = {
	tenant: Tenant;
	updateTenant: (tenant: Tenant, callback: () => void) => void;
	removeTenant: (id: string, name: string) => void;
};

const TenantItem: React.FC<TenantItemProps> = ({
	tenant,
	updateTenant,
	removeTenant,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [name, setName] = useState<string>(tenant.name);
	const [address, setAddress] = useState<string>(tenant.address);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateTenant(
			{
				...tenant,
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
		removeTenant(tenant.id, tenant.name);
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<TenantForm
					header="Edit Tenant"
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
						<Link href={`tenant/${tenant.id}`}>{tenant.name}</Link>
					</div>
					{tenant.address && (
						<p className="text-md text-muted-foreground pb-2 whitespace-pre-line break-words">
							{tenant.address}
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

export default TenantItem;
