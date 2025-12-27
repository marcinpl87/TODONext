'use client';

import React, { useEffect, useState } from 'react';
import PropertyCreate from '../../components/PropertyCreate';
import PropertyItem from '../../components/PropertyItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import { useProperties, useLogin } from '../../hooks';
import type { Property } from '../../types/realEstate';

const Home: React.FC = () => {
	const login = useLogin();
	const { properties: lsProperties, isLoading: isPropertyLoading } =
		useProperties();
	const [propertiesState, setPropertiesState] = useState<Property[]>([]);
	const addProperty = (property: Property, callback: () => void) => {
		const cache = [...propertiesState];
		setPropertiesState([property, ...propertiesState]);
		callback();
		fetch('/api/property', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				property,
			}),
		}).catch(() => {
			setPropertiesState([...cache]); // revert back to the previous state
		});
	};
	const updateProperty = (
		updatedProperty: Property,
		callback: () => void,
	) => {
		const cache = [...propertiesState];
		setPropertiesState([
			...propertiesState.map(property =>
				property.id === updatedProperty.id ? updatedProperty : property,
			),
		]);
		callback();
		fetch(`/api/property/${updatedProperty.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				property: updatedProperty,
			}),
		}).catch(() => {
			setPropertiesState([...cache]); // revert back to the previous state
		});
	};
	const removeProperty = (id: string, name: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${name}" (the Property will be permanently deleted) ?`,
			)
		) {
			const cache = [...propertiesState];
			setPropertiesState([
				...propertiesState.filter(property => property.id !== id),
			]);
			fetch(`/api/property/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setPropertiesState([...cache]); // revert back to the previous state
			});
		}
	};

	useEffect(() => {
		setPropertiesState(lsProperties);
	}, [lsProperties]);

	if (isPropertyLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Properties</h1>
			<PropertyCreate addProperty={addProperty} />
			{propertiesState
				.sort(
					(a, b) =>
						(b.creationTimestamp || 0) - (a.creationTimestamp || 0),
				)
				.map(property => (
					<PropertyItem
						key={property.id}
						property={property}
						updateProperty={updateProperty}
						removeProperty={removeProperty}
					/>
				))}
		</div>
	);
};

export default Home;
